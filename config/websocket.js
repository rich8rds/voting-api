const { Server } = require('socket.io')

const io = new Server({
    cors: {
        // origin: "http://localhost:5173"
        origin: "https://voting-app-fe.onrender.com/"
    }
});

const socket = io.on('connection', (socket) => socket)

io.listen(4001)

module.exports = { socket, io}

