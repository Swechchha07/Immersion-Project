const express = require('express');
const bodyParser = require('body-parser');
const app = express();
let vehicles = [];
let id = 1;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Home - Read all
app.get('/', (req, res) => {
  res.render('index', { vehicles });
});

// New form
app.get('/vehicles/new', (req, res) => {
  res.render('new');
});

// Create
app.post('/vehicles', (req, res) => {
  const { vehicleName, price, image, desc, brand } = req.body;
  vehicles.push({ id: id++, vehicleName, price, image, desc, brand });
  res.redirect('/');
});

// Edit form
app.get('/vehicles/edit/:id', (req, res) => {
  const vehicle = vehicles.find(v => v.id == req.params.id);
  res.render('edit', { vehicle });
});

// Update
app.post('/vehicles/update/:id', (req, res) => {
  const { vehicleName, price, image, desc, brand } = req.body;
  const index = vehicles.findIndex(v => v.id == req.params.id);
  vehicles[index] = { id: parseInt(req.params.id), vehicleName, price, image, desc, brand };
  res.redirect('/');
});

// Delete
app.post('/vehicles/delete/:id', (req, res) => {
  vehicles = vehicles.filter(v => v.id != req.params.id);
  res.redirect('/');
});

// API endpoint for JSON
app.get('/api/vehicles', (req, res) => {
  res.json(vehicles);
});

app.listen(4000, () => console.log('Server running at http://localhost:4000'));
