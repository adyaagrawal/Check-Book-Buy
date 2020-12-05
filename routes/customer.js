var express = require('express');
var router = express.Router();
var passport = require('passport');
var Customer = require('../models/customers')
var User = require('../models/users')
var Post = require('../models/posts');
const users = require('../models/users');
const pool = require('../db.js')

router.get('/customer/register', function (req, res) {
    res.render('customer/register');
});


router.get('/customer/dashboard', function (req, res) {
    res.render('customer/customer')
});


router.get('/customer/view', function (req, res) {
    Post.find({}, function (err, post) {
        User.find({}, function (err, user) {
            if (err) {
                console.log(err);
            } else {
                res.render('customer/view', { posts: post, users: user });
            }
        });
    });
});


router.get('/customer/slot', function (req, res) {
    User.find({}, function (err, user) {
        if (err) {
            console.log(err);
        } else {
            res.render('customer/slot', { users: user });
        }
    });
});

router.get('/customer/slot', function (req, res) {
    User.find({}, function (err, user) {
        if (err) {
            console.log(err);
        } else {
            res.render('customer/slot', { users: user });
        }
    });
});

router.post('/customer/slot', function (req, res) {
    User.find({}, function (err, users) {
        users.forEach(function (user) {
            if (req.body.shop == user.name) {
                console.log(user)
                res.render('customer/slot_book', {user : user} )
            }
        })
    })
})

router.post('/customer/slot_book', function (req, res) {
    User.find({}, function (err, users) {
        users.forEach(function (user) {
            if (req.body.shop == user.name) {
                if (req.body.slot == 1) {
                    user.slot1 = 0
                }
                else if (req.body.slot == 2) {
                    user.slot2 = 0
                }
                else if (req.body.slot == 3) {
                    user.slot3 = 0
                }
                else if (req.body.slot == 4) {
                    user.slot4 = 0
                }
                else if (req.body.slot == 5) {
                    user.slot5 = 0
                }
                else if (req.body.slot == 6) {
                    user.slot6 = 0
                }
                User.findByIdAndUpdate(user._id, user, function (err, updatedpost) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.redirect('/customer/dashboard')
                    }
                })
                console.log("Slot Booked")
            }
        });
    })
})



router.post('/customer/register', async (req, res) => {
    try {
        var username = req.body.username;
        var password = req.body.password;
        const item = await pool.query("SELECT * FROM customer WHERE username =$1", [username]);
        if(item.rowCount>0){
            res.redirect('/customer/register');
        }
        else{
            const newCust = await pool.query("INSERT INTO  customer (username, password) VALUES ($1,$2) RETURNING *", [username, password]);
            console.log(newCust.rows[0]);
            res.redirect('/customer/dashboard');
        }
    } catch(err){
        console.error(err.message)
    }
});


router.get('/customer/login', function (req, res) {
    res.render('customer/login');
})


router.post('/customer/login', async(req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    try{
        const item = await pool.query("SELECT * FROM customer WHERE username =$1 AND password =$2", [username, password]);
        if(item.rowCount>0){
            res.redirect('/customer/dashboard')
        }
        else{
            res.redirect('/customer/login')
        }
        
    } catch(err){
        console.error(err.message);
    }
})



router.get('/logout', function (req, res) {
    req.logout();
    req.flash("success", "Logged Out Successfully")
    res.redirect('/');
});


module.exports = router