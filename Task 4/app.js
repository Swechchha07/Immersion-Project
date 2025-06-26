const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = require('./models/User');

const app = express();
let vehicles = [];
let id = 1;


mongoose.connect('mongodb://localhost:27017/vehicleApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'secretKey123',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username });
    if (!user || !(await user.validatePassword(password))) {
      return done(null, false, { message: 'Incorrect credentials' });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}


app.get('/', (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/register'); 
  } else {
    res.render('index', { vehicles });
  }
});


app.get('/vehicles/new', isLoggedIn, (req, res) => {
  res.render('new');
});

app.post('/vehicles', isLoggedIn, (req, res) => {
  const { vehicleName, price, image, desc, brand } = req.body;
  vehicles.push({ id: id++, vehicleName, price, image, desc, brand });
  res.redirect('/');
});

app.get('/vehicles/edit/:id', isLoggedIn, (req, res) => {
  const vehicle = vehicles.find(v => v.id == req.params.id);
  res.render('edit', { vehicle });
});

app.post('/vehicles/update/:id', isLoggedIn, (req, res) => {
  const { vehicleName, price, image, desc, brand } = req.body;
  const index = vehicles.findIndex(v => v.id == req.params.id);
  vehicles[index] = { id: parseInt(req.params.id), vehicleName, price, image, desc, brand };
  res.redirect('/');
});

app.post('/vehicles/delete/:id', isLoggedIn, (req, res) => {
  vehicles = vehicles.filter(v => v.id != req.params.id);
  res.redirect('/');
});


app.get('/api/vehicles', (req, res) => res.json(vehicles));


app.get('/register', (req, res) => {
  res.send(`<form method="POST" action="/register">
    <input name="username" placeholder="Username" required /><br/>
    <input name="email" placeholder="Email" /><br/>
    <input name="age" placeholder="Age" /><br/>
    <input name="password" type="password" placeholder="Password" required /><br/>
    <button type="submit">Register</button>
  </form>`);
});

app.post('/register', async (req, res) => {
  const { username, password, email, age } = req.body;
  try {
    const user = new User({ username, password, email, age });
    await user.save();
    res.redirect('/login'); 
  } catch (err) {
    res.send('Error registering: ' + err.message);
  }
});


app.get('/login', (req, res) => {
  res.send(`<form method="POST" action="/login">
    <input name="username" placeholder="Username" required /><br/>
    <input name="password" type="password" placeholder="Password" required /><br/>
    <button type="submit">Login</button>
  </form>`);
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

app.listen(4000, () => console.log('Server running at http://localhost:4000'));
