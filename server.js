// Dependencies
let express = require('express');
let http = require('http');
let path = require('path');
let socketIO = require('socket.io');

let app = express();
let server = http.Server(app);
let io = socketIO(server);

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));
app.use('/jPicker', express.static(__dirname + '/jPicker'));  //allows use of jPicker dir when server runs

// Routing
app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname, 'index.html'));
});

// Starts the server.
server.listen(5000, function () {
    console.log('Starting server on port 5000');
});

setInterval(function () {
    io.sockets.emit('message', 'hi!');
}, 1000);

//handling movement sent from game.js
let players = {};
let storeData = {};

io.on('connection', function (socket) {
    //adds a new json object for the player
    socket.on('new player', function () {
        players[socket.id] = {
            x: new Array(),
            y: new Array(),
            currColor: new Array(),
            mouseUp: true
        };
        storeData[socket.id] = {
            x: new Array(),
            y: new Array(),
            currColor: new Array(),
            mouseUp: null
        };
    });

    socket.on('mouseDownPos', function (data) {
        let player = players[socket.id];
        if (player != null) {
            if (typeof player.x !== 'undefined') {
                player.x.splice(0, player.x.length - 5);
                player.y.splice(0, player.y.length - 5);
                player.currColor.splice(0, player.currColor.length - 5);
            }
            for (let i = 0; i < data.x.length; i++) {
                player.x.push(data.x[i]);
                player.y.push(data.y[i]);
                player.currColor.push(data.currColor[i]);
            }
            ;
            player.mouseUp = false;
        }
    });

    socket.on('mouseUp', function (data) {
        let player = players[socket.id] || {};
        player.mouseUp = data;
        player.x = [];
        player.y = [];
        player.currColor = [];
    });
});

setInterval(function () {
    io.sockets.emit('state', players);
}, 1000 / 60);