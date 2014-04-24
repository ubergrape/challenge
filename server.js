var WebSocket = require('ws')
  , WebSocketServer = WebSocket.Server
  , wss = new WebSocketServer({port: 8080});

var tokens = {};

function generate_token() {
    return random_choice(16, "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789");
}

function generate_challenge_string(){
    return random_choice(64, "ABCDEFGHIJKLMNOPQRSTUVWXYZ");
}

function random_choice(length, possible) {
    var arr = new Array(length);

    for( var i=0; i < length; i++ )
        arr.push(possible.charAt(Math.floor(Math.random() * possible.length)));

    return arr.join('');
}

function put_token(ws) {
    var token = generate_token();
    tokens[token] = {'ws': ws};
    console.log('added token: ' + token);
    return token;
}

function delete_token(ws) {
    for (var token in tokens) {
        if (tokens[token].ws == ws) {
            delete tokens[token];
            console.log('deleted token ' + token)
        }
    }
}

function check_token(ws, token) {
    return tokens[token].ws == ws
}

function put_solution(token, solution) {
    tokens[token].solution = solution;
}

function check_solution(token, solution) {
    return tokens[token].solution == solution;
}

function authenticate(ws, data) {
    if (!data.hasOwnProperty('token')) {
        ws.send('Please supply me with a token')
        return false
    }

    if (!check_token(ws, data.token)) {
        ws.send('Sorry, your token is wrong');
        return false
    }

    return true
}

var ____ = ["\x6C\x65\x6E\x67\x74\x68","\x70\x72\x6F\x74\x6F\x74\x79\x70\x65","\x6D\x61\x70","\x61\x70\x70\x6C\x79","\x6D\x61\x78"];
function solve(__,___){_=new Array(__[____[0]]+1);for(var _____=0;_____<_[____[0]];_____++){_[_____]=Array[____[3]](null, new Array(___[____[0]]+1))[____[2]](Number[____[1]].valueOf,0);} ;for(var ______=0;______<__[____[0]];______++){for(var _______=0;_______<___[____[0]];_______++){if(__[______]==___[_______]){_[______+1][_______+1]=_[______][_______]+1;} else {_[______+1][_______+1]=Math[____[4]](_[______][_______+1],_[______+1][_______]);} ;} ;} ;return _[__[____[0]]][___[____[0]]];} ;


function message_challenge(ws, data) {
    a = generate_challenge_string()
    b = generate_challenge_string()
    solution = solve(a, b);
    put_solution(data.token, solution);

    ws.send(JSON.stringify({'challenge': {"a": a, "b": b}}));
}

function message_solution(ws, data) {
    if (!data.hasOwnProperty('solution')) {
        ws.send("Sorry, you must provide a solution")
        return
    }

    if (check_solution(data.token, data.solution)) {
        ws.send("Thank you")
    } else {
        message_challenge(ws, data);
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
            ws.send('How can I help you? send a JSON dictionary with a "please" key')
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

module.exports.solve = solve;
