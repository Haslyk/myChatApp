const express = require('express')
const homepage = require('./src/routers/homePageRouter')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const socket = require('./src/middlewares/socketio')
const db = require('./src/config/db')

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

app.get('/rooms', (req,res) => {
    const query = 'SELECT roomId,userIds FROM rooms';
    db.query(query, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('An error occurred while retrieving rooms.');
        } else {
            res.status(200).json(result);
        }
    });
});

app.get('/users', (req,res) => {
    const query = 'SELECT * FROM users';
    db.query(query, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('An error occurred while retrieving users.');
        } else {
            res.status(200).json(result);
        }
    });
});


socket.init(server)
const io = socket.getIO()

io.on('connection', (socket) => { 

    socket.on('joinRoom', (data) => {
        socket.join(data.roomId)
    })
    socket.on('chat', (data) => {
        io.to(data.roomId).emit('chat', data)
    })
    socket.on('typing', (data) => {
        socket.to(data.roomId).emit('typing', data);
    });

})







