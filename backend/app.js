const express = require('express');
const app = express();
const cors = require('cors');


app.use(cors());
app.use(express.json());

app.get('/api/1.0/test', (req, res) => {
    res.send('Hello');
});

app.get('/.well-known/pki-validation/753A3038A7992A7112828484D232D6CA.txt', (req, res) => {
    console.log("well-know!");
    const file= path.join(__dirname,'static','753A3038A7992A7112828484D232D6CA.txt');
    console.log(file);
    res.sendFile(file);
});

app.listen(3000, () => {
    console.log(`Server is running`);
});