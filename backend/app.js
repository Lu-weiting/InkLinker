const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');

app.use(cors());
app.use(express.json());

app.get('/api/1.0/test', (req, res) => {
    res.send('Hello');
});

app.get('/.well-known/pki-validation/444574AA09C845D69B87F522F342F2BB.txt', (req, res) => {
    console.log("well-know!");
    const file= path.join(__dirname,'static','444574AA09C845D69B87F522F342F2BB.txt');
    console.log(file);
    res.sendFile(file);
});

app.listen(3000, () => {
    console.log(`Server is running`);
});