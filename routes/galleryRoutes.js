// ############# GALLERY ###################

const express = require("express");
const router = express.Router();
const Images = require('../knex/models/Images');
// const knex = require('../knex/knex.js')

// router.get('/', (req, res) => )

//'get' for adding a new image 
router.get('/new', (req, res) => {
  console.log("adding a new image")
  const addImage = true
    res.render('upload', { addImage });
})


// adding a new image to the gallery
router.post('/new', (req, res) => {
  console.log("new image added")
  const newImage = req.body;
  console.log("info to add:", newImage);
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
        console.log("photo info: ", photos);
        res.render('idp', photos)
       })
       .catch( err => {
         res.json(err);
       })

})

// get to edit an individual gallery photo
router.get('/:id/edit', (req, res) => {
  const image_id = req.params.id;
  console.log("editing image: ", image_id);
  Images
    .where({image_id})
    .fetchAll()
    .then(results => {
      const photos = results.toJSON();
      console.log("results: ", photos[0])
      res.render('edit', photos[0])
    })
    .catch(err => {
      res.json(err);
    })
})









module.exports = router;