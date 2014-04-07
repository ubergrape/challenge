challenge
=========

Programming challenge for AIESEC applicants

### Problem ###

The the chatgrape challenge server needs a solution to a riddle. Login via websockets, ask the server for the challenge, give him the correct solution (the is always one and only one solution). You can find the API at the bottom of this document.

The server will give you two numbers and should multiply them.

Write tests to cover your code. 

### Rules ###

* Create an HTML Page with JavaScript that runs in the browser (current Google Chrome and Firefox)
* Write tests using 
* Use whatever libraries you want to use (jQuery, ...), but you can also write plain javascript
* Write tests using [PhantomJS](http://phantomjs.org/)
* Don't care about old browsers. If it works with Google Chrome and Firefox, it's fine.
* Don't care about proxys, firewalls etc. The server only understand websockets and has no fallbacks

### API ###

The server always expects JSON but will only answer you with JSON sometimes.

#### Login ####

Request: 

```
{
    "please": "let me in"
}
```

You will receive a 16 character alphanumeric token

Response:
```
{
    "token": "..."
} 
```

After you are logged in, send the token with every request

#### Get the challenge ####

Request:
```
{
  "token": "...",
  "please": "let me do the challenge"
}
```

Response:
```
{
  "challenge": {
    "nr1": 44123,
    "nr2": 214594
  }
}
```

#### Post the solution ####

Request:
```
{
  "token": "...",
  "please": "I have the solution",
  "solution": 9468531062
}
```

Response:
```
Thank you
```