// ############# GALLERY ###################

const express = require("express");
const router = express.Router();
const Images = require('../knex/models/Images');
// const knex = require('../knex/knex.js')


//get individual gallery image
router.get('/:id', (req, res) => {
  // res.json("sanity check");
   const image_id = req.params.id;
   console.log("image id: ", image_id);
     Images
       .where({image_id})
       .fetch()
       .then( image => {
         res.json(image);
       })
       .catch( err => {
         res.json(err);
       })

})






module.exports = router;