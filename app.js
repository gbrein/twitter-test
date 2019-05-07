const express = require('express');
const userModel = require('./models/userModel');
const app = express();
const dbName = 'projeto-twitter';
const mongoose = require('mongoose');
const hbs = require('hbs');
const session = require('express-session');
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const findOrCreate = require('mongoose-findorcreate');
const dotEnv = require('dotenv').config();


app.set('view engine', 'hbs');
app.set('views', `${__dirname}/views`);
app.use(express.static(`${__dirname}/public`));
hbs.registerPartials(`${__dirname}/views/partials`);
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(cookieParser());
app.use(session({
  secret: 'watchingferries',
  resave: true,
  saveUninitialized: true,
}));
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

mongoose.connect(`mongodb://localhost/${dbName}`, (error) => {
  if (error) {
    console.log('Não consegui conectar');
  } else {
    console.log(`CONECTAMOS EM ${dbName}`);
  }
});

app.use(session({
  secret: 's3cr3t',
  resave: true,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());


passport.use(new TwitterStrategy({
    consumerKey: dotEnv.parsed.consumerKey,
    consumerSecret: dotEnv.parsed.consumerSecret,
    callbackURL: "http://127.0.0.1:3000/login/callback"
  },
  function (req, token, tokenSecret, profile, done) {
    userModel.findOne({
      twitterId: profile.id
    }).then((currentUser) => {
      if (currentUser) {
        console.log(`User is: ${currentUser}`);
        done(null, currentUser);
      } else {
        new userModel({
          username: profile.username,
          twitterID: profile.id,
          name: profile.displayName,
          thumbnail: profile.photos[0].value
        }).save().then((newUser) => {
          console.log('new user created:' + newUser);
          done(null, newUser);
        })
      }
    })
  }
));

passport.serializeUser(function (user, done) {
  done(null, user);
})
passport.deserializeUser(function (id, done) {
  userModel.findById(id).then((user) => {
    done(null, user);
  })
})

app.get('/', (request, response) => {
  response.render('index');
});

app.get('/login', (request, response) => {
  response.render('login');
});

app.get('/loged', (request, response) => {
  console.log(request.session)
  response.render('loged');
});

app.get('/logout', (request, response) => {
  request.logout();
  response.redirect('/');
})

app.get('/login/twitter', passport.authenticate('twitter'));

app.get('/login/callback',
  passport.authenticate('twitter', {
    successRedirect: '/loged',
    failureRedirect: '/login',
  }));

app.listen(3000, 'localhost', (err) => {
  if (err) {
    console.log('Deu ruim na conexao bro');
  } else {
    console.log('Romulando na porta 3000');
  }
});