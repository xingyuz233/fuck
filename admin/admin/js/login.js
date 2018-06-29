//import { Room } from "room.js";

let socket = io.connect("http://localhost:3000");
let name = "user";
let avatarid = 1;
let roomlist = new Map();
let roomid = -1;
let stateWord = ["等待开始", "游戏中"];
let stateClass = ["prepare", "ready"];

let leaveBtn = document.getElementById("leave");
let swapBtn = document.getElementById("swap");

// socket.on("add_list", data => {
//     console.log(data);
//             let tmp = data[j];
//             let hostplayer = new Player(tmp.host.socketid, tmp.host.name, tmp.host.avatarid);
//             let room = new Room(j, hostplayer);
//             for (let i in tmp.side1)
//                 room.addPlayer(1, new Player(i.socketid, i.name, i.avatarid));
//             for (let i in tmp.side2)
//                 room.addPlayer(2, new Player(i.socketid, i.name, i.avatarid));
//             room.setMap(tmp.mapid);
//             if (room.state == "1")
//                 room.start();
//             roomlist.set(j, room);
//     console.log(roomlist);
//     scroll_roomlist();
// });

socket.on("initRoomList", data => {
    console.log("initRoomList: "+data);
    let roomList = JSON.parse(data);
    for (let roomObj of roomList) {
        let newRoom = new Room(roomObj.roomid, roomObj.hostid);
        newRoom.side1 = roomObj.side1;
        newRoom.side2 = roomObj.side2;
    }
    scroll_roomlist();

});

socket.on("initUserList", data => {
    console.log("initUserList: "+data);
    let userList = JSON.parse(data);
    for (let userObj of userList) {
        let newUser = new User(userObj.socketid, userObj.name, userObj.avaterid);
    }
    console.log("initUserList success");

});

socket.on("addUser", data => {
    console.log("addUser: " + data);
    let userObj = JSON.parse(data);
    let newUser = new User(userObj.socketid, userObj.name, userObj.avaterid);
    console.log("add user "+userObj.socketid+" success!");
});

socket.on("add_room", data => {
        let host = new Player(data.host.socketid, data.host.name, data.host.avatarid);
        let room = new Room(data.roomid, host);
        console.log("add_room"+data.roomid);
        console.log(data.host);
        scroll_roomlist();
        if(data.roomid == this.roomid)
            entry(this.roomid);
    }
);

socket.on("createRoom", data => {
    let roomObj = JSON.parse(data);
    console.log(roomObj);
    let room = new Room(roomObj.roomid, roomObj.hostid);
    console.log(roomObj.hostid + "create a room "+room);
    scroll_roomlist();
    if (roomObj.hostid === socket.id) {
        entry(roomObj.roomid);
    }

});

socket.on("joinRoom", data => {
    let room = Room.roomList.get(data.roomid);
    let user = User.userList.get(data.socketid);
    if (room && user && !room.has(data.socketid)) {
        user.side = data.side;
        let sideList = data.side === 0? room.getSide1All(): room.getSide2All();
        sideList.push(data.socketid);

        if (room.has(socket.id)) {
            entry(data.roomid);
        }
    }
});

socket.on("swapSide", data => {
    let room = Room.roomList.get(data.roomid);
    let user = User.userList.get(data.socketid);
    if (room && user && room.has(data.socketid)) {
        user.side = data.side;
        let sideList = data.side === 0? room.getSide1All(): room.getSide2All();
        let oldSideList = data.side === 0? room.getSide2All(): room.getSide1All();
        let index = oldSideList.indexOf(data.socketid);
        if (index >= 0) {
            oldSideList.splice(index, 1);
        }
        sideList.push(data.socketid);
        console.log(room);
        if (room.has(socket.id)) {
            entry(data.roomid);
        }
    }
});

socket.on("leave", data => {
    let room = Room.roomList.get(data.roomid);
    let user = User.userList.get(data.socketid);
    if (room && room.has(data.socketid)) {
        if (room.removePlayer(data.socketid)) {
            Room.roomList.delete(roomid);
        }
    }

   //Room.removePlayer(data.socketid);
    if (room && room.has(socket.id)) {
        entry(data.roomid);
    } else if (User.userList.get(socket.id).side === -1) {
        scroll_roomlist();
    }
    user.side = -1;
});

socket.on("offline", data => {
    console.log('User ' + data.socketid + ' disconnected.\n');
    let room = Room.removePlayer(data.socketid);
    // let user = User.userList.get(data.socketid);
    User.userList.delete(data.socketid);

    //界面响应
    if (room && room.has(socket.id)) {
        entry(room.roomid);
    }
    else if (User.userList.get(socket.id).side === -1) {
        scroll_roomlist();
    }
});

socket.on("change_room", data => {
        console.log(roomlist);
        let tmp = data.roomdata;
        let hostplayer = new Player(tmp.host.socketid, tmp.host.name, tmp.host.avatarid);
        let room = new Room(data.roomid, hostplayer);
        for (let i in tmp.side1)
            room.addPlayer(1, new Player(i.socketid, i.name, i.avatarid));
        for (let i in tmp.side2)
            room.addPlayer(2, new Player(i.socketid, i.name, i.avatarid));
        room.setMap(tmp.mapid);
        if (room.state)
            room.start();
        roomlist.set(data.roomid, room);
        scroll_roomlist();
    }
);

socket.on("remove_room", data => {
    roomlist.delete(data);
    console.log("remove:"+data);
    console.log(roomlist);
    scroll_roomlist();
    }
);

function scroll_roomlist() {
    var roomlist = Room.roomList;
    console.log(roomlist);

    $("#room_list").empty();
    $("#room_list").append("<tr><th>房间号</th><th>人数</th><th>地图</th><th>状态</th></tr>");

    // for (let key in roomlist) {
    //     $("#room_list").append("<tr><th><a onclick='entry(" + key + ")'>" + key + "</a></th><th>" + roomlist.get(key).getSide1() + "</th><th>" + roomlist.get(key).getSide2() +
    //         "</th><th>" + roomlist.get(key).getMapId() + "</th><th>" + this.stateWord[roomlist.get(key).getState()] + "</th></tr>");
    // }
    // if (roomid > 0) {
    //     entry(roomid);
    // }

    for (let value of Room.roomList.values()) {
        console.log(value);
        $("#room_list").append("<tr onclick='joinRoom(" + value.roomid + ")'><th>" + value.roomid + "</></th><th>" + (value.getSide1()+value.getSide2())+"/"+value.capacity*2 + "</th><th>" +
            value.getMapId() + "</th><th>" + value.getState() + "</th></tr>");
    }
}



function entry(roomid) {

    $(".hall").css("display", "none");
    $(".room").css("display", "block");

    document.getElementById("roomid").innerHTML = roomid;

    let room = Room.roomList.get(roomid);

    document.getElementById("host").innerHTML = room.hostid;
    document.getElementById("mapid").innerHTML = room.getMapId();

    swapBtn.onclick = function () {
        swapSide(roomid);
    };
    leaveBtn.onclick = function () {
        leave(roomid);
    };
    // $("#swap").click(function () {
    //    swapSide(roomid);
    // });
    
    // $("#leave").click(function () {
    //     leave();
    // });

    $("#side1").empty();
    for (let user of room.getSide1All())
        $("#side1").append("<li><img src=\"img/user" + avatarid + ".png\"><span class=\"name\">" + user + "</span>" +
            "<span class=\"" + stateClass[room.getState()] + "\">"+stateWord[room.getState()]+"</span></li>");
    $("#side2").empty();
    for (let user of room.getSide2All())
        $("#side2").append("<li><img src=\"img/user" + avatarid + ".png\"><span class=\"name\">" + user + "</span>" +
            "<span class=\"" + stateClass[room.getState()] + "\">"+stateWord[room.getState()]+"</span></li>");
}

function add(side) {
    socket.emit("addPlayer", {
        "side": side,
        "roomid": this.roomid,
    });
}

function leave(roomid) {
    socket.emit("leave", {
        "socketid": socket.id,
        "roomid": roomid
    });
    $(".hall").css("display", "block");
    $(".room").css("display", "none");
    // this.roomid = -1;
}

function createRoom() {
    // let roomid = document.getElementById("create_room").value;
    // if (roomlist.has(roomid))
    //     return;
    // console.log("create room:" + roomid);
    // // socket.emit("addRoom", {
    // //     "roomid": roomid,
    // // });
    socket.emit("createRoom", {});
    // this.roomid = roomid;
}

function joinRoom(roomid) {
    if (Room.roomList.has(roomid)) {
        // $(".hall").css("display", "none");
        // $(".room").css("display", "block");

        let room = Room.roomList.get(roomid);
        let user = User.userList.get(socket.id);
        if (!room.has(socket.id)) {

            let sideList = room.getSide1() > room.getSide2()? room.getSide2All(): room.getSide1All();
            if (sideList.length < room.capacity) {
                let side = room.getSide1() > room.getSide2()? 1: 0;


                socket.emit("joinRoom", {
                    socketid: socket.id,
                    side: side,
                    roomid: roomid
                });

            } else {
                //todo 提示用户人数满了加不进来
            }
        }
    }
}

function swapSide(roomid) {
    if (Room.roomList.has(roomid)) {
        let room = Room.roomList.get(roomid);
        let user = User.userList.get(socket.id);
        let newSide;
        console.log(room.has(socket.id));

        if (room.has(socket.id) && user.side >= 0) {
            let sideList = user.side === 1? room.getSide1All(): room.getSide2All();

            if (sideList.length < room.capacity) {
                if (user.side === 0) {
                    newSide = 1;
                } else {
                    newSide = 0;
                }
                //改变用户占边
                //user.side = newSide;
                socket.emit("swapSide", {
                    socketid: socket.id,
                    side: newSide,
                    roomid:roomid
                });

            } else {
                //todo 提示用户对面阵营满了加不进来
            }
        }

    }
}



function setMap() {
    let mapid = $("choose_map").value;
    socket.emit("setMap", {
        "mapid": mapid,
        "roomid": this.roomid,
    })
}

function f_log_btn() {
    $("#log_window").css("display", "block");
    $("#logIn").css("display", "block");
    $("#register").css("display", "none");
}

function f_close_log_window() {
    $("#log_window").css("display", "none");
}

function r() {
    $("#logIn").css("display", "none");
    $("#register").css("display", "block");
}