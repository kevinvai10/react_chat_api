function Room(id,user1,user2){
    this.id = id;
    this.user1 = user1;
    this.user2 = user2;
    this.messageHistory = [];
}

module.exports = Room;