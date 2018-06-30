//
// var Room = function (roomid, socketid,name,avatarid) {
//     this.capacity = 8;
//     this.roomid= roomid;
//     this.host = new Player(socketid,name,avatarid);
//     this.side1 = [];
//     this.side2 = [];
//     this.mapid = 0;
//     this.side1.push(this.host);
//     this.state = 0;
// };
class Room {
    constructor(roomid, hostid) {
        this.capacity = 9;
        this.roomid = roomid;
        this.hostid = hostid;
        this.side1 = [];
        this.side2 = [];
        this.mapid = 0;
        this.side1.push(hostid);
        this.state = 0;

        Room.roomList.set(roomid, this);

    };

    addPlayer(side, player) {
        this.side1.splice(this.side1.indexOf(player), 1);
        this.side2.splice(this.side2.indexOf(player), 1);
        if (side === 1) {
            if (this.side1.length < this.capacity) {
                this.side1.push(player);
                return true;
            }
        } else {
            if (this.side2.length < this.capacity) {
                this.side2.push(player);
                return true;
            }
        }
        return false;
    };

    setMap(mapid) {
        this.mapid = mapid;
    };

    getInfo() {
        let msg = "{'host': \"" + this.host.getString() + "\",'mapid': \"" + this.mapid + "\",\"state\":\"" + this.state + "\",\"side1\":[";
        for (let i = 0; i < this.side1.length; i++)
            msg += this.side1[i].getString();
        msg += "],\"side2\":["
        for (let i = 0; i < this.side2.length; i++)
            msg += this.side2[i].getString();
        msg += "]}"
        return msg;
    };

    getSide1() {
        return this.side1.length;
    };

    getSide2() {
        return this.side2.length;
    };

    getSide1All() {
        return this.side1;
    };

    getSide2All() {
        return this.side2;
    };

    getState() {
        return this.state;
    };

    getMapId() {
        return this.mapid;
    };

    getHostName() {
        return this.host.getName();
    };

    start() {
        this.status = 1;
    };

    // removePlayer(player) {
    //     this.side1.splice(this.side1.indexOf(player), 1);
    //     this.side2.splice(this.side2.indexOf(player), 1);
    //     if (this.side1.length === 0 && this.side2.length === 0)
    //         return true;
    //     if (player.socketid === this.host.socketid) {
    //         this.host = this.side1[0];
    //     }
    //     return false;
    // };
    removePlayer(socketid) {
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



    has(socketid) {
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
    }

    static removePlayer(socketid) {
        for (let key of Room.roomList.keys()) {

            if (Room.roomList.get(key).has(socketid)) {
                let room = Room.roomList.get(key);
                if (room.removePlayer(socketid)) {
                    Room.roomList.delete(key);
                }
                return room;
            }
        }
    };
}
Room.roomList = new Map();