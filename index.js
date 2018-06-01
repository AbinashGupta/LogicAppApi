const express = require('express');
const app = express();
const jsonXml = require('jsontoxml');
var bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser); 

const PORT = process.env.PORT || 3000;
const messageArray = [];

app.use(bodyParser.xml({
    xmlParseOptions: {
        normalizeTags: true, // Transform tags to lowercase
        explicitArray: false // Only put nodes in array if >1
    }
}));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/api/msgStore', (req, res) => {
    const resData = jsonXml(JSON.stringify(messageArray));
    res.send(resData);
}) 

app.post('/api/msgStore', (req, res) => {
    messageArray.push(req.body)
    res.send('Success');
})

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});