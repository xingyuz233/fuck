


let socket = null;//io.connect("http://localhost:3000");
let name = "user";
let avatarid = 1;
let roomlist = new Map();
let roomid = -1;
let stateWord = ["等待开始", "游戏中"];
let stateClass = ["prepare", "ready"];
let maps = ["炙热沙城"];
let leaveBtn = document.getElementById("leave");
let swapBtn = document.getElementById("swap");

let hallDiv = document.getElementById("hall");
let roomDiv = document.getElementById("room");
let logWindow = document.getElementById("log_window");



let userName = document.getElementById("user-name");
let logInNav = document.getElementById("log_in");
let logOutNav = document.getElementById("log_out");

let logOutBtn = document.getElementById("btn_log_out");

let startBtn = document.getElementById("start");


let createRoomBtn = document.getElementById("createRoom");
createRoomBtn.onclick = function () {
    createRoom();
};

function login_request() {
    var username=document.getElementById("username").value;
    var password=document.getElementById("password").value;
    console.log(username+" "+password);
    $.ajax({
        type: "POST",
        url: "http://120.79.227.127:3006/api/user/login",
        data : {username:username,password:password},
        success: function(msg) {
            console.log(msg);
            window.localStorage.setItem("user", username);
            window.location.href = "";
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

            alert(XMLHttpRequest.responseJSON.code);
        }
    });

}

function logout_request() {
    window.localStorage.removeItem("user");
    window.location.href = "";
}





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

let username = window.localStorage.getItem("user");
console.log("本地存储的user为:"+username);
if (username === null) {
    roomDiv.style.display = "none";
    hallDiv.style.display = "none";
    logInNav.style.display = "block";
    logOutNav.style.display = "none";
    $("#log_window").css("display", "block");
    $("#logIn").css("display", "block");
    $("#register").css("display", "none");
} else {
    roomDiv.style.display = "none";
    logWindow.style.display = "none";
    hallDiv.style.display = "block";
    logInNav.style.display = "none";
    logOutNav.style.display = "block";

    userName.innerHTML = "Hi! " + username;


    socket = io.connect("http://120.79.227.127:3000");


    socket.on("who", data => {
        socket.emit('name', {
            name:username
        })
    });

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
        //房主初始边为匪徒
        let user = User.userList.get(roomObj.hostid);
        user.side = 0;
        user.state = 0;
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
            user.state = 0;
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
        //let room = Room.roomList.get(data.roomid);
        let user = User.userList.get(data.socketid);
        let room = Room.removePlayer(data.socketid);
        // if (room && room.has(data.socketid)) {
        //     if (room.removePlayer(data.socketid)) {
        //         Room.roomList.delete(roomid);
        //     }
        // }
        user.side = -1;
        user.state = -1;

        //Room.removePlayer(data.socketid);
        if (room && room.has(socket.id)) {
            entry(data.roomid);
        } else if (User.userList.get(socket.id).side === -1) {
            scroll_roomlist();
        }
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

    socket.on("startGame", data => {
        let user = User.userList.get(socket.id);
        let room = Room.roomList.get(data.roomid);
        let inRoom = false;
        if (room) {
            room.state = 1;
            for (let value of room.side1) {
                let player = User.userList.get(value);
                player.state = 1;
                if (value === socket.id) {
                    inRoom = true;
                }
            }
            for (let value of room.side2) {
                let player = User.userList.get(value);
                player.state = 1;
                if (value === socket.id) {
                    inRoom = true;
                }
            }
        }
        if (inRoom) {
            window.localStorage.setItem("name", user.name);
            window.localStorage.setItem("camp", user.side);
            window.localStorage.setItem("roomid", room.roomid);
            console.log(window.localStorage.getItem("name"));
            console.log(window.localStorage.getItem("camp"));
            console.log(window.localStorage.getItem("roomid"));
            console.log("ready to fly to map 9000");
            entry(room.roomid);
            window.open("game.html");
        }
        scroll_roomlist();

    });

    socket.on("joinGame", data => {
        console.log("joining game, loading...");
        let room = Room.roomList.get(data.roomid);
        let joiner = User.userList.get(data.socketid);
        if (room && joiner) {
            joiner.state = 1;
            if (data.socketid === socket.id) {
                window.localStorage.setItem("roomid", room.roomid);
                window.localStorage.setItem("name", joiner.name);
                window.localStorage.setItem("camp", joiner.camp);
                console.log("ready to fly to map 9000");
                window.open("http://localhost:9000");
            }
        }
    });
}


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
        // $("#room_list").append("<tr onclick='joinRoom(" + value.roomid + ")'><th>" + value.roomid + "</th><th>" + (value.getSide1()+value.getSide2())+"/"+value.capacity*2 + "</th><th>" +
        //     value.getMapId() + "</th><th>" + value.getState() + "</th></tr>");

        let tr = document.createElement("tr");
        tr.onclick = ()=>joinRoom(value.roomid);

        let th1 = document.createElement("th");
        th1.innerHTML = value.roomid;

        let th2 = document.createElement("th");
        th2.innerHTML = (value.getSide1()+value.getSide2())+"/"+value.capacity*2;

        let th3 = document.createElement("th");
        th3.innerHTML = maps[value.getMapId()];

        let th4 = document.createElement("th");
        th4.innerHTML = stateWord[value.state];

        tr.appendChild(th1);
        tr.appendChild(th2);
        tr.appendChild(th3);
        tr.appendChild(th4);

        document.getElementById("room_list").appendChild(tr);

    }
}



function entry(roomid) {

    $(".hall").css("display", "none");
    $(".room").css("display", "block");

    document.getElementById("roomid").innerHTML = roomid;

    let room = Room.roomList.get(roomid);

    document.getElementById("host").innerHTML = User.userList.get(room.hostid).name;
    document.getElementById("mapid").innerHTML = maps[room.getMapId()];

    swapBtn.onclick = function () {
        swapSide(roomid);
    };
    leaveBtn.onclick = function () {
        leave(roomid);
    };

    startBtn.onclick = null;
    if (room.getState() === 1) {
        startBtn.innerText = "加入游戏";

        startBtn.onclick = function () {
            socket.emit("joinGame", {
                socketid: socket.id,
                roomid: roomid
            });
        };
    } else if (room.hostid === socket.id){
        startBtn.innerText = "开始游戏";
        startBtn.onclick = function () {
            socket.emit("startGame", {
                roomid: roomid
            });
        };
    } else {
        startBtn.innerText = "等待开始"
    }

    // startBtn.onclick = function () {
    //     socket.emit("startGame", {
    //         roomid: roomid
    //     });
    // };
    // $("#swap").click(function () {
    //    swapSide(roomid);
    // });
    
    // $("#leave").click(function () {
    //     leave();
    // });

    $("#side1").empty();
    for (let userid of room.getSide1All()) {
        let user = User.userList.get(userid);
        if (user.state === -1) {
            user.state = 0
        }
        if (user) {
            $("#side1").append("<li><img src=\"img/user" + avatarid + ".png\"><span class=\"name\">" + user.name + "</span>" +
                "<span class=\"" + stateClass[user.state] + "\">" + stateWord[user.state] + "</span></li>");
        }
    }
    $("#side2").empty();
    for (let userid of room.getSide2All()) {
        let user = User.userList.get(userid);
        if (user.state === -1) {
            user.state = 0
        }
        if (user) {
            $("#side2").append("<li><img src=\"img/user" + avatarid + ".png\"><span class=\"name\">" + user.name + "</span>" +
                "<span class=\"" + stateClass[user.state] + "\">" + stateWord[user.state] + "</span></li>");
        }
    }
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
    console.log(socket);
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
//
// function displayGameUI() {
//     navbox_div.style.display = "none";
//     container_div.style.display = "none";
//     log_window.style.display = "none";
//     register_div.style.display = "none";
//     blocker.style.display = "block";
// }
//
// function displayAdminUI() {
//     navbox_div.style.display = "block";
//     container_div.style.display = "block";
//     log_window.style.display = "none";
//     register_div.style.display = "none";
//     blocker.style.display = "none";
// }