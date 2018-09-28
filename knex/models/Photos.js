const bookshelf = require('./bookshelf')

const Photos = bookshelf.Model.extend({
  tableName: 'photo',
  idAttribute: 'photo_id',
  hasTimestamps: true
})

module.exports = Photos