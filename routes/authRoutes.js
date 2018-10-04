const router = require('express').Router();
const Users = require('../knex/models/Users.js');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');


passport.serializeUser( (user, done) => {
    // console.log('#3 ********************')
    console.log("passport.serialize", user);
    done(null, {
        username: user.username,
        // isAuthenticated = true,
    })
})

passport.deserializeUser( (user, done) => {
    // console.log('#1 ********************')
    Users
    .where({username: user.username})
    .fetch()
    .then( user => {
        console.log("users***: ", user.toJSON())
        // if(!user.username){
        user = user.toJSON()
        // }else
        done(null, user)
    })
    .catch( err => {
        console.log('err', err)
    })
})

passport.use(new LocalStrategy({usernameField: 'username'}, (username, password, done) => {
    console.log("passport auth: ", password)
    Users
    .where({username})
    .fetch()
    .then( user => {
        user = user.toJSON()
        console.log("what's the user password? ", user.password)
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

router.post('/logout', (req, res) => {
    req.logout()
    console.log("logged the user out")
    // res.send("user has been logged out")
    res.redirect('/')
})

router.post('/login', passport.authenticate('local', {failureRedirect: '/'}), (req, res) => {
    console.log("check login", passport.authenticate)
    let user = {}
    // user.username = req.body.username;
    // user.isAuthenticated = true;
    console.log('Post working')
    res.redirect('/')
})

router.post('/register', (req, res) => {
    const { username, password } = req.body
    // console.log("username: ", username)
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
        res.send("WE ARE REGISTERED")
        res.json(user)
        
    })
    .catch( err => {
        console.log('Err', err)
        res.json(err)
    })
})




module.exports = router;