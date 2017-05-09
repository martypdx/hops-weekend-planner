const Router = require('express').Router;
const router = Router();
const User = require('../models/user');

router.get('/', (req, res, next) => {
    User.find()
        .then(users => res.send(users))
        .catch(next);
})

    .put('/:id', (req, res, next) => {
        User.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .then(user => res.send(user))
            .catch(next);
    })

    .post('/', (req, res, next) => {
        new User(req.body)
            .save()
            .then(user => res.send(user))
            .catch(next);
    });



module.exports = router;