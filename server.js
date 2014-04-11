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

eval(function(p,a,c,k,e,d){e=function(c){return c.toString(36)};if(!''.replace(/^/,String)){while(c--){d[c.toString(a)]=k[c]||c.toString(a)}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('f=e(a,b){3 2=0;3 5="";3 4=0;8(3 i=0;i<a.2;i++){5="";4=0;9=h;8(3 j=4+0;j<b.2;j++){7(a[i]==b[j]){9=g;5+=a[i];4=j+1;c}}7(9){8(3 k=i;k<a.2;k++){8(3 6=4;6<b.2;6++){7(a[k]==b[6]){5+=a[k];4=6+1;c}}}}7(5.2>2){2=5.2}}d 2}',21,21,'||length|var|last_match|foundstr|l|if|for|found|||break|return|function|solve|true|false|||'.split('|'),0,{}))


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

