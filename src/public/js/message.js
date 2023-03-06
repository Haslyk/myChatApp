let socket = io()


/* Person Info */
const noPI = document.getElementById('noPI')
const userInfoName = document.querySelector('.bigIcon h2')
const userInfoUserName = document.getElementById('username')
const userInfoMail = document.getElementById('mail')
const userInfoPhoto = document.getElementById('img')

/* Message Box */
const noMsg = document.getElementById('noMsg')
const name = document.getElementById('name')
const roomId = document.getElementById('roomId')
const output = document.getElementById('output')
const feedback = document.getElementById('feedback')
const message = document.getElementById('message')
const lastMessage = document.getElementById('lastMessage')
const sender = document.getElementById('sender').value
const submitBtn = document.getElementById('submitBtn')


let users = []

fetch('/users')
    .then((response) => response.json())
    .then((data) => {
        users = data.map((user) => {
            return {
                userId: user.id,
                name: user.fullName,
                mail : user.mail,
                photo: user.photo
            };
        });
        console.log(users)
    });

function openMessage(mainUserId, userid, _name, _username ,_mail, _photo)
{
    noMsg.style.display = 'none'
    noPI.style.display = 'none'
    const messageBtn = document.getElementById(`${userid}`)    
    const activeMsg = document.querySelector('.active')

    output.innerHTML = ''
    activeMsg.classList.remove('active')
    messageBtn.classList.toggle('active')
    
    userInfoName.innerHTML = _name
    userInfoUserName.innerHTML = _username
    userInfoMail.innerHTML = _mail
    userInfoPhoto.src = 'img/' + _photo

    name.innerHTML = _name

    fetch('/rooms')
        .then((response) => response.json())
        .then((data) => {
            data.find((item) => {
                if(item.userIds.includes(mainUserId) && item.userIds.includes(userid))
                {
                    roomId.value = item.roomId
                }
                
            })
            socket.emit('joinRoom', { roomId: roomId.value });
    });
}

socket.on('connect', () => {
    console.log("Connected to server")
})

submitBtn.addEventListener('click', () => {
    const selectedRoom = roomId.value;
    socket.emit('chat', {
        message : message.value,
        sender: sender,
        roomId : selectedRoom
    })
    message.value = ''
})


socket.on('chat', (data) => {
    let photo
    for(var i = 0; i < users.length; i++)
    {
        if(users[i].name == data.sender){
            photo = users[i].photo
        }
    }

    feedback.innerHTML = ' '
    if(data.sender == sender)
    {
        output.innerHTML += 
        `
            <div class='col right'>
                <div class='text'>
                    <p> ${data.message} </p>
                </div>
                <div class='smallIcon'>
                    <img src='img/${photo}'>
                </div>
            </div>
        `
        lastMessage.innerHTML = "<i class='fa-solid fa-check-double'></i>" + data.message

    }
    else {
        output.innerHTML += 
        `
            <div class='col'>
                <div class='smallIcon'>
                    <img src='img/${photo}'>
                </div>
                <div class='text'>
                    <p> ${data.message} </p>
                </div
            </div>
        `
        lastMessage.innerHTML = data.message
    }
})


message.addEventListener('keypress', () => {
    socket.emit('typing', {
        sender : sender,
        roomId : roomId.value,
        typing : true
    })
})

message.addEventListener('blur', () => {
    socket.emit('typing', {
        sender : sender,
        roomId : roomId.value,
        typing : false
    })
})

socket.on('typing', (data) => {
    if(data.typing){
        feedback.innerHTML = '<p>' +  data.sender + ' yazıyor...</p>'
    }
    else {
        feedback.innerHTML = ''
    }
})




