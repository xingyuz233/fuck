class User {
    constructor(socketid, name, avaterid) {
        this.socketid = socketid;
        this.name = name;
        this.avatarid = avaterid;
        this.side = -1;

        User.userList.set(socketid, this);
    };
}
// getSocketId = function(){
//     return this.socketid;
// };
// getName = function(){
//     return this.mapid;
// };
// Player.prototype.getAvatarId = function(){
//     return this.avatarid;
// };
// Player.prototype.getString = function(){
//     let msg = "\"socketid\":\""+this.socketid+"\",\"name\":\""+this.name+"\",\"avatarid\":\""+this.avatarid+"\""
//     return {msg};
// };

User.userList = new Map();