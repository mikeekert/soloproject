const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const passport = require('./strategies/sql.localstrategy');
const sessionConfig = require('./modules/session.config');

// Route includes
const indexRouter = require('./routes/index.router');
const userRouter = require('./routes/user.router');
const registerRouter = require('./routes/register.router');
const gamesRouter = require('./routes/games.router');

const port = process.env.PORT || 5000;



// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Serve back static files
app.use(express.static('./server/public'));

// Passport Session Configuration
app.use(sessionConfig);

// Start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/register', registerRouter);
app.use('/user', userRouter);
app.use('/games/', gamesRouter);

// Catch all bucket, must be last!
app.use('/', indexRouter);

// Listen //
app.listen(port, function(){
   // console.log('Listening on port:', port);
});

