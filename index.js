require('dotenv').config()
const express = require('express');
const cors = require('cors')
const app = express();
const router = express.Router();
const config = require('./config/database');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;
const path = require('path');
const http = require('http').Server(app);


//path routes
//onst customer = require('./routes/customers')(router);
const authentication = require('./routes/authentication')(router);
const customer = require('./routes/customers')(router);
const users = require('./routes/users')(router);
const file = require('./routes/fileupload')(router);

mongoose.Promise = global.Promise;

mongoose.connect(config.uri, config.options, (err) => {
    if (err) {
        console.log('cant connect to database ' + process.env.DB_NAME);
    } else {
        console.log('connected to the database ' + process.env.DB_NAME);
    }
});


app.use(cors())


//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}


//body-parser built in express middleware
app.use(express.json({limit: '20mb'}));
app.use(express.urlencoded({limit: '20mb',  extended: false}));

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended:false}));

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
app.use(allowCrossDomain);

//for deployment on hosting and build
app.use(express.static(__dirname + '/app/dist/'));
app.use('/images', express.static(path.join(__dirname, './images')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads/files')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads/images')));

//api routes
//app.use('/customer', customer);
app.use('/authentication', authentication);
app.use('/customers', customer);
app.use('/users', users);
app.use('/fileupload', file);
app.use('/profile_pic', express.static(path.join(__dirname, '../uploads/images')));


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/app/dist/index.html'),)
   // res.sendFile('Adik SALA!!!')
});


const servers = app.listen(PORT|| 52847, () => {
    console.log('Connected on port ' + PORT );
});

