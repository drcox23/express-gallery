const bookshelf = require('./bookshelf');

const Users = bookshelf.Model.extend({
  tableName: 'users',
  idAttribute: 'user_id',
  hasTimestamps: true,
  images: () => {
    this.hasMany(Images)
  }
})


module.exports = Users;