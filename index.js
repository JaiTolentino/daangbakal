const express = require('express');
const app = express();
const pool = require('./routes/dbconfig');
const httprequests = require('./routes/httprequests');

pool.connect((error) => {
    if(error) console.log("Failed to Connect: " + error)
    else {
    console.log("Connected!")
    }
});

app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use(express.static('views'));
app.set('view engine', 'hbs');
app.use('/', httprequests);

app.listen(5000, () => {
    console.log("Started on port 5000");
});