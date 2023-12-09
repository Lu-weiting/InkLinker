const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const http = require('http');
const redis = require('./utils/cache');
const s3Client = require('./utils/s3presign');
const monitor_router = require('./Router/monitor_router');
const postRouter = require('./Routers/postRouter');


app.use(cors());
app.use(express.json());
app.use('/api/1.0/posts',postRouter);
app.use('/api/1.0/monitor',monitor_router);
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

app.get('/api/generate-presigned-url', async (req, res) => {
    try {
        const presignedUrl = await s3Client.getSign(req.query.filename);
        res.json({ presignedUrl });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating presigned URL');
    }
});

const server = http.createServer(app);
const io = require("socket.io")(server, {
    path: '/api/socket.io',
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