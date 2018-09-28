exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(() => {
      return knex('images').del()
    })
    .then(() => {
      // insert seed entries
      return knex('users').insert([{
          username: 'BobRoss',
          password: 'password123'
        },
        {
          username: 'Admin',
          password: '123password',
          isAdmin: true
        }
      ]);
    })
    .then(() => {
      return knex('images').insert([{
        title: 'Hawaiian Beach',
        author: 'Pele',
        link: 'http://www.kailuachamber.com/Content/Pictures/Picture.ashx?PicId=221780&Size=S',
        description: "Who doesn't love long sunset walks on a beautiful beach in Hawaii"
      }])
    })

}