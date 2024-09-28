
require('dotenv').config();

const express = require("express");
const expressLayout = require('express-ejs-layouts');
const cookiesParser = require('cookie-parser');
const methodOverride = require('method-override');  //to use PUT & Delete http request 

const connectDB = require('./server/config/db');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const app = express();
const PORT = process.env.PORT;


//sets up static file serving
app.use(express.static('public'));



//connect to db
connectDB();
//console.log('MongoDB URI:', process.env.MONGODB_URI);

//for search
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// allows using _method in forms
app.use(methodOverride('_method'));


//for register form midelware
app.use(cookiesParser());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
    //cookie: { maxAge: new Date (Date.now() + (3600000))}
}))



//templating engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use('/', require('./server/routes/main'))
app.use('/', require('./server/routes/admin'))


app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
})