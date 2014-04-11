This is a programming challenge for AIESEC applicants

## Problem ##

The the chatgrape challenge server needs a solution to a riddle. Login via websockets, ask the server for the challenge, give him the correct solution (there is always one and only one solution). You can find the API at the bottom of this document.

The server will give you two string and expects an answer.

## Run Server ##

```
npm install ws
node server.js
```

The websocket server now runs at localhost:8080


## Rules ##

* Create an HTML page with JavaScript that runs in the browser (current Google Chrome and Firefox)
* Use whatever libraries you want to use (jQuery, ...), but you can also write plain javascript
* Don't care about old browsers. If it works with Google Chrome and Firefox, it's fine.
* Don't care about proxys, firewalls etc. The server only understand websockets and has no fallbacks
*

## Riddle ##

Given two strings *a* and *b* of equal length, what’s the longest string (*S*) that can be constructed such that S is a child to both a and b.

String *x* is said to be a child of string *y* if *x* can be formed by deleting 0 or more characters from *y*

### Constraints ###

All characters are upper-cased, A-Z. The string length of *a* and *b* is 64

### Output ###

Length of the string *S*

See the API documentation below to find out how to communicate with the server.

### Examples ###

1. ##### Sample Input #####

    ```
    HARRY
    SALLY
    ```

    ##### Sample Output #####

    ```
    2
    ```

    The longest possible subset of characters that is possible by deleting zero or more characters from `HARRY` and `SALLY` is `AY`, whose length is `2`.

1. ##### Sample Input #####

    ```
    AA
    BB
    ```

    ##### Sample Output #####

    ```
    0
    ```
    `AA` and `BB` has no characters in common and hence the output `0`

1. ##### Sample Input #####

    ```
    SHINCHAN
    NOHARAAA
    ```

    ##### Sample Output #####

    ```
    3
    ```

    The largest set of characters, in order, between `SHINCHAN` and `NOHARAAA` is `NHA`.


1. ##### Sample Input #####

    ```
    ABCDEF
    FBDAMN
    ```

    ##### Sample Output #####

    ```
    2
    ```

    `BD` is the largest child.


## API ##

The server always expects JSON but will only answer you with JSON sometimes.

### Login ###

##### Request: #####

```
{
    "please": "let me in"
}
```

You will receive a 16 character alphanumeric token

##### Response: #####
```
{
    "token": "..."
}
```

After you are logged in, send the token with every request

### Get the challenge ###

##### Request: #####
```
{
  "token": "...",
  "please": "let me do the challenge"
}
```

##### Response: #####
```
{
  "challenge": {
    "a": "DWWBBCYHMDRUGKULCVEKXINFMJFAOEJNPVFZPZKYHCSAOMANLZJXYVIQSFBKEXTH",
    "b": "PEQOTFYLJTUXNOJYNUZXUZHYTVHBPPZYCMPSFEIQXETRNNIJTJOUUZQNCDRTUPXS"
  }
}
```

### Post the solution ###

##### Request: #####
```
{
  "token": "...",
  "please": "I have the solution",
  "solution": 11
}
```

##### Response: #####
```
Thank you
```
