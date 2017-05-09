const Router = require('express').Router;
const router = Router();
const User = require('../models/user');

// function getSpotifyInfo() {
//     ('auth/signup')
//     return request.get('/spotify/login')
//     ('spotify/callback')
//     spotifyid
//     spotifytoken
//     res.send()
// };

router.get('/', (req, res, next) => {
    User.find()
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

    .put('/:id', (req, res, next) => {
        User.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .then(user => {
                res.send(user);
            })
            .catch(next);
    })

    .patch('/:id', (req, res, next) => {
        User.findById(req.params.id)
            .select('playlist')
            .populate({
                path: 'playlist',
                select: 'songs.title'
            })
            .then(user => {
                res.send(user);
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