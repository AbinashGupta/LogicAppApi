const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const fs = require('fs');

const PORT = process.env.PORT || 3000;
let messageStr = "";

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.text());

app.get('/',(req,res) => {
    res.send('Successfuly hit');
})

app.get('/api/msgStore', (req, res) => {
    const respStr = messageStr;
    res.send(respStr);
}) 

app.post('/api/msgStore', (req, res) => {
    let delimiter = "\r\n";
    if (messageStr === "") {
        delimiter = "";
    }
    messageStr += delimiter + req.body;
    res.send('Success');
})

app.get('/api/fetchreply', async (req, res) => {
    require('./gmail.js');
    const resp = await require('./gmail.js').getMailResponse;
    console.log("gmail response: ",resp);
    delete require.cache[require.resolve('./gmail.js')]
    resp ? res.status(200).send("Found") : res.status(277).send("Not Found")
})

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});