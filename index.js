// This file deals with server functionalities.
// This will handle socket io connections.

/* ------------------------ Imports and requirements ------------------------ */
const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const port = process.env.PORT || 3000

const users = {} // To store current user names and ids.

app.use(express.static(__dirname + '/public')) // Static directory

app.get('/', (req, res) => {
    // Routing
    res.sendFile(__dirname + '/index.html')
})

/* -------------- Actions to be taken for different situations -------------- */

io.on('connection', (socket) => {
    socket.on('new-user-joined', (name) => {
        // When new user joins
        users[socket.id] = name
        socket.broadcast.emit('user-joined', name) // Let everyone know that "user" is connected
    })

    socket.on('send', (message) => {
        // When someone sends a message
        socket.broadcast.emit('receive', {
            // Let everyone know the message "user" has sent
            message: message,
            name: users[socket.id],
        })
    })

    socket.on('disconnect', (msg) => {
        // When user disconnects
        socket.broadcast.emit('someoneLeft', users[socket.id]) // Let everyone know that "user" has left
        delete users[socket.id]
    })

    socket.on('leaveChat', (msg) => {
        socket.broadcast.emit('someoneLeft', users[socket.id])
        delete users[socket.id]
    })

    // socket.on('rejoinChat', (msg) => {
    //     socket.broadcast.emit('user-rejoined-chat', users[socket.id])
    //     delete users[socket.id]
    // })
})

/* --------------------------- Listen on port 3000 -------------------------- */
http.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`)
})
