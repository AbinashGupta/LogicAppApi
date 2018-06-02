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
    res.send(messageStr);
}) 

app.post('/api/msgStore', (req, res) => {
    req.body = req.body.replace("@ string 3http://schemas.microsoft.com/2003/10/Serialization/��", "");
    let delimiter = "\n";
    if (messageStr === "") {
        delimiter = "";
    }
    messageStr += delimiter + req.body;
    res.send('Success');
})

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});