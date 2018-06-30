const Koa = require('koa');
const socketio = require('socket.io');
const app = new Koa();
const server = app.listen(3000);
const io = socketio.listen(server);


let Room = require("./bean/room");
let User = require("./bean/user");

const roomlist = new Map();
let socketList = new Map();


// Socket.io
io.sockets.on('connection', function (socket) {
    // Create Player's ID
    let socketid = socket.id;
    let name = "user";
    let avatarid = 1;
    let user = new User(socketid, name, avatarid);
    socketList.set(socketid, socket);
    //let player = new Player()
    console.log("log in " + socketid);
    console.log("now we have these rooms: " +Room.roomListToJson());
    socket.emit('initRoomList', Room.roomListToJson());  //将所有roomList信息 传给 新加入的用户 用于初始化
    socket.emit('initUserList', User.userListToJson());
    socket.broadcast.emit('addUser', user.toJson());            //将新用户的信息传给其他 用户，告诉他们将该用户 加入 用户列表里面。
    /*
    for (let i = 0;i< roomlist.keys().length;i++){
        let key = roomlist.keys()[i];
        socket.emit("change_room", {
            "roomid": key,
            "roomdata": roomlist.get(key).getInfo()
        });
        console.log("change_room: " + key+" "+roomlist.get(key).getInfo());
    }
    */

    socket.on('createRoom', data => {
        let roomid = Room.getFreeRoomId();
        let user = User.userList.get(socket.id);
        if (!user) {
            socket.emit("createRoomFail", "no user.");
        } else if (roomid < 0) {
            socket.emit("createRoomFail", "no free room.");
        }
        else {
            let room = new Room(roomid, user.socketid);
            console.log("createRoomSuccess! new room "+room.toJson());
            io.emit("createRoom", room.toJson());
        }
    });

    // socket.on('addRoom', data => {
    //     let room = new Room(data.roomid, socketid, name, avatarid);
    //     roomlist.set(data.roomid, room);
    //     console.log("create room " + room.getInfo());
    //     console.log("create room " + roomlist.get(data.roomid).getInfo());
    //     socket.emit("add_room", {
    //         "roomid": data.roomid,
    //         "host": player.getString()
    //     });
    //     socket.broadcast.emit("add_room", {
    //         "roomid": data.roomid,
    //         "host": player.getString()
    //     });
    //     console.log(roomlist.toString());
    // });
    //
    // socket.on('setMap', data => {
    //     roomlist.get(data.roomid).setMap(data.mapid);
    //     socket.emit("change_room", {
    //         "roomid": data.roomid,
    //         "roomdata": roomlist.get(data.roomid).getInfo()
    // })
    //     ;
    //     socket.broadcast.emit("change_room", {
    //         "roomid": data.roomid,
    //         "roomdata": roomlist.get(data.roomid).getInfo()
    // })
    //     ;
    // });

    socket.on('joinRoom', data => {
        console.log(socket.id+" join room " +data.roomid);
        let room = Room.roomList.get(data.roomid);
        if (room) {
            //双重检查
            let sideList = data.side === 0? room.getSide1All(): room.getSide2All();
            if (sideList.length < room.capacity) {
                sideList.push(socket.id);
                io.emit('joinRoom', data);

                console.log("join success");
                console.log("now the room info is ", room.toJson());
            } else {
                console.log("join failed");
                console.log("now the room info is ", room.toJson());
            }
        } else {
            console.log(data.roomid + " not exist");
        }
    });

    socket.on('swapSide', data => {
        console.log(socket.id + " want to swap side in room " +data.roomid);
        let room = Room.roomList.get(data.roomid);
        if (room) {
            //双重检查
            let sideList = data.side === 0? room.getSide1All(): room.getSide2All();
            let oldSideList = data.side === 0? room.getSide2All(): room.getSide1All();
            if (sideList.length < room.capacity) {
                let index = oldSideList.indexOf(data.socketid);
                if (index >= 0) {
                    oldSideList.splice(index, 1);
                }
                sideList.push(data.socketid);
                io.emit('swapSide', data);
                console.log("swap success");
                console.log("now the room info is ", room.toJson());
            } else {
                console.log("swap failed");
                console.log("now the room info is ", room.toJson());
            }
        }
    });

    socket.on('leave', data => {
        console.log(data.socketid + " request to leave his room");
        Room.removePlayer(data.socketid);
        io.emit('leave', data);
    });

    // socket.on('addPlayer', data => {
    //     console.log(socketid + ' request for added.');
    //     Room.roomList.get(data.roomid).addPlayer(data.side, player);
    //     socket.emit("change_room", {
    //         "roomid": data.roomid,
    //         "roomdata": roomlist[data.roomid].getInfo()
    // })
    //     ;
    //     socket.broadcast.emit("change_room", {
    //         "roomid": data.roomid,
    //         "roomdata": roomlist[data.roomid].getInfo()
    // })
    //     ;
    // });
    //
    // socket.on('removePlayer', data => {
    //     console.log(socketid + ' request for exit.');
    //     if (roomlist.get(data.roomid).removePlayer(data.player)) {
    //         roomlist.delete(data.roomid);
    //         socket.emit("remove_room",data.roomid);
    //         socket.broadcast.emit("remove_room",data.roomid)
    //     } else {
    //         socket.emit("change_room", {
    //             "roomid": data.roomid,
    //             "roomdata": roomlist[data.roomid].getInfo()
    //     })
    //         ;
    //         socket.broadcast.emit("change_room", {
    //             "roomid": data.roomid,
    //             "roomdata": roomlist[data.roomid].getInfo()
    //     })
    //         ;
    //     }
    // });

    socket.on('disconnect', function () {
        console.log('User ' + socket.id + ' disconnected.\n');
        Room.removePlayer(socket.id);
        User.userList.delete(socket.id);
        socketList.delete(socket.id);
        socket.broadcast.emit('offline', {
            'socketid': socket.id,
        });
    });


    //游戏部分
    socket.on('startGame', data => {
        console.log("room "+data.roomid+" requests for starting game");
        io.emit('startGame', data);
        // let room = Room.roomList.get(data.roomid);
        // if (room) {
        //     for (let value of room.side1) {
        //         let socket = socketList.get(value);
        //         if (socket) {
        //             socket.emit('startGame', data);
        //         }
        //     }
        //     for (let value of room.side2) {
        //         let socket = socketList.get(value);
        //         if (socket) {
        //             socket.emit('startGame', data);
        //         }
        //     }
        // }
    });

    socket.on('joinGame', data => {
        console.log(data.socketid +" requests for joining game");
        io.emit('joinGame', data);
    })
});


/*
// response
app.use(ctx => {
    ctx.body = 'Hello Koa';
});
*/
