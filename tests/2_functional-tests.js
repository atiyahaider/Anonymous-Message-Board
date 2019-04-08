/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

const delete_password = 'password';
const incorrectId = '5c44d8b3d45c6035742edfe2';

chai.use(chaiHttp);

suite('Functional Tests', () => {

    let firstThreadId  = '';
    let secondThreadId = '';
    let repliesLength = 0;
    let replyId = '';
    let replyId2 = '';

    suite('API ROUTING FOR /api/threads/:board', () => {

        suite('POST', () => {
            test('New thread on board "testboard" (POST /api/threads/:board)', done => {
              chai.request(server)
                .post('/api/threads/testboard')
                .send({
                  title: 'Thread 1',
                  text: 'This is thread 1 in testboard',
                  delete_password: delete_password
                })
                .end( (err, res) => {
                    assert.equal(res.status, 201);
                    assert.equal(res.body.board, 'testboard');
                    assert.equal(res.body.title, 'Thread 1');
                    assert.equal(res.body.text, 'This is thread 1 in testboard');
                    assert.property(res.body, 'created_on');
                    assert.property(res.body, '_id');
                    firstThreadId = res.body._id;
                    done();
                });
            });

            test('New thread on board "testboard" (POST /api/threads/:board)', done => {
              chai.request(server)
                .post('/api/threads/testboard')
                .send({
                  title: 'Thread 2',
                  text: 'This is thread 2 in testboard',
                  delete_password: delete_password
                })
                .end(( err, res) => {
                    assert.equal(res.status, 201);
                    assert.equal(res.body.board, 'testboard');
                    assert.equal(res.body.title, 'Thread 2');
                    assert.equal(res.body.text, 'This is thread 2 in testboard');
                    assert.property(res.body, 'created_on');
                    assert.property(res.body, '_id');
                    secondThreadId = res.body._id;
                    done();
                });
            });

            test('New thread on board "testboard", with no title (POST /api/threads/:board)', done => {
              chai.request(server)
                .post('/api/threads/testboard')
                .send({
                  title: '',
                  text: 'This is thread 3 in testboard',
                  delete_password: delete_password
                })
                .end(( err, res) => {
                    assert.equal(res.status, 400);
                    assert.equal(res.body.error, 'Title is required');
                    done();
                });
            });

            test('New thread on board "testboard", with no text (POST /api/threads/:board)', done => {
              chai.request(server)
                .post('/api/threads/testboard')
                .send({
                  title: 'Thread 3',
                  text: 'This is thread 3 in testboard',
                  delete_password: ''
                })
                .end(( err, res) => {
                    assert.equal(res.status, 400);
                    assert.equal(res.body.error, 'Password to delete is required');
                    done();
                });
            });

            test('New thread on board "testboard", with no password (POST /api/threads/:board)', done => {
              chai.request(server)
                .post('/api/threads/testboard')
                .send({
                  title: 'Thread 3',
                  text: '',
                  delete_password: delete_password
                })
                .end(( err, res) => {
                    assert.equal(res.status, 400);
                    assert.equal(res.body.error, 'Text is required');
                    done();
                });
            });
        });

        suite('GET', () => {
            test( 'List the 10 most recent threads with the 3 most recent replies (GET /api/threads/:board)', done => {
              chai.request( server )
                .get('/api/threads/testboard')
                .end( (err, res) => {
                    assert.equal(res.status, 200);
                    assert.isArray(res.body.data);
                    assert.isAtMost(res.body.data.length, 10);
                    assert.isNumber(res.body.total);
                    if (res.body.data.length > 0) {
                        assert.property(res.body.data[0], '_id');
                        assert.property(res.body.data[0], 'title');
                        assert.property(res.body.data[0], 'text');
                        assert.property(res.body.data[0], 'bumped_on');
                        assert.property(res.body.data[0], 'reported');
                        assert.isNumber(res.body.data[0].reply_count);
                        assert.notProperty(res.body.data[0], 'delete_password');
                        assert.isArray(res.body.data[0].replies);
                        assert.isAtMost(res.body.data[0].replies.length, 3);
                        res.body.data[0].replies.map(reply => {
                            assert.property(reply, '_id');
                            assert.property(reply, 'text');
                            assert.property(reply, 'bumped_on');
                            assert.notProperty(reply, 'delete_password');
                            assert.notProperty(reply, 'reported');
                        })
                        repliesLength = res.body.data[0].replies.length;
                    }
                    done();
                });
            });
        });

        suite('PUT', () => {
            test('Report a thread on board "testboard" (PUT /api/threads/:board)', done => {
              chai.request(server)
                .put('/api/threads/testboard')
                .send({
                    thread_id: firstThreadId
                })
                .end( (err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.success, firstThreadId + ' reported successfully');
                    done();
                });
            });

            test('Report a thread with a missing Id, on board "testboard" (PUT /api/threads/:board)', done => {
              chai.request(server)
                .put('/api/threads/testboard')
                .send({})
                .end( (err, res) => {
                    assert.equal(res.status, 400);
                    assert.equal(res.body.error, 'Thread Id missing');
                    done();
                });
            });

            test('Report a thread with an invalid Id, on board "testboard" (PUT /api/threads/:board)', done => {
              chai.request(server)
                .put('/api/threads/testboard')
                .send({
                    thread_id: 'abcd'
                })
                .end( (err, res) => {
                    assert.equal(res.status, 400);
                    assert.equal(res.body.error, 'Not a valid Thread Id');
                    done();
                });
            });

            test('Report a thread with an Id not in db, on board "testboard" (PUT /api/threads/:board)', done => {
              chai.request(server)
                .put('/api/threads/testboard')
                .send({
                    thread_id: incorrectId
                })
                .end( (err, res) => {
                    assert.equal(res.status, 404);
                    assert.equal(res.body.error, 'Thread Id ' + incorrectId + ' does not exist');
                    done();
                });
            });
        });

        suite('DELETE', () => {
            test('Delete a thread on board "testboard", with a missing threadId (DELETE /api/threads/:board)', done => {
              chai.request(server)
                .delete('/api/threads/testboard')
                .send({})
                .end( (err, res) => {
                    assert.equal(res.status, 400);
                    assert.equal(res.body.error, 'Thread Id missing');
                    done();
                });
            });

            test('Delete a thread on board "testboard", with an invalid thread Id (DELETE /api/threads/:board)', done => {
              chai.request(server)
                .delete('/api/threads/testboard')
                .send({
                    thread_id: 'abcd',
                    delete_password: delete_password
                })
                .end( (err, res) => {
                  assert.equal(res.status, 400);
                  assert.equal(res.body.error, 'Not a valid Thread Id');
                  done();
               });
            });

            test('Delete a thread on board "testboard", with an id not in db (DELETE /api/threads/:board)', done => {
              chai.request(server)
                .delete('/api/threads/testboard')
                .send({
                    thread_id: incorrectId,
                    delete_password: delete_password
                })
                .end( (err, res) => {
                    assert.equal(res.status, 404);
                    assert.equal(res.body.error, 'Thread Id ' + incorrectId + ' does not exist');
                    done();
                });
            });

          
            test('Delete the first thread on board "testboard", with incorrect password (DELETE /api/threads/:board)', done => {
              chai.request(server)
                .delete('/api/threads/testboard')
                .send({
                    thread_id: firstThreadId,
                    delete_password: 'some password'
                })
                .end( (err, res) => {
                    assert.equal(res.status, 401);
                    assert.equal(res.body.error, 'Incorrect password');
                    done();
                });
            });

          
            test('Delete the first thread on board "testboard", with correct password (DELETE /api/threads/:board)', done => {
              chai.request(server)
                .delete('/api/threads/testboard')
                .send({
                    thread_id: firstThreadId,
                    delete_password: delete_password
                })
                .end( (err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.success, 'Thread Id ' + firstThreadId + ' deleted successfully');
                    done();
                });
            });
        });

    });
  
    suite('API ROUTING FOR /api/replies/:board', () => {

      suite('POST', () => {
          test( 'Post a reply to an existing thread (POST /api/replies/:board)', done => {
            chai.request( server )
              .post('/api/replies/testboard')
              .send( {
                thread_id: secondThreadId,
                text: 'This is a reply for the second thread',
                delete_password: delete_password
              } )
              .end( (err, res) => {
                  assert.equal(res.status, 201);
                  assert.equal(res.body.board, 'testboard');
                  assert.equal(res.body.title, 'Thread 2');
                  assert.equal(res.body.text, 'This is thread 2 in testboard');
                  assert.property(res.body, 'created_on');
                  assert.property(res.body, 'bumped_on');
                  assert.isBoolean(res.body.reported);
                  assert.property(res.body, '_id');
                  assert.notProperty(res.body, 'delete_password');
                  
                  assert.isArray(res.body.replies);
                  let n = res.body.replies.length;
                  assert.equal(res.body.replies[n-1].text, 'This is a reply for the second thread');
                  assert.property(res.body.replies[n-1], 'created_on');
                  assert.property(res.body.replies[n-1], 'bumped_on');
                  assert.isFalse(res.body.replies[n-1].reported);
                  assert.property(res.body.replies[n-1], '_id');
                  assert.lengthOf(res.body.replies, repliesLength + 1);
              
                  replyId = res.body.replies[n-1]._id;
                  done();
              })
          });;
          
         test( 'Post a reply to an incorrect threadId (POST /api/replies/:board)', done => {
            chai.request( server )
              .post('/api/replies/testboard')
              .send( {
                thread_id: incorrectId,
                text: 'This is a reply for the second thread',
                delete_password: delete_password
              } )
              .end( (err, res) => {
                  assert.equal(res.status, 404);
                  assert.equal(res.body.error, 'Thread Id ' + incorrectId + ' does not exist');
                  done();              
              })
          });      

          test( 'Post a reply with a missing threadId (POST /api/replies/:board)', done => {
            chai.request( server )
              .post('/api/replies/testboard')
              .send( {
                text: 'This is a reply for the second thread',
                delete_password: delete_password
              } )
              .end( (err, res) => {
                  assert.equal(res.status, 400);
                  assert.equal(res.body.error, 'Thread Id missing');
                  done();              
              })
          });      

          test( 'Post a reply to an invalid threadId (POST /api/replies/:board)', done => {
            chai.request( server )
              .post('/api/replies/testboard')
              .send( {
                thread_id: 'abcd',
                text: 'This is a reply for the second thread',
                delete_password: delete_password
              } )
              .end( (err, res) => {
                  assert.equal(res.status, 400);
                  assert.equal(res.body.error, 'Not a valid Thread Id');
                  done();              
              })
          });      

          test( 'Post a reply to a thread with missing text (POST /api/replies/:board)', done => {
            chai.request( server )
              .post('/api/replies/testboard')
              .send( {
                thread_id: secondThreadId,
                text: '',
                delete_password: delete_password
              } )
              .end( (err, res) => {
                  assert.equal(res.status, 400);
                  assert.equal(res.body.error, 'Text is required');
                  done();              
              })
          });      

          test( 'Post a reply to a thread with missing password (POST /api/replies/:board)', done => {
            chai.request( server )
              .post('/api/replies/testboard')
              .send( {
                thread_id: secondThreadId,
                text: 'This is a reply for the second thread',
                delete_password: ''
              } )
              .end( (err, res) => {
                  assert.equal(res.status, 400);
                  assert.equal(res.body.error, 'Password to delete is required');
                  done();              
              })
          });      
        });

      
        suite('GET', () => {
            test( 'Get all replies for a thread (GET /api/replies/:board)', done => {
              chai.request( server )
                .get('/api/replies/testboard')
                .query({ 
                    thread_id: secondThreadId 
                })              
                .end( (err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body);
                    assert.equal(res.body._id, secondThreadId);    
                    assert.equal(res.body.board, 'testboard');
                    assert.equal(res.body.title, 'Thread 2');
                    assert.equal(res.body.text, 'This is thread 2 in testboard');
                    assert.property(res.body, 'created_on');
                    assert.property(res.body, 'bumped_on');
                    assert.isBoolean(res.body.reported);
                    assert.notProperty(res.body, 'delete_password');
                    assert.isArray(res.body.replies);                
                
                    if (res.body.replies.length > 0) {
                      assert.property(res.body.replies[0], '_id');
                      assert.equal(res.body.replies[0].text, 'This is a reply for the second thread');
                      assert.property(res.body.replies[0], 'created_on');
                      assert.property(res.body.replies[0], 'bumped_on');
                      assert.isFalse(res.body.replies[0].reported);
                      assert.notProperty(res.body.replies[0], 'delete_password');
                    }
                    done();
                });
            });
        });

      
        suite('PUT', () => {
            test('Report a reply for a thread on board "testboard" (PUT /api/replies/:board)', done => {
              chai.request(server)
                .put('/api/replies/testboard')
                .send({
                    thread_id: secondThreadId,
                    reply_id: replyId
               })
                .end( (err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.success, replyId + ' reported successfully');
                    done();
                });
            });
              
            test('Report a reply for a thread on board "testboard", with incorrect threadid/replyid (PUT /api/replies/:board)', done => {
              chai.request(server)
                .put('/api/replies/testboard')
                .send({
                    thread_id: incorrectId,
                    reply_id: incorrectId
                })
                .end( (err, res) => {
                    assert.equal(res.status, 404);
                    assert.equal(res.body.error, 'Thread Id: ' + incorrectId + ' and/or Reply Id: ' + incorrectId + ' do not exist');
                    done();
                });
            });

            test('Report a reply for a thread on board "testboard", with missing threadid (PUT /api/replies/:board)', done => {
              chai.request(server)
                .put('/api/replies/testboard')
                .send({
                    thread_id: '',
                    reply_id: replyId
                })
                .end( (err, res) => {
                    assert.equal(res.status, 400);
                    assert.equal(res.body.error, 'Not a valid Thread Id');
                    done();
                });
            });

            test('Report a reply for a thread on board "testboard", with missing replyId (PUT /api/replies/:board)', done => {
              chai.request(server)
                .put('/api/replies/testboard')
                .send({
                    thread_id: secondThreadId,
                    reply_id: ''
                })
                .end( (err, res) => {
                    assert.equal(res.status, 400);
                    assert.equal(res.body.error, 'Not a valid Reply Id');
                    done();
                });
            });
        });
      
        suite('DELETE', () => {
            test('Delete a reply for a thread on board "testboard", with missing threadid (DELETE /api/replies/:board)', done => {
              chai.request(server)
                .delete('/api/replies/testboard')
                .send({
                    thread_id: '',
                    reply_id: replyId,
                    delete_password: delete_password
                })
                .end( (err, res) => {
                    assert.equal(res.status, 400);
                    assert.equal(res.body.error, 'Not a valid Thread Id');
                    done();
                });
            });

            test('Delete a reply for a thread on board "testboard", with missing replyid (DELETE /api/replies/:board)', done => {
              chai.request(server)
                .delete('/api/replies/testboard')
                .send({
                    thread_id: secondThreadId,
                    reply_id: '',
                    delete_password: delete_password
                })
                .end( (err, res) => {
                    assert.equal(res.status, 400);
                    assert.equal(res.body.error, 'Not a valid Reply Id');
                    done();
                });
            });

            test('Delete a reply for a thread on board "testboard", with incorrect threadid/replyid (DELETE /api/replies/:board)', done => {
              chai.request(server)
                .delete('/api/replies/testboard')
                .send({
                    thread_id: incorrectId,
                    reply_id: incorrectId,
                    delete_password: delete_password
                })
                .end( (err, res) => {
                    assert.equal(res.status, 404);
                    assert.equal(res.body.error, 'Thread Id: ' + incorrectId + ' and/or Reply Id: ' + incorrectId + ' do not exist');
                    done();
                });
            });
          
          test('Delete a reply for a thread on board "testboard", with incorrect password (DELETE /api/replies/:board)', done => {
              chai.request(server)
                .delete('/api/replies/testboard')
                .send({
                    thread_id: secondThreadId,
                    reply_id: replyId,
                    delete_password: 'some password'
                })
                .end( (err, res) => {
                    assert.equal(res.status, 401);
                    assert.equal(res.body.error, 'Incorrect password');
                    done();
                });
            });
          
            test('Delete a reply (change text to [deleted]) for a thread on board "testboard", with correct password (DELETE /api/replies/:board)', done => {
              chai.request(server)
                .delete('/api/replies/testboard')
                .send({
                    thread_id: secondThreadId,
                    reply_id: replyId,
                    delete_password: delete_password
                })
                .end( (err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.success, 'Reply Id ' + replyId + ' deleted successfully');
                    done();
                });
            });
        });

    });

    suite('API ROUTING FOR /threads/edit/:board', () => {
        suite('PUT', () => {
            test('Update a thread on board "testboard" (PUT /api/threads/edit/:board)', done => {
              chai.request(server)
                .put('/api/threads/edit/testboard')
                .send({
                    thread_id: secondThreadId,
                    title: 'New title',
                    text: 'New text',
                    delete_password: delete_password
                })
                .end( (err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.success, 'Thread Id ' + secondThreadId + ' updated successfully');
                    done();
                });
            });

            test('Update a thread with a missing Thread Id, on board "testboard" (PUT /api/threads/edit/:board)', done => {
              chai.request(server)
                .put('/api/threads/edit/testboard')
                .send({})
                .end( (err, res) => {
                    assert.equal(res.status, 400);
                    assert.equal(res.body.error, 'Thread Id missing');
                    done();
                });
            });

            test('Update a thread with an invalid thread Id, on board "testboard" (PUT /api/threads/edit/:board)', done => {
              chai.request(server)
                .put('/api/threads/edit/testboard')
                .send({
                    thread_id: 'abcd',
                    title: 'New title',
                    text: 'New text',
                    delete_password: delete_password
                })
                .end( (err, res) => {
                    assert.equal(res.status, 400);
                    assert.equal(res.body.error, 'Not a valid Thread Id');
                    done();
                });
            });

            test('Update a thread with an Id not in db, on board "testboard" (PUT /api/threads/edit/:board)', done => {
              chai.request(server)
                .put('/api/threads/edit/testboard')
                .send({
                    thread_id: incorrectId,
                    title: 'New title',
                    text: 'New text',
                    delete_password: delete_password
                })
                .end( (err, res) => {
                    assert.equal(res.status, 404);
                    assert.equal(res.body.error, 'Thread Id ' + incorrectId + ' does not exist');
                    done();
                });
            });

            test('Update a thread with an incorrect password, on board "testboard" (PUT /api/threads/edit/:board)', done => {
              chai.request(server)
                .put('/api/threads/edit/testboard')
                .send({
                    thread_id: secondThreadId,
                    title: 'New title',
                    text: 'New text',
                    delete_password: 'some password'
                })
                .end( (err, res) => {
                    assert.equal(res.status, 401);
                    assert.equal(res.body.error, 'Incorrect password');
                    done();
                });
            });

            test('Update a thread that has been reported, on board "testboard" (PUT /api/threads/edit/:board)', done => {
              //report the thread first
              chai.request(server)
                .put('/api/threads/testboard')
                .send({
                    thread_id: secondThreadId
                })
                .end( (err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.success, secondThreadId + ' reported successfully');

                    chai.request(server)
                      .put('/api/threads/edit/testboard')
                      .send({
                          thread_id: secondThreadId,
                          title: 'New title',
                          text: 'New text',
                          delete_password: delete_password
                      })
                      .end( (err, res) => {
                          assert.equal(res.status, 403);
                          assert.equal(res.body.error, 'This thread has been reported, and therefore cannot be edited');
                          done();
                      });
                });
            });
        });
    });

    suite('API ROUTING FOR /replies/edit/:board', () => {
        suite('PUT', () => {
            test('Update a reply on board "testboard" (PUT /api/replies/edit/:board)', done => {
              //create a new reply first
              chai.request( server )
                .post('/api/replies/testboard')
                .send( {
                  thread_id: secondThreadId,
                  text: 'This is a second reply for the second thread',
                  delete_password: delete_password
                } )
                .end( (err, res) => {
                    let n = res.body.replies.length;
                    replyId2 = res.body.replies[n-1]._id;

                    chai.request(server)
                      .put('/api/replies/edit/testboard')
                      .send({
                          thread_id: secondThreadId,
                          reply_id: replyId2,
                          text: 'Update text',
                          delete_password: delete_password
                      })
                      .end( (err, res) => {
                          assert.equal(res.status, 200);
                          assert.equal(res.body.success, 'Reply Id ' + replyId2 + ' updated successfully');
                          done();
                      });
                })
            });

            test('Update a reply with a missing threadId, on board "testboard" (PUT /api/replies/edit/:board)', done => {
              chai.request(server)
                .put('/api/replies/edit/testboard')
                .send({})
                .end( (err, res) => {
                    assert.equal(res.status, 400);
                    assert.equal(res.body.error, 'Thread Id missing');
                    done();
                });
            });

            test('Update a reply with an invalid threadId, on board "testboard" (PUT /api/replies/edit/:board)', done => {
              chai.request(server)
                .put('/api/replies/edit/testboard')
                .send({
                    thread_id: 'abcd',
                    reply_id: replyId2,
                    text: 'Update text',
                    delete_password: delete_password
                })
                .end( (err, res) => {
                    assert.equal(res.status, 400);
                    assert.equal(res.body.error, 'Not a valid Thread Id');
                    done();
                });
            });

            test('Update a reply with a missing replyId, on board "testboard" (PUT /api/replies/edit/:board)', done => {
              chai.request(server)
                .put('/api/replies/edit/testboard')
                .send({
                    thread_id: secondThreadId,
                    text: 'Update text',
                    delete_password: delete_password
                })
                .end( (err, res) => {
                    assert.equal(res.status, 400);
                    assert.equal(res.body.error, 'Reply Id missing');
                    done();
                });
            });

            test('Update a reply with an invalid replyId, on board "testboard" (PUT /api/replies/edit/:board)', done => {
              chai.request(server)
                .put('/api/replies/edit/testboard')
                .send({
                    thread_id: secondThreadId,
                    reply_id: 'abcd',
                    text: 'Update text',
                    delete_password: delete_password
                })
                .end( (err, res) => {
                    assert.equal(res.status, 400);
                    assert.equal(res.body.error, 'Not a valid Reply Id');
                    done();
                });
            });

            test('Update a reply with Ids not in db, on board "testboard" (PUT /api/replies/edit/:board)', done => {
              chai.request(server)
                .put('/api/replies/edit/testboard')
                .send({
                    thread_id: incorrectId,
                    reply_id: incorrectId,
                    text: 'Update text',
                    delete_password: delete_password
                })
                .end( (err, res) => {
                    assert.equal(res.status, 404);
                    assert.equal(res.body.error, 'Thread Id: ' + incorrectId + ' and/or Reply Id: ' + incorrectId + ' do not exist');
                    done();
                });
            });

            test('Update a reply with an incorrect password, on board "testboard" (PUT /api/replies/edit/:board)', done => {
              chai.request(server)
                .put('/api/replies/edit/testboard')
                .send({
                    thread_id: secondThreadId,
                    reply_id: replyId2,
                    text: 'Update text',
                    delete_password: 'some password'
                })
                .end( (err, res) => {
                    assert.equal(res.status, 401);
                    assert.equal(res.body.error, 'Incorrect password');
                    done();
                });
            });

            test('Update a reply that has been reported, on board "testboard" (PUT /api/replies/edit/:board)', done => {
              chai.request(server)
                .put('/api/replies/edit/testboard')
                .send({
                    thread_id: secondThreadId,
                    reply_id: replyId,
                    text: 'Update text',
                    delete_password: delete_password
                })
                .end( (err, res) => {
                    assert.equal(res.status, 403);
                    assert.equal(res.body.error, 'This reply has been reported, and therefore cannot be edited');
                    done();
                });
            });

            test('Update a reply that has been deleted, on board "testboard" (PUT /api/replies/edit/:board)', done => {
              //delete the reply first
              chai.request(server)
                .delete('/api/replies/testboard')
                .send({
                    thread_id: secondThreadId,
                    reply_id: replyId2,
                    delete_password: delete_password
                })
                .end( (err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.success, 'Reply Id ' + replyId2 + ' deleted successfully');

                    chai.request(server)
                      .put('/api/replies/edit/testboard')
                      .send({
                          thread_id: secondThreadId,
                          reply_id: replyId2,
                          text: 'Update text',
                          delete_password: delete_password
                      })
                      .end( (err, res) => {
                          assert.equal(res.status, 403);
                          assert.equal(res.body.error, 'This reply has been deleted, and therefore cannot be edited');
                          done();
                      });
                });
            });
        });
    });
  
    suite('API ROUTING FOR /api/boards', () => {
        suite('GET', () => {
            test( 'Get all boards (GET /api/boards)', done => {
              chai.request( server )
                .get('/api/boards')
                .end( (err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body);
                    assert.isNumber(res.body.total);
                    assert.isArray(res.body.data);              
                
                    if (res.body.data.length > 0) {
                      assert.property(res.body.data[0], '_id');
                      assert.isNumber(res.body.data[0].threads);
                      assert.isNumber(res.body.data[0].replies);
                      assert.property(res.body.data[0], 'bumped_on');
                    }
                    done();
                });
            });
        });
    });

  //Delete the second thread
    suite('DELETE', () => {
        test('Delete the second thread on board "testboard" (DELETE /api/threads/:board)', done => {
          chai.request(server)
            .delete('/api/threads/testboard')
            .send({
                thread_id: secondThreadId,
                delete_password: delete_password
            })
            .end( (err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.success, 'Thread Id ' + secondThreadId + ' deleted successfully');
                done();
            });
        });
    });
});
