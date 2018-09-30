// ############# GALLERY ###################

const express = require("express");
const router = express.Router();
const Images = require('../knex/models/Images');
// const knex = require('../knex/knex.js')

// get /gallery
router.get('/', (req, res) => {
  // res.sendfile('./index.html');
  // res.send('sanity check')
  console.log("It's working!");
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

//'get' for adding a new image 
router.get('/new', (req, res) => {
  // console.log("adding a new image")
  const addImage = true
    res.render('upload', { addImage });
})


// adding a new image to the gallery
router.post('/new', (req, res) => {
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


//get individual gallery image
router.get('/:id', (req, res) => {
  // res.json("sanity check");
   const image_id = req.params.id;
   console.log("image id: ", image_id);
     Images
       .where({image_id})
       .fetch()
       .then( image => {
        const photos = image.toJSON();
        console.log("get image")
        // console.log("photo info: ", photos);
        res.render('idp', photos)
       })
       .catch( err => {
         res.json(err);
       })

})

// edit the gallery image
router.put('/:id', (req, res) => {
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

// get to edit an individual gallery photo
router.get('/:id/edit', (req, res) => {
  const image_id = req.params.id;
  // console.log("editing image: ", image_id);
  Images
    .where({image_id})
    .fetchAll()
    .then(results => {
      const photos = results.toJSON();
      // console.log("results: ", photos[0])
      res.render('edit', photos[0])
    })
    .catch(err => {
      res.json(err);
    })
})

router.delete('/:id', (req, res) => {
  
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










module.exports = router;