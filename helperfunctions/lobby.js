class Lobby {
    constructor(){
        this.users = []
        this.rooms = []
    }

    getUser = (id) => {
        let foundUser = {};
        for(let user of this.users){
            if(user.id === id) foundUser = user;
        }
        return foundUser;
    }
    containsUser = userId => {
        //Delete from array
        if(this.users.length < 1) return false;
        const filteredUser = this.users.filter(user => user.id === userId);
        if(filteredUser.length < 1 ) return false;
        return true;
    }

    deleteUser = userId => {
        //Delete from array
        this.users = this.users.filter(user => user.id !== userId);
        return this.users;
    }

    addUser = user => {
        //recieves user object and adds to lobby
        this.users = [...this.users, user];
    }

    addRoom = room => {
        this.rooms = [...this.rooms, room];
    }

    containsRoom = (id1,id2) => {
        if(this.rooms.length < 1) return false;
        const filteredRoom = this.rooms.filter(room => ((room.user1.id === id1 && room.user2.id === id2) || (room.user1.id === id2 && room.user2.id === id1)));
        if(filteredRoom.length < 1 ) return false;
        return true;
    }

    updateRoomMsg = (id, msg, senderId) => {
        console.log('inside update', id)
        console.log('inside update', msg)
        let foundRoom = {}
        const newRooms = this.rooms.map(room => {
            if(room.id === id){
                console.log('found room!', room.messageHistory)
                const sender = this.getUser(senderId);
                //room.messageHistory.push({senderId: senderId, message: sender.name + ' says: ' + msg})
                room.messageHistory.push({senderId: senderId, message: msg})
                console.log('found room!', room.messageHistory)
                foundRoom = room;
                console.log('room we are going to send----: ', foundRoom);
                return room;
            }
            return room;
        })

        this.rooms = newRooms;
        return foundRoom;
    }
    getRoom = (id1,id2) => {
        //iterate rooms and compare ids
        //console.log('received params ' , id1 , id2)
        //console.log('let get room from', this.rooms);
        //const filteredRoom = this.rooms.filter(room => (room.user1.id === id1 && room.user2.id === id2));
        /*const filteredRoom = this.rooms.find(room => {
            console.log('individual room: ' , room);
            console.log('individual room id : ' , room.user1.id);
            console.log('individual param: ' , id1);
            console.log('individual room id2 : ' , room.user2.id);
            console.log('individual param: ' , id2);
            if(room.user1.id === id1 && room.user2.id === id2) return;
        });*/
        let foundRoom = [];
        for(let room of this.rooms){
            if((room.user1.id === id1 && room.user2.id === id2) || (room.user2.id === id1 && room.user1.id === id2)){
                foundRoom = room;
            }
        }
        if(foundRoom) return foundRoom;
    }

    updateUser = userId => {
        const newUserlist = this.users.map(user => {
            if(user.id === userId){
                return {...user, status: 'online'}
            } else{
                return user;
            }
        })

        this.users = newUserlist;
    }

    logOffUser = userId => {
        console.log('logging off user')
        const newUserlist = this.users.map(user => {
            if(user.id === userId){
                return {...user, status: 'offline'}
            } else{
                return user;
            }        
        })
        this.users = newUserlist;
    }


}
/*function Lobby(){
    this.users = []
}

Lobby.prototype.containsUser = function(userId){
    //find user id in array
    if(this.users.length > 1) return false;
    for(let user of this.users){
        if(user.id === userId) return true;
    }
    return false;
}

Lobby.prototype.deleteUser = function(userId){
    //Delete from array
    this.users = this.users.filter(user => user.id !== userId);
    return this.users;
}

Lobby.prototype.addUser = function(user){
    //recieves user object and adds to lobby
    this.users = [...this.users, user];
}

Lobby.prototype.updateUser = function(id){
    const newUserlist = this.users.map(user => {
        if(user.id === id){
            return {...user, status: 'online'}
        } else{
            return user;
        }
    })

    Lobby.prototype.logOffUser = function(id){
        const newUserlist = this.users.map(user => {
            if(user.id === id){
                return {...user, status: 'offline'}
            } else{
                return user;
            }        
        })
    }

    this.users = newUserlist;
    return this.users;
}*/

module.exports = Lobby;