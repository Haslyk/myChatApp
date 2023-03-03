let socket = io()


/* Person Info */
const userInfoName = document.querySelector('.bigIcon h2')
const userInfoAdress = document.getElementById('adress')
const userInfoPhone = document.getElementById('phone')
const userInfoMail = document.getElementById('mail')
const userInfoPhoto = document.getElementById('img')

/* Message Box */
const name = document.getElementById('name')
const roomId = document.getElementById('roomId')
const output = document.getElementById('output')
const feedback = document.getElementById('feedback')
const message = document.getElementById('message')
const lastMessage = document.getElementById('lastMessage')
const sender = document.getElementById('sender').value
const submitBtn = document.getElementById('submitBtn')


const roomIds = {
    "1-2" : "room1",
    "2-1" : "room1",
    "1-3" : "room2",
    "3-1" : "room2",
    "2-3" : "room3",
    "3-2" : "room3",
}

const users = [
    {
        userId: 1,
        name : "Halim Aslıyüksek",
        address : "Merkez, Yalova",
        phone : "02695-565-1245",
        photo : "icon4.png"
    },
    {
        userId: 2,
        name : "Ali Veli",
        address : "Çiftlikköy, Yalova",
        phone : "5134-42-67899",
        photo : "icon1.png"
    },
    {
        userId: 3,
        address : "Çınarcık, Yalova",
        name : "Veli Ali",
        phone : "46661-13-531",
        photo : "icon3.png"
    },
]

function openMessage(mainUserId, userid, _name, _mail, _photo)
{
    const messageBtn = document.getElementById(`${userid}`)    
    const activeMsg = document.querySelector('.active')

    output.innerHTML = ''
    activeMsg.classList.remove('active')
    messageBtn.classList.toggle('active')
    
    for (let i = 0; i < users.length; i++) {
        if(users[i].userId == userid)
        {
            const user = users[i]
            userInfoName.innerHTML = _name
            userInfoAdress.innerHTML = user.address
            userInfoPhone.innerHTML = user.phone
            userInfoMail.innerHTML = _mail
            userInfoPhoto.src = 'img/' + _photo
        }
    }

    name.innerHTML = _name
    roomId.value = roomIds[mainUserId+'-'+userid]
    socket.emit('joinRoom', {roomId : roomId.value})
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
    for(var i = 0; i < 3 ; i++)
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
        roomId : roomId.value
    })
})

socket.on('typing', (data) => {
    feedback.innerHTML = '<p>' + data + ' yazıyor...</p>'
})




