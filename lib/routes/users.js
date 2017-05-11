const Router = require('express').Router;
const router = Router();
const User = require('../models/user');
const Playlist = require('../models/playlist');


router.get('/', (req, res, next) => {
    User.find()
        .select('-__v')
        .then(users => res.send(users))
        .catch(next);
})

    .post('/', (req, res, next) => {
        new User(req.body)
            .save()
            .then(user => res.send(user))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        const id = req.params.id;
        User.findById(id)
            .then(user => {
                if (!user) res.status(404).send(`${id} not found`);
                else res.send(user);
            })
            .catch(next);
    })

    //this is used for adding friends, fave genres and fave artists
    .put('/:id', (req, res, next) => {
        User.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .then(user => {
                res.send(user);
            })
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        Promise.all([
            User.findById(req.params.id)
                .select('playlist')
                .populate({
                    path: 'Playlist',
                }),
            Playlist.findById(req.params.playlistId)
        ])
            .then(results => {
                const user = results[0];
                const playlist = results[1];
                user.push(playlist);
                // console.log('user', user, 'song', song);
                res.send(results);
            })
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        User.findByIdAndRemove(req.params.id)
            .then(response => {
                res.send({ removed: response ? true : false });
            })
            .catch(next);

    });

module.exports = router;