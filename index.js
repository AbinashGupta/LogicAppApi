const express = require('express');
const app = express();
var bodyParser = require('body-parser');

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
    const respStr = "<pre>" + messageStr + "</pre>"
    res.send(respStr);
}) 

app.post('/api/msgStore', (req, res) => {
    req.body = req.body.replace("@ string 3http://schemas.microsoft.com/2003/10/Serialization/��", "");
    let delimiter = "\r\n";
    if (messageStr === "") {
        delimiter = "";
    }
    messageStr += delimiter + req.body;
    res.send('Success');
})

app.get('/api/fetchreply', (req, res) => {
    require('./gmail.js');
    const resp = require('./gmail.js').resp;
    console.log(resp);
    resp ? res.status(200).send("Found") : res.status(277).send("Not Found")
})

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});