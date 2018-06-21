var Player = function (socketid, name, camp, index) {
    this.socketid = socketid;
    this.name = name;
    this.camp = camp;
    this.online = true;
    this.hp = 100;
    this.index = index;
    this.status = Player.LIVE;
    this.firing = false;
    this.position = {x:0,y:0,z:0};
    this.rotation = {x:0,y:0};
    this.kills = 0;
    this.dies = 0;
    if (camp === Player.TERRORIST_CAMP) {
        Player.terroristMap.set(socketid, this);
    } else {
        Player.counterTerroristMap.set(socketid, this);
    }

};

Player.prototype.setPosition = function(position) {
    this.position.x = position.x;
    this.position.y = position.y;
    this.position.z = position.z;
};

Player.prototype.setRotation = function(rotation) {
    this.rotation.x = rotation.x;
    this.rotation.y = rotation.y;
};
Player.prototype.toObject = function () {
    return {
        'socketid': this.socketid,
        'name': this.name,
        'camp': this.camp,
        'index': this.index,
        'position': this.position,
        'rotation': this.rotation,
        'action': this.action,
        'rifle': this.rifle,
        'firing': this.firing
    };
};

Player.prototype.kill = function () {
    this.kills++;
    if (this.camp === Player.TERRORIST_CAMP) {
        Player.terroristKills++;
    } else {
        Player.counterTerroristKills++;
    }
};

Player.prototype.die = function () {
    this.status = Player.DEAD;
    this.dies++;
};

Player.prototype.reset = function() {
    this.status = Player.LIVE;

};


Player.get = function (socketid) {
    if (Player.terroristMap.has(socketid)) {
        return Player.terroristMap.get(socketid);
    }
    else if (Player.counterTerroristMap.has(socketid)) {
        return Player.counterTerroristMap.get(socketid);
    }
    return null;
};


Player.delete = function (socketid) {
    if (Player.terroristMap.has(socketid)) {
        Player.terroristMap.delete(socketid);
    }
    else if (Player.counterTerroristMap.has(socketid)) {
        Player.counterTerroristMap.delete(socketid);
    }
};

Player.resetAll = function() {
    for (var tvalue of Player.terroristMap.values()) {
        tvalue.reset();
    }
    for (var ctvalue of Player.counterTerroristMap.values()) {
        ctvalue.reset();
    }
};

Player.getFreeTerroristIndex = function() {
    var freeIndexList = [0,1,2,3,4,5,6,7,8];
    for (var value of Player.terroristMap.values()) {
        var index = freeIndexList.indexOf(value.index);
        if (index >= 0) {
            freeIndexList.splice(index, 1)
        }
    }
    return freeIndexList[0];
};

Player.getFreeCounterTerroristIndex = function () {
    var freeIndexList = [0,1,2,3,4,5,6,7,8];
    for (var value of Player.counterTerroristMap.values()) {
        var index = freeIndexList.indexOf(value.index);
        if (index >= 0) {
            freeIndexList.splice(index, 1)
        }
    }
    return freeIndexList[0];
};

Player.getLiveTerrorists = function() {
    let lives = [];
    for (let value of Player.terroristMap.values()) {
        if (value.status === Player.LIVE) {
            lives.push(value);
        }
    }
    return lives;
};


Player.getLiveCounterTerrorists = function () {
    let lives = [];
    for (let value of Player.counterTerroristMap.values()) {
        if (value.status === Player.LIVE) {
            lives.push(value);
        }
    }
    return lives;
};


Player.TERRORIST_CAMP = 0;
Player.COUNTERTERRORIST_CAMP = 1;


Player.LIVE = 0;
Player.DEAD = 1;

Player.terroristMap = new Map();
Player.counterTerroristMap = new Map();
Player.terroristKills = 0;
Player.counterTerroristKills = 0;
Player.terroristWins = 0;
Player.counterTerroristWins = 0;



module.exports = Player;
