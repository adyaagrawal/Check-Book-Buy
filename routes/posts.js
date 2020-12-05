var express = require('express');
var router = express.Router();
var Post = require('../models/posts');

router.get('/posts',isLoggedIn, )

router.get('/posts',isLoggedIn, function (req, res) {
    Post.find({}, function (err, post) {
        if (err) {
            console.log(err);
        } else {
            res.render('posts/blog', { posts: post, currentUser: req.user });
        }
    });
});

router.get('/posts/new', isLoggedIn, function (req, res) {
    res.render('posts/new', { currentUser: req.user })
});

router.post('/posts', isLoggedIn, function (req, res) {
    var item = req.body.post.item;
    var quantity = req.body.post.quantity;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newPost = { item: item, quantity: quantity,  author: author }
    Post.create(newPost, function (err, post) {
        if (err) {
            console.log(err);
        } else {
            console.log(post);
        }
    });
    res.redirect('/posts');
});

router.get('/posts/:id', function (req, res) {
    Post.findById(req.params.id).exec(function (err, foundpost) {
        if (err) {
            console.log(err);
        } else {
            res.render('posts/post', { post: foundpost })
        }
    })
});

router.delete('/posts/:id', checkOwner, function (req, res) {
    Post.findByIdAndDelete(req.params.id, function (err, foundpost) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/posts')
        }
    })
});

router.get('/posts/:id/edit', checkOwner, function (req, res) {
    Post.findById(req.params.id, function (err, foundpost) {
        if (err) {
            console.log(err);
        } else {
            res.render('posts/edit', { post: foundpost })
        }
    })
});

router.put('/posts/:id/', checkOwner, function (req, res) {
    var item = req.body.post.item;
    var quantity = req.body.post.quantity;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newPost = { item: item, quantity: quantity, author: author }
    Post.findByIdAndUpdate(req.params.id, newPost, function (err, updatedpost) {
        if (err) {
            console.log(err);
        } else {
            console.log(updatedpost)
            res.redirect('/posts/')
        }
    })
});



//middlewares

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to log in first")
    res.redirect('/login');
}

function checkOwner(req, res, next) {
    if (req.isAuthenticated()) {
        Post.findById(req.params.id, function (err, foundPost) {
            if (err) {
                res.redirect('back')
            } else {
                if (foundPost.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect('back')
                }
            }
        });
    } else {
        res.redirect('back');
    }
}


module.exports = router;