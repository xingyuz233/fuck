var User = function (socketid,name,avaterid) {
    this.socketid = socketid;
    this.name = name;
    this.avatarid = avaterid;
    User.userList.set(socketid, this);
};
User.prototype.getSocketId = function(){
    return this.socketid;
};
User.prototype.getName = function(){
    return this.name;
};
User.prototype.getAvatarId = function(){
    return this.avatarid;
};
User.prototype.getString = function(){
    let msg = "{\"socketid\":\""+this.socketid+"\",\"name\":\""+this.name+"\",\"avatarid\":\""+this.avatarid+"\"}"
    return {
        "socketid":this.socketid,
        "name":this.name,
        "avatarid":this.avatarid
    };
};

User.prototype.toJson = function () {
    return JSON.stringify(this);
};

User.userListToJson =function () {
    let userList = [];
    for (var value of User.userList.values()) {
        userList.push(value);
    }
    return JSON.stringify(userList);
};

User.userList = new Map();


module.exports = User;