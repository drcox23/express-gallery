// ############# GALLERY ###################

const express = require("express");
const router = express.Router();
const Images = require('../knex/models/Images');
// const knex = require('../knex/knex.js')
// const authRoutes = require("./routes/authRoutes");

// app.use('/auth', authRoutes)


// get /gallery
router.get('/', (req, res) => {
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

//'get' for adding a new image 
router.get('/new', (req, res) => {
  // console.log("adding a new image")
  const addImage = true
  if(req.user){
    const isAuthed = true;
    console.log("REQ.USER**** ", req.user)
    res.render('upload', { addImage, isAuthed });
  }else{
    // const isAuth = false
    res.render('upload', {addImage})
  }
})


// adding a new image to the gallery
router.post('/new', (req, res) => {
  // console.log("new image added")
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

// render edits of the gallery image
router.put('/:id', (req, res) => {
  const data = req.body;
  const  image_id  = req.params.id
  // console.log("whats the id", image_id);
  // console.log("the data goods: ", data);

  const newInfo = {
    title: data.title,
    author: data.author,
    link: data.link,
    description: data.description

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
      res.redirect(`/gallery/${photos.image_id}`)
    })
    .catch(err => {
      console.log("put error: ", err)
    })

})


// get to edit an individual gallery photo
router.get('/edit/:id', (req, res) => {
  const image_id = req.params.id;
  console.log("CAN WE EDITTTTTTT")
  if(req.user){
    const isAuthed = true;
    console.log("REQ.USER**** ", req.user)
    Images
    .where({image_id})
    .fetchAll()
    .then(results => {
      const temp = results.toJSON();
      const photos = temp[0]
      console.log("WHATS PHOTOS????", photos)
      // console.log("results: ", photos)
      res.render('edit', {photos, isAuthed})
    })
    .catch(err => {
      res.json(err);
    })
  }else{
    // const isAuth = false
  // console.log("editing image: ", image_id);
  Images
  .where({image_id})
  .fetchAll()
  .then(results => {
    const temp = results.toJSON();
    const photos = temp[0]
    // console.log("results: ", photos)
    res.render('edit', photos)
  })
  .catch(err => {
    res.json(err);
  })
}
})


//get individual gallery image
router.get('/:id', (req, res) => {
  const image_id = req.params.id;
  function filterid (item) {
    if (item.image_id == image_id) {
      return item
    }
  }
  if(req.user){
    const isAuthed = true;
    console.log("REQ.USER**** ", req.user)
  Images
    .fetchAll()
    .then(images => {
      const photos = images.toJSON();
      const temp = photos.filter(filterid)
      const mainimage = temp[0]
      // console.log("photo info: ", mainimage);
      res.render('idp', { mainimage, photos, isAuthed })
    })
    .catch(err => {
      res.json("get all error: ", err);
    })
  }else{
    Images
    .fetchAll()
    .then(images => {
      const photos = images.toJSON();
      const temp = photos.filter(filterid)
      const mainimage = temp[0]
      // console.log("photo info: ", mainimage);
      res.render('idp', { mainimage, photos })
    })
    .catch(err => {
      res.json("get all error: ", err);
    })
}

})


router.delete('/:id', (req, res) => {
  
  const image_id = req.params.id;
  // console.log("delete: ", image_id);

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



// function checkAuth(req, res, done){
//   if (req.isAuthenticated()) {
//       let isAuthed = true;
//       done();
//   } else {
//       let notAuthed = true;
//       done();
//   }
// }

module.exports = router;