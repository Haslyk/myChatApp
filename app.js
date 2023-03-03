const express = require('express')
const homepage = require('./src/routers/homePageRouter')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const socket = require('./src/middlewares/socketio')
const db = require("./src/config/db")

const app = express()
const server = app.listen(5000)

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser())

app.set('view engine', 'pug')
app.set('views', './src/views')

app.use('/', homepage);

app.use(express.static(__dirname + '/src/public'));
app.use(express.static(__dirname + '/src/views'));
app.use(express.static("."));

socket.init(server)
const io = socket.getIO()

io.on('connection', (socket) => { 

    socket.on('joinRoom', (data) => {
        socket.join(data.roomId)
    })
    socket.on('chat', (data) => {
        console.log(data.sender)
        io.to(data.roomId).emit('chat', data)
    })
    socket.on('typing', (data) => {
        socket.to(data.roomId).emit('typing', data.sender);
    });

})







