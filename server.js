const express = require('express');
const app = express();
const port = 3001;
const uuidv4 = require('uuid/v4');
const bcrypt = require('bcrypt-nodejs');
const bodyParser = require('body-parser');
const knex = require('knex');
const cors = require('cors');
const User = require('./helperfunctions/user')
const Room = require('./helperfunctions/room')
const Lobby = require('./helperfunctions/Lobby')
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const lobby = new Lobby();
const signin = require('./controllers/signin');
const register = require('./controllers/register');

app.use(bodyParser.json());
app.use(cors())
//define db
const db = knex({
    client: 'pg',
    connection: {
        host : '127.0.0.1',
        user : '',
        password : '',
        database : 'chat'
    }
})
//api
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.post('/signin', signin.handleSignin(db, bcrypt))


io.on('connection', function (socket) {
    //console.log('new connection ' , socket);
    socket.on('login', function(user){
        console.log('received user:' , user)
        if(!user.id) return 'not a valid user';
        socket.userid = user.id;

        if(lobby.containsUser(user.id)){
            //user already exists
            console.log('found user!')
            lobby.updateUser(user.id);
        } else{
            //create new user
            console.log('creating user!')
            const newUser = new User(user);
            //socket.userName = newUser.name;
            lobby.addUser(newUser);
        }
        console.log('current lobby: ', lobby);
        socket.emit('login', lobby.users);
        socket.broadcast.emit('joinlobby', {...user, status: 'online'})
    })

    socket.on('disconnect', function(){
        console.log('disconnected', socket.userid)

        if(socket.userid){
            console.log('user disconnected: ', socket.userid)
            lobby.logOffUser(socket.userid)
            console.log('current lobby', lobby);
            socket.broadcast.emit('logout', {
                userId: socket.userid,
            });
        }
    })

    socket.on('joinchat', (usr1, usr2) => {
        //create new room if no room with the same userid exists
        console.log('received users: ', usr1, usr2)
        if(!lobby.containsRoom(usr1.id,usr2.id)){
            const newChatroom = new Room(uuidv4(), usr1, usr2)
            socket.chatroomid = newChatroom.id;
            lobby.addRoom(newChatroom);
            console.log('latest lobby: ' , lobby);
        } else{
            console.log('you already have a conversation')
        }
        const chatRoom = lobby.getRoom(usr1.id, usr2.id);
        console.log('chatroom to send: ' , chatRoom)
        //send to both users info about their messages []
        socket.emit('joinchat', chatRoom);
    })

    socket.on('message', (roomid, msg,senderId) => {
        //recive room id and update the logs
        console.log('received room id', roomid);
        console.log('received msg', msg);
        const foundRoom = lobby.updateRoomMsg(roomid, msg, senderId);
        console.log('found room before sending' , foundRoom);
        //send msg to users so it displays on their screens
        socket.broadcast.emit('messagereceived' , foundRoom);
        socket.emit('messagereceived' , foundRoom);
    })

});

http.listen(port, function () {
    console.log('listening on *: ' + port);
});