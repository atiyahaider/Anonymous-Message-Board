**FreeCodeCamp**- Information Security and Quality Assurance
------

Project Anon Message Board

1) Only allow the site to load in an iFrame on your own pages.
2) Do not allow DNS prefetching.
3) Only allow your site to send the referrer for your own pages.
4) **POST** a thread to a specific message board by passing form data *text* and *delete_password* to `/api/threads/{board}`.(Recomend res.redirect to board page /b/{board}). Saved will be *_id, text, created_on(date&time), bumped_on*(date&time, starts same as created_on)*, reported*(boolean)*, delete_password, & replies*(array).
5) **POST** a reply to a thead on a specific board by passing form data *text, delete_password, & thread_id* to `/api/replies/{board}` and it will also update the *bumped_on* date to the comments date.(Recomend res.redirect to thread page `/b/{board}/{thread_id}`). In the thread's 'replies' array will be saved *_id, text, created_on, delete_password, & reported*.
6) **GET** an array of the most recent 10 bumped threads on the board with only the most recent 3 replies from `/api/threads/{board}`. The reported and delete_passwords fields will not be sent.
7) **GET** an entire thread with all it's replies from `/api/replies/{board}?thread_id={thread_id}`. Also hiding the same fields.
8) Delete a thread completely if a **DELETE** request is sent to `/api/threads/{board}`. Pass along the *thread_id & delete_password*. (Text response will be 'incorrect password' or 'success')
9) Delete a post(just changing the text to '[deleted]') if **DELETE** request is sent to `/api/replies/{board}`  along with the *thread_id, reply_id, & delete_password*. (Text response will be `'incorrect password' or 'success'`).
10) Report a thread and change it's reported value to *true* by sending a **PUT** request to `/api/threads/{board}` along with the *thread_id*. (Text response will be `'success'`).
11) Report a reply and change it's reported value to *true* by sending a **PUT** request to `/api/replies/{board}` along with the *thread_id & reply_id*. (Text response will be `'success'`).
12) Complete functional tests that wholely test routes and pass.
13) Create all of the functional/unit tests in `tests/2_functional-tests.js` and `tests/1_unit-tests.js` but only functional will be tested.

![alt text](https://cdn.gomix.com/8f5547a1-a0d6-48f6-aa38-51753a0105f4%2FScreen%20Shot%202017-01-02%20at%201.04.10%20AM.png)

[Front End](https://airy-enquiry.glitch.me/)