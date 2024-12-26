const express = require('express');
const path = require('path');

// Init Express
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve Homepage
app.get('/', async (req, res) => {
    res.render("index")
});

// Listen
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;