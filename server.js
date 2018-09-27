const express = require('express');
const bodyParser = require('body-parser');
const knex = require('./db/knex.js')

const PORT = process.env.EXPRESS_CONTAINER_PORT;
// const Photos = require('./db/models/Photos');
// const Users = require('./db/models/Users');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.send('sanity check');
});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`)
})