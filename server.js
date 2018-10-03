const express = require('express');
const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars');
const methodOverride = require('method-override')
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const passport = require('passport');


const PORT = process.env.EXPRESS_CONTAINER_PORT;
const Images = require('./knex/models/Images');
const Users = require('./knex/models/Users');

<<<<<<< HEAD
// const galleryRoutes = require("./routes/galleryRoutes");
// const userRoutes = require("./routes/userRoutes");
=======
const galleryRoutes = require("./routes/galleryRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
>>>>>>> auth

const app = express();

app.use(express.static(__dirname + '/public'));
// app.use(express.static('public'));
app.engine('.hbs', expressHbs({
  defaultLayout: 'main',
  extname: '.hbs'
}));
app.set('view engine', '.hbs');

app.use(methodOverride("X-HTTP-Method-Override"));
app.use(methodOverride("_method"));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
<<<<<<< HEAD
// app.use("/gallery", galleryRoutes);
// app.use("/user", userRoutes);
=======
app.use(session ({
  store: new RedisStore({url: 'redis://redis:6379'}),
  secret: 'SnekPass',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize())
app.use(passport.session())

app.use('/auth', authRoutes)
app.use("/gallery", galleryRoutes);

>>>>>>> auth

// GET HOME
app.get('/', (req, res) => {
  console.log("It's working!");
  Images
    .fetchAll()
    .then(images => {
      const photos = images.toJSON();
      // console.log("photo info: ", photos);
      if (photos.featured === true) {
        const featured = photos;
        // console.log("featured photo", featured)
        res.render('home', {

          featured
        })
      }
      res.render('home', {
        photos
      })
    })
    .catch(err => {
      res.json("get all error: ", err);
    })

})

app.get('/gallery', (req, res) => {
  console.log('/gallery GET');
  Images
  .fetchAll()
  .then(images => {
    const photos = images.toJSON();
    console.log("photo info: ", photos);
    if (photos.featured === true) {
      const featured = photos;
      console.log("featured photo", featured)
      res.render('home', {
        featured
      })
    }
    res.render('home', {
      photos
    })
  })
  .catch(err => {
    res.json("get all error: ", err);
  }) 
})

/// GET Upload
app.get('/new', (req, res) => {
  console.log(req)
  const addImage = true
    res.render('upload', { addImage });
 
})

// adding a new image to the gallery
app.post('/new', (req, res) => {
  console.log("new image added")
  const newImage = req.body;
  // console.log("info to add:", newImage);
   Images
   .forge({
    title: newImage.title, 
    author: newImage.author, 
    link: newImage.link,
    description: newImage.description
    // featured: `${newImage.featured}`
  })
  .save()
  .then(results => {
    res.redirect("/");
  })
  .catch(err => {
    res.send(err)
  })
})

// get to edit an individual gallery photo
app.get('/edit', (req, res) => {
  const image_id = req.query.image_id;
  // console.log("editing image: ", image_id);
  Images
    .where({image_id})
    .fetchAll()
    .then(results => {
      const temp = results.toJSON();
      const photos = temp[0]
      console.log("results: ", photos)
      res.render('edit', photos)
    })
    .catch(err => {
      res.json(err);
    })
})

/// get image detail page
app.get('/:id', (req, res) => {
  // res.sendfile('./index.html');
  // res.send('sanity check')

  const image_id = req.params.id;
  function filterid (item) {
    if (item.image_id == image_id) {
      return item
    }
  }
  Images
    .fetchAll()
    .then(images => {
      const photos = images.toJSON();
      const temp = photos.filter(filterid)
      const mainimage = temp[0]
      console.log("photo info: ", mainimage);
      res.render('idp', { mainimage, photos })
    })
    .catch(err => {
      res.json("get all error: ", err);
    })
})

// edit the gallery image
app.put('/:id', (req, res) => {
  const data = req.body;
  const  image_id  = req.params.id
  console.log("whats the id", image_id);
  console.log("the data goods: ", data);
  const newInfo = {
    title: data.title,
    author: data.author,
    link: data.link,
    description: data.link
  }
  Images
    .where({image_id})
    .fetch()
    .then(update => {
      return update.save(newInfo)
    })
    .then(results => {
      const photos = results.toJSON()
      console.log("checking put stuff:", photos)
      res.render('idp', photos)
    })
    .catch(err => {
      console.log("put error: ", err)
    })
})

app.delete('/:id', (req, res) => {
  
  const image_id = req.params.id;
  console.log("delete: ", image_id);

  Images
  .where({image_id})
  .destroy()
  .then(results => {
    res.redirect('/')
  })
  .catch(err => {
    console.log("delete error: ", err);
  })
})



/// get login
app.get('/login', (req, res) => {
  console.log(req)
  const addImage = true
    res.render('login', { addImage });
  

})






app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`)
})