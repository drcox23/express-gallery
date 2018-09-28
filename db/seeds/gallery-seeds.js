exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('user').del()
    .then(() => {
      return knex('task').del()
    })
    .then(() => {
      // insert seed entries
      return knex('user').insert([{
          email: 'mrRoboto@gmail.com',
          password: 'password123'
        },
        {
          email: 'daKine@yahoo.com',
          password: '123password'
        }

      ]);
    })
    .then(() => {
      return knex('task').insert([{
        name: 'Test Name',
        is_complete: 'false',

      }])
    })

}