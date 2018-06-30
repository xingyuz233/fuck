
const Koa = require('koa');
const app = new Koa();
    const server = app.listen(3003);
    const io = require('socket.io').listen(server);

    let Player = require("./bean/player");

    let playerMap = new Map();
    let socketMap = new Map();
    let terroristMap = new Map();
    let counterTerroristMap = new Map();

    const TERRORIST_CAMP = 0;
    const COUNTERTERRORIST_CAMP = 1;

//服务器状态
    let status;

// 定时器
    let bombTimeSetter;
    let roundTimeSetter;

    resetAll();

// Socket.io
    io.on('connection', function (socket) {
        // Create Player's ID
        let socketid = socket.id;
        socketMap.set(socketid, socket);
        socket.emit('init', {
            'terroristNum': Player.getFreeTerroristIndex(),
            'counterTerroristNum': Player.getFreeCounterTerroristIndex()
        });
        console.log('Now we have ' + Player.terroristMap.size + ' terrorists and ' + Player.counterTerroristMap.size + ' counterTerrorists');
        console.log('Player ' + socketid + ' connected.\n');

        socket.on('addPlayer', data => {
            console.log(socketid + ' request for added.');
            let player = new Player(data.socketid, data.name, data.camp, data.index);
            player.setPosition(data.position);
            socket.broadcast.emit('addPlayer', data);
        });

        socket.on('addPlayerSuccess', data => {
            console.log(socketid + ' received ' + data.socketid + ' and added it.');
            let player = Player.get(socketid);
            if (player) {
                socketMap.get(data.socketid).emit('addPlayerSuccess', player.toObject());
            }
        });
        // Update Player's Status
        socket.on('updatePlayer', data => {
            if (Player.get(data.socketid)) {
                Player.get(data.socketid).setPosition(data.position);
                Player.get(data.socketid).setRotation(data.rotation);
                socket.broadcast.emit('updatePlayer', data);
            }
        });

        socket.on('buyRifle', data => {
            if (Player.get(data.socketid)) {
                console.log("Player " + data.socketid + " bought a rifle " + data.rifle);
                Player.get(data.socketid).rifle = data.rifle;
                socket.broadcast.emit('buyRifle', data);
            }
        });
        /*
        // Receive Player's Fire Action
        socket.on('bullet', function (data) {
            console.log('Player ' + socketid + ' fired.\n');
            bullets[bullets.length] = {'position': data[0], 'speed': data[1], 'clientOrigin': socketid};
            socket.broadcast.emit('bullet', data);
        });
        */
        // Receive Player's Offline Action
        socket.on('disconnect', function () {
            console.log('Player ' + socketid + ' disconnected.\n');
            Player.delete(socketid);
            socket.broadcast.emit('offline', {'socketid': socketid});
        });

        socket.on('hit', data => {
            console.log('Player ' + socketid + ' hit Player ' + data.playerid + ' for ' + data.damage + ' hp.');
            socketMap.get(data.playerid).emit('hit', {
                'socketid': socketid,
                'damage': data.damage
            });
        });

        socket.on('die', data => {
            console.log('Player ' + socketid + ' was killed by Player ' + data.socketid + '.');
            io.emit('die', {
                'killed': socketid,
                'killer': data.socketid,
                'bodyPart': data.bodyPart,
                'hitDirection': data.hitDirection
            });
            if (Player.get(data.socketid)) {
                Player.get(data.socketid).kill();
            }
            if (Player.get(socketid)) {
                Player.get(socketid).die();
            }

            if (Player.getLiveCounterTerrorists().length === 0) {
                terroristWin();
            }
            // terrorist-win
            if (Player.getLiveTerrorists().length === 0) {
                counterTerroristWin();
            }


        });

        socket.on('setBomb', data => {
            console.log('bomb has been set');
            bombTimeSetter = setTimeout(explode, 45000);
            io.emit('setBomb');

        });

        socket.on('defuseBomb', data => {
            console.log('bomb has been defused');
            counterTerroristWin();
        })
    });

    function explode() {
        console.log('bomb explode');
        terroristWin();
    }

    function roundTimeout() {
        console.log('round time out');
        counterTerroristWin();
    }


    function terroristWin() {
        console.log('terroristWin');
        Player.terroristWins++;
        clearTimeout(roundTimeSetter);
        clearTimeout(bombTimeSetter);
        io.emit('roundOver', {
            terroristWins: Player.terroristWins,
            counterTerroristWins: Player.counterTerroristWins,
            info: 'terrorist win'
        });
        setTimeout(resetAll, 3000);
    }

    function counterTerroristWin() {
        console.log('counterTerroristWin');
        Player.counterTerroristWins++;
        clearTimeout(roundTimeSetter);
        clearTimeout(bombTimeSetter);
        io.emit('roundOver', {
            terroristWins: Player.terroristWins,
            counterTerroristWins: Player.counterTerroristWins,
            info: 'counter-terrorist win'
        });
        setTimeout(resetAll, 3000);
    }

    function resetAll() {
        io.emit('resetAll');
        let roundTime = 150000;
        let interval = 1000;
        roundTimeSetter = setInterval(function () {
            roundTime -= interval;
            io.emit("timer", roundTime / 1000);

            if (roundTime % 10000 === 0) {
                console.log(roundTime / 1000 + " second left");
                if (roundTime <= 0) {
                    clearInterval(roundTimeSetter);
                    roundTimeout();
                }
            }


        }, interval);
        Player.resetAll();
}
/*
// response
app.use(ctx => {
    ctx.body = 'Hello Koa';
});
*/
