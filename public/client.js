// This will handle client functionalities

var socket = io() // Getting socket io connection

// Elements will be updated for each event
var form = document.getElementById('form')
var input = document.getElementById('input')
var msgContainer = document.querySelector('.container')
var leaveButton = document.getElementById('leave')

var audio = new Audio('ting.mp3')

/* ----------------------- Deal with new user joining ----------------------- */

const append = (msg, type, postition) => {
    /** Function to update containers */

    const msgElement = document.createElement('div')
    msgElement.innerHTML = msg
    msgElement.classList.add(type)
    msgElement.classList.add(postition)
    msgContainer.append(msgElement)
}

function makeUserInaccessible() {
    /** When you chose to leave, you should have no ACCESS! */

    append('You have left the chat', 'msgLeft', 'center')
    input.disabled = true
    document.getElementById('sendBtn').disabled = true
    // leaveButton.disabled = true

    document.querySelector(
        '.user'
    ).innerHTML = `<b style="color:red">You Have Left The Chat</b>`

    input.value = 'To Exit Chat, Close The Tab!'
}

function insertName() {
    /** Take user name as input that will be displayed */

    var name = ''
    while (name === '' || name === null) {
        name = prompt('Enter Your Name to Join!')
        if (name && !(name === '')) {
            socket.emit('new-user-joined', name)
            const user = document.querySelector('.user')
            user.innerHTML = `You Have Joined as : <b style="color:green">${name}</b>`
        }
    }
}

function changeToRejoinButton() {
    leaveButton.innerHTML = 'Rejoin'
    leaveButton.style.backgroundColor = 'green'
    // leaveButton.disabled = false
}

function rejoinUser() {
    append('You have Rejoined!', 'msgLeft', 'center')

    input.disabled = false
    document.getElementById('sendBtn').disabled = false
}

function changeToLeaveButton() {
    leaveButton.innerHTML = 'Leave'
    leaveButton.style.backgroundColor = 'red'
    // leaveButton.disabled = false
}

// Ask user for name for this session and print this username as current username.
insertName()

// Let others know that YOU HAVE JOINED
socket.on('user-joined', (name) => {
    append(`<b>${name}</b> joined the chat`, 'msgJoined', 'center')
})

/* ----------------------------- Event Listeners ---------------------------- */

/** Listen "submit" event and get the input msg and respective user.
 * Print for sender that he had sent a message on left side.
 **/
form.addEventListener('submit', function (e) {
    e.preventDefault()
    if (input.value) {
        append(`<b>You</b> : ${input.value}`, 'msg', 'right')
        socket.emit('send', input.value)
        input.value = ''
    }
})

/** When YOU click on "leave" button */
youHaveLeft = false
leaveButton.addEventListener('click', (e) => {
    if (!youHaveLeft) {
        const ans = confirm(
            `1. You will still be able to see others messages.\n2. Everyone will see that you have left.\n3. You can comeback any time by clicking "rejoin" button.\n\nAre you sure that you want to leave ? `
        )
        if (ans) {
            socket.emit('leaveChat')
            makeUserInaccessible()
            changeToRejoinButton()
            youHaveLeft = true
        }
    } else {
        // window.location.reload()
        rejoinUser()
        changeToLeaveButton()
        youHaveLeft = false
        console.log('User Rejoined!')
    }
})

/* ---------------------------- Socket Responses ---------------------------- */

// Print messages of other users
socket.on('receive', (data) => {
    msg = `<b>${data.name}</b> : ${data.message}`
    append(msg, 'msg', 'left')
    audio.play()
})

// Print that user has left
socket.on('someoneLeft', (name) => {
    if (name) {
        append(`<b>${name}</b> left the chat`, 'msgJoined', 'center')
    }
})
