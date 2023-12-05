const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const http = require('http');
const redis = require('./utils/cache');

app.use(cors());
app.use(express.json());

app.get('/api/1.0/test', (req, res) => {
    console.log("Hello~~");
    res.send('Hello');
});

app.get('/.well-known/pki-validation/444574AA09C845D69B87F522F342F2BB.txt', (req, res) => {
    console.log("well-know!");
    const file= path.join(__dirname,'static','444574AA09C845D69B87F522F342F2BB.txt');
    console.log(file);
    res.sendFile(file);
});

const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
    },
});
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('titleMsg',async(data) => {
        console.log('Received title:', data.title);
        await redis.updateCache(`${data.postId}&title`,data.title)
        socket.emit('msgFromServer', { status: true });
    });

    socket.on('contentMsg', async(data) => {
        console.log('Received content:', data.content);
        await redis.updateCache(`${data.postId}&content`,data.content)
        socket.emit('msgFromServer', { status: true });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});



server.listen(3000, () => {
    console.log(`Server is running`);
});