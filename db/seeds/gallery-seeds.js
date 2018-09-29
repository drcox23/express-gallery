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
        },
        {
          title: 'Diamond Head from Waikiki Beach',
          author: 'Duke K.',
          link: 'http://farm4.static.flickr.com/3427/3292262279_7166ee6166.jpg',
          description: "DaKine beach",
          featured: true

        }
      ])
    })

}