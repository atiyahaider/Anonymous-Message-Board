'use strict';

const express     = require('express');
const bodyParser  = require('body-parser');
const expect      = require('chai').expect;
const cors        = require('cors');
const helmet      = require('helmet');

const apiRoutes         = require('./routes/api.js');
const fccTestingRoutes  = require('./routes/fcctesting.js');
const runner            = require('./test-runner');

const app = express();
app.use( helmet( {
          noCache             : true,
          hidePoweredBy       : { setTo: 'PHP 4.2.0' },
          xssFilter           : true,
          frameguard          : { action: 'sameorigin' },
          dnsPrefetchControl  : { allow: false },
          referrerPolicy      : { policy: 'same-origin' }
        } ) 
       );

app.use(cors({origin: '*'})); //For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Routing for API 
app.use('/api', apiRoutes);
    
//Set static folder
app.use(express.static(process.cwd() + '/client/public'));

//Index page (static HTML)
app.route('/*')
  .get(function (req, res) {
    res.sendFile(process.cwd()  + '/client/public/index.html');
  });

//For FCC testing purposes
fccTestingRoutes(app);
  
//404 Middleware Not found
app.use(function(req, res, next) {
  return next({status: 404, message: 'Path Not Found'})
});

// Error Handling
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }

  console.log(errCode + ' ' + errMessage)
  res.status(errCode).json({error: errMessage});  
})

//initialize db before starting up the server
const initDb = require("./util/db").initDb;
initDb( (err) => {
    if (err) 
        console.log('Error connecting to DB', err.name + ': ' + err.message);
    else {
      //Start our server and tests!
      app.listen(process.env.PORT || 3000, function () {
        console.log("Listening on port " + process.env.PORT);
        if(process.env.NODE_ENV==='test') {
          console.log('Running Tests...');
          setTimeout(function () {
            try {
              runner.run();
            } catch(e) {
              var error = e;
                console.log('Tests are not valid:');
                console.log(error);
            }
          }, 1500);
        }
      });
    }
});  

module.exports = app; //for unit/functional testing