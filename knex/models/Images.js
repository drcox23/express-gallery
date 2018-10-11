const bookshelf = require('./bookshelf')

const Images = bookshelf.Model.extend({
  tableName: 'images',
  idAttribute: 'image_id',

  hasTimestamps: true
})

module.exports = Images;