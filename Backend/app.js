const express = require('express');

const sequelize = require('./utill/database');

const User = require('./modules/user');

const app = express();

var cors = require('cors');
app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/user');

app.use('/user', userRoutes);

sequelize
    .sync()
    .then(result => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });