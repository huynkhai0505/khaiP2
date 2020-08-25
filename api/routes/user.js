const express = require('express');

const router = express.Router();

const mongoose = require('mongoose'); 

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const User = require('../models/user');

router.get('/userinfo', (req, res, next) => {
    User.find()
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            email: docs.map(doc => {
                return {
                    email: doc.email,
                    _id: doc._id
                }
            })
        }
        res.status(500).json({response});
    })
    .catch(err => {
        res.status(500).json({error: err});
    });
});

router.post('/login', (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if (user.length < 1) {
            return res.status(401).json({
                message: "Auth failed"
            });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            } 
            if (result) {
                const token = jwt.sign({
                    email: user[0].email,
                    userId: user[0]._id                
                },
                process.env.JWT_KEY,
                {
                    expiresIn: "1h"
                },
                );
                return res.status(200).json({
                    message: "Auth successfully",
                    token: token
                });  
            }
        });
    })
    .catch(err => {
        res.status(500).json({error: err});
    });
});

router.post('/signup', ( req , res, next ) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if (user.length >= 1) {
            return res.status(409).json({
                message: "Email has already existed, choose another email"
            });
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const user = new User ({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    }); 
                    user.save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: "User created",
                            createUser: {
                                _id: result._id,
                                email: result.email,
                                password: hash
                            }
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({error: err});
                    });
                }
            });
        }
    }) 
});

router.delete('/:userId', (req, res, mext) => {
    User.remove({userId: req.params.userId})
    .exec()
    .then(result => {
        res.status(200).json({
            message: "Email deleted"
        });
    })
    .catch(err => {
        res.status(500).json({error: err});
    })
});

module.exports = router;