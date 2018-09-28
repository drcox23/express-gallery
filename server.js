const express = require('express');
const bodyParser = require('body-parser');
// const knex = require('./knex/knex.js')

const PORT = process.env.EXPRESS_CONTAINER_PORT;
const Photos = require('./knex/models/Photos');
const Users = require('./knex/models/Users');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.send('sanity check')
})

// get all users
app.get('/api/users', (req, res) => {
  Users
  .fetchAll()
  .then( users => {
    res.json(users.serialize());
  })
  .catch( err => {
    res.json(err);
  })
})

// get all photos by user_id
app.get('/api/users/:user_id/photos', (req, res) => {
  const { user_id } = req.params;
  Photos
    .where({user_id})
    .fetchAll()
    .then( photos => {
      res.json(photos.serialize())
    })
    .catch( err => {
      res.json(err);
    })
})

// create task by user id
app.post('/api/users/:user_id/photos/new', (req, res) => {
  const { user_id } = req.params;
  const payload = {
    name: req.body.name
  }
  Photos
    .forge(payload)
    .save()
    .then( result => {
      res.json(result)
    })
    .catch( err => {
      console.log('error', err)
      res.json(err);
    })
})

// update task by task id
app.put('/api/photos/:task_id/edit', (req, res) => {
  const { task_id } = req.params;
  
  const payload = {
    name: req.body.name,
    is_complete: req.body.is_complete
  }

  Photos
    .where({task_id})
    .fetch()
    .then( task => {
      return task.save(payload)
    })
    .then( result => {
      console.log('result', result)
      res.json(result);
    })
    .catch(err => {
      res.json(err);
    })
})

// delete task by task id
app.delete('/api/photos/:photo_id/delete', (req, res) => {
  const { task_id } = req.params;
  
  Photos
    .where({ task_id })
    .destroy()
    .then( result => {
      res.json(result);
    })
    .catch(err => {
      res.json(err);
    })
})


app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`)
})