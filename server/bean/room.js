let Player = require("./user");

// var Room = function (roomid, socketid,name,avatarid) {
//     this.capacity = 9;
//     this.roomid= roomid;
//     this.host = new Player(socketid,name,avatarid);
//     this.side1 = [];
//     this.side2 = [];
//     this.mapid = 0;
//     this.side1.push(this.host);
//     this.state = 0;
// };

var Room = function (roomid,hostid) {
    this.capacity = 9;
    this.roomid= roomid;
    this.hostid = hostid;
    this.side1 = [];
    this.side2 = [];
    this.mapid = 0;
    this.side1.push(hostid);
    this.state = 0;

    Room.roomList.set(roomid, this);
};


Room.prototype.addPlayer = function(side, player) {
    this.side1.splice(this.side1.indexOf(player),1);
    this.side2.splice(this.side2.indexOf(player),1);
    if(side == 1){
        if(this.side1.length<this.capacity){
            this.side1.push(player);
            return true;
        }
    }else {
        if(this.side2.length<this.capacity){
            this.side2.push(player);
            return true;
        }
    }
    return false;
};

Room.prototype.setMap = function(mapid) {
    this.mapid = mapid;
};

Room.prototype.getInfo = function () {
    let msg = "{'host': "+this.host.getString()+",'mapid': \""+this.mapid+"\",\"state\":\""+this.state+"\",\"side1\":[";
    for(let i = 0;i<this.side1.length;i++)
        msg += this.side1[i].getString();
    msg+="],\"side2\":["
    for(let i = 0;i<this.side2.length;i++)
        msg += this.side2[i].getString();
    msg+="]}"
    return msg;
};

Room.prototype.toJson = function() {
    return JSON.stringify(this);
};

Room.prototype.FromJson = function (jsonString) {
    return JSON.parse(jsonString);
};
Room.prototype.getSide1 = function(){
    return this.side1.length;
};
Room.prototype.getSide2 = function(){
    return this.side2.length;
};
Room.prototype.getSide1All = function(){
    return this.side1;
};
Room.prototype.getSide2All = function(){
    return this.side2;
};
Room.prototype.getState = function(){
    return this.state;
};
Room.prototype.getMapId = function(){
    return this.mapid;
};
Room.prototype.getHostName = function(){
    return this.host.getName();
};


Room.prototype.start = function () {
    this.status = 1;
};

Room.prototype.removePlayer = function (socketid) {
    if (this.side1.indexOf(socketid) >= 0) {
        this.side1.splice(this.side1.indexOf(socketid), 1);
    }
    if (this.side2.indexOf(socketid) >= 0) {
        this.side2.splice(this.side2.indexOf(socketid), 1);
    }
    if(this.side1.length === 0 && this.side2.length === 0)
        return true;
    if(socketid === this.hostid){
        if (this.side1.length !== 0) {
            this.hostid = this.side1[0];
        } else {
            this.hostid = this.side2[0];
        }
    }
    return false;
};


Room.prototype.has = function(socketid) {
    for (let value of this.side1) {
        if (value === socketid) {
            return true;
        }
    }
    for (let value of this.side2) {
        if (value === socketid) {
            return true;
        }
    }
    return false;
};



Room.roomListToJson =function () {
    let roomList = [];
    for (var value of Room.roomList.values()) {
        roomList.push(value);
    }
  return JSON.stringify(roomList);
};

Room.getFreeRoomId = function () {
    var freeIndexList = [0,1,2,3,4,5,6,7,8];
    for (var value of Room.roomList.values()) {
        var index = freeIndexList.indexOf(value.roomid);
        if (index >= 0) {
            freeIndexList.splice(index, 1)
        }
    }
    if (freeIndexList.length > 0) {
        return freeIndexList[0];
    } else {
        return -1;
    }
};

Room.removePlayer = function (socketid) {
    for (var key of Room.roomList.keys()) {

        if (Room.roomList.get(key).has(socketid)) {
            let room = Room.roomList.get(key);
            if (room.removePlayer(socketid)) {
                Room.roomList.delete(key);
            }
            return room;
        }
    }
};

Room.roomList = new Map();
module.exports = Room;