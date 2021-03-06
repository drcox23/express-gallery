const router = require('express').Router();
const Users = require('../knex/models/Users.js');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');


passport.serializeUser((user, done) => {
    // console.log('#3 ********************')
    console.log("passport.serialize", user);
    done(null, {
        username: user.username,
        // isAuthenticated = true,
    })
})

passport.deserializeUser((user, done) => {
    // console.log('#1 ********************')
    Users
        .where({
            username: user.username
        })
        .fetch()
        .then(user => {
            console.log("users***: ", user.toJSON())
            // if(!user.username){
            user = user.toJSON()
            // }else
            done(null, user)
        })
        .catch(err => {
            console.log('err', err)
        })
})

passport.use(new LocalStrategy({
    usernameField: 'username'
}, (username, password, done) => {
    console.log("passport auth: ", password)
    Users
        .where({
            username
        })
        .fetch()
        .then(user => {
            user = user.toJSON()
            // console.log("what's the user password? ", user.password)
            bcrypt.compare(password, user.password)
                .then(res => {
                    if (res) {
                        done(null, user)
                    } else {
                        done(null, false)
                    }
                })
        })
        .catch(err => {
            done(null, false)
        })

}))

router.get('/logout', (req, res) => {
    req.logout()
    console.log("logged the user out")

    // res.send("user has been logged out")
    res.redirect('/')
})

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login'
}), (req, res) => {
    console.log("check login", passport.authenticate)
    let user = {}
    // user.username = req.body.username;
    // user.isAuthenticated = true;
    console.log('Post working')
    res.redirect('/')
})

router.post('/register', (req, res, done) => {
    const {
        username,
        password
    } = req.body
    console.log("trying to create a new user***** ", username)
    // let salt = bcrypt.genSalt(12)
    Users
        .where({
            username
        })
        .fetch()
        .then(results => {
            console.log("RESULTS************: ", results)
            // const userResults = results.toJSON()
            // console.log("RESULTS!!: ", userResults)
            if (results) {
                console.log("****************username exists********")
                res.redirect('/failedreg')
                done(null, false)
            } else {
                // console.log('Salt', salt)
                console.log("PASSSSSSSSSS: ", password)
                bcrypt.hash(password, 12, (err, hash) => {
                    console.log("HASSSHHHHHHHHHHHH: ", hash)
                    return Users
                        .forge({
                            username,
                            password: hash
                        })
                        .save()
                        .then(user => {
                            user = user.toJSON
                            res.redirect('/login')
                            // res.json(user)

                        })
                })
                // .then( salt => { 
                //     // console.log('Salt', salt)
                //     return bcrypt.hash(password, salt)
                // })
                // .then( hash => {
                //     console.log('Hash', hash)
                //     return Users
                //     .forge({username, password: hash})
                //     .save()
                // })

            }


        })
        // .then( salt => { 
        //     // console.log('Salt', salt)
        //     return bcrypt.hash(password, salt)
        // })
        // .then( hash => {
        //     console.log('Hash', hash)
        //     return Users
        //     .forge({username, password: hash})
        //     .save()
        // })
        // .then( user => {
        //     user = user.toJSON
        //     res.redirect('/login')
        //     // res.json(user)

        // })
        .catch(err => {
            console.log('Err', err)
            res.json(err)
        })
})

function checkAuth(req, res, done){
    if (req.isAuthenticated()) {
        let isAuthed = true
    } else {
        let notAuthed = true
    }
}


module.exports = router;