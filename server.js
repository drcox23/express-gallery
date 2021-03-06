const express = require('express');
const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars');
const methodOverride = require('method-override')
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const passport = require('passport');
const path = require('path');


const PORT = process.env.EXPRESS_CONTAINER_PORT;
const Images = require('./knex/models/Images');
// const Users = require('./knex/models/Users');

const galleryRoutes = require("./routes/galleryRoutes");
// const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.engine('hbs', expressHbs({
  defaultLayout: 'main',
  extname: '.hbs'
}));
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride("X-HTTP-Method-Override"));
app.use(methodOverride("_method"));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
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

// const checkAuthenticated (req, res, next) => {
//   if(req.isAuthenticated()){

//   }
// }


// GET HOME
app.get('/', (req, res) => {
  // res.sendfile('./index.html');
  // res.send('sanity check')
  // console.log("It's working!");
  if(req.user){
    const isAuthed = true;
    console.log("REQ.USER**** ", req.user)
  Images
    .fetchAll()
    .then(images => {
      const photos = images.toJSON();
      // console.log("photo info: ", photos);
      if (photos.featured === true) {
        const featured = photos;
        // console.log("featured photo", featured)
        res.render('home', {
          featured, isAuthed
        })
      }
      res.render('home', {
        photos, isAuthed
      })
    })
    .catch(err => {
      res.json("get all error: ", err);
    })
  }else{
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
  }

})

/// get login
app.get('/login', (req, res) => {
  // console.log(req)
  const addImage = true
    res.render('login', { addImage });
})

// can't register because username exists
app.get('/failedreg', (req, res) => {
  // console.log(req)
  const addImage = true
    res.render('failedreg', { addImage });
})

/// get register
app.get('/register', (req, res) => {
  // console.log(req)
  const addImage = true
    res.render('register', { addImage });
})


app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`)
})