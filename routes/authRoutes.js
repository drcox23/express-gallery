const router = require('express').Router();
const Users = require('../knex/models/Users.js');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');

passport.serializeUser( (user, done) => {
    console.log('#3 ********************')
    console.log(user);
    done(null, {
        username: user.username
    })
})

passport.deserializeUser( (user, done) => {
    console.log('#1 ********************')
    Users
    .where({username: user.username})
    .fetch()
    .then( user => {
        user = user.toJSON()
        done(null, user)
    })
    .catch( err => {
        console.log('err', err)
    })
})

passport.use(new LocalStrategy({usernameField: 'username'}, (username, password, done) => {
    console.log('#2 ********************')
    Users
    .where({username})
    .fetch()
    .then( user => {
        console.log(user)
        user = user.toJSON()
        bcrypt.compare(password, user.password)
        .then( res => {
            if (res){
                done(null, user)
            }
            else {
                done(null, false)
            }
        })
    })
    .catch( err => { 
        done(null, false)
    })

}))

router.post('/login', passport.authenticate('local', {failureRedirect: '/'}), (req, res) => {
    console.log('Post working')
    res.send('Im in')
})

router.post('/register', (req, res) => {
    const { username, password } = req.body

    bcrypt.genSalt(12)
    .then( salt => { 
        console.log('Salt', salt)
        return bcrypt.hash(password, salt)
    })
    .then(hash => {
        console.log('Hash', hash)
        return Users
        .forge({username, password: hash})
        .save()
    })
    .then( user => {
        user = user.toJSON
        res.json(user)
        
    })
    .catch( err => {
        console.log('Err', err)
        res.json(err)
    })
})




module.exports = router;