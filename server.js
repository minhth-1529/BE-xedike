const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routers/api/user');
const tripRouter = require('./routers/api/trip');

mongoose
    .connect('mongodb://localhost:27017/prj-xedike', {
        useNewUrlParser: true,
        useCreateIndex: true
    })
    .then(() => console.log('Connect successfully'))
    .catch(console.log);

// khoi tao server
const app = express();

const port = process.env.PORT || 5000;

//middleware serve static files
app.use('/uploads/avatars', express.static('./uploads/avatars'));

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization, fingerprint'
    );
    res.header(
        'Access-Control-Allow-Methods',
        'PUT, POST, GET, DELETE, OPTIONS'
    );
    next();
});

//middleware parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// middleware router handler
app.use('/api/users', userRouter);
app.use('/api/trips', tripRouter);

app.listen(port, () => {
    console.log(`Server running!!!!!!!!! ${port}`);
});
