const app = require('http').createServer()
const { Server } = require('socket.io');


const io = new Server(app, {
    cors: {
        origin: 'http://localhost:9100',
        credentials: true
    }
})

io.on('connection', (socket) => {
    console.log(socket)
    io.emit('enter', { name: socket.name })
    socket.on('message', (msg) => {
        io.emit('message', { msg })
    })
})

app.listen(9001)