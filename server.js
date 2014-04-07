var WebSocket = require('ws')
  , WebSocketServer = WebSocket.Server
  , wss = new WebSocketServer({port: 8080});

var tokens = {};

function generate_token() {
    var length = 16;
    var arr = new Array(length);
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < length; i++ )
        arr.push(possible.charAt(Math.floor(Math.random() * possible.length)));

    return arr.join('');
}

function put_token(ws) {
    var token = generate_token();
    tokens[token] = ws;
    console.log('added token: ' + token);
    return token;
}

function delete_token(ws) {
    for (var token in tokens) {
        if (tokens[token] == ws) {
            delete tokens[token];
            console.log('deleted token ' + token)
        }
    } 
}

function check_token(ws, token) {
    return tokens[token] == ws
}

function authenticate(ws, data) {
    if (!data.hasOwnProperty('token')) {
        ws.send('Please supply me with a token')
        return false
    }

    if (!check_token(ws, token)) {
        ws.send('Sorry, your token is wrong');
        return false
    }

    return true
}

function message_challenge(ws, data) {
    ws.send(JSON.stringify({'challenge': {"nr1": 44123, "nr2": 214594}}));
}

function message_solution(ws, data) {
    if (!data.hasOwnProperty('solution')) {
        ws.send("Sorry, you must provide a solution")
        return
    }

    if (data['solution'] == 44123 * 214594) {
        ws.send("Thank you")
    }
}

wss.on('connection', function(ws) {
    ws.on('message', function(message) {
        console.log("< " + message)

        var data = {}
        
        try{
            data = JSON.parse(message)
        }catch(e){
            ws.send('Sorry, I didn\'t understand your message');
            return
        }
        
        if (!data.hasOwnProperty('please')) {
            ws.send('Wow can I help you? send a JSON dictionary with a "please" key')
            return
        }

        if (data['please'] == "let me in") {
            var token = put_token(ws);
            ws.send(JSON.stringify({'token': token}))
            return
        }

        if (!authenticate(ws, data)) {
            return
        }
        
        if (data['please'] == "let me do the challenge") {
            message_challenge(ws, data);
        } else if (data['please'] == "I have the solution"){
            message_solution(ws,data);
        }
    });

    ws.on('close', function() {
        console.log('disconnected');
        delete_token(ws);
    });
});

