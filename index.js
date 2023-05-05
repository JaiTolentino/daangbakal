const express = require('express');
const app = express();
const pool = require('./routes/dbconfig');
const httppostreq = require('./routes/postreqs');
const httpgetreq = require('./routes/getreqs');

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
app.use('/', httpgetreq);
app.use(httppostreq);

app.listen(5000, () => {
    console.log("Started on port 5000");
});