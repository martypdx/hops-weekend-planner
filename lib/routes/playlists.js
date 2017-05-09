const Router = require('express').Router;
const router = Router();
const Playlist = require('../models/playlist');

router.get('/', (req, res, next) => {
    Playlist.find()
        .lean()
        .select('-__v')
        .then(playlists => res.send(playlists))
        .catch(next);
})

    .get('/:id', (req, res, next) => {
        const id = req.params.id;
        Playlist.findById(id).lean()
            .then(playlist => {
                if (!playlist) res.status(404).send(`${id} not found`);
                else res.send(playlist);
            })
            .catch(next);
    })

    .post('/', (req, res, next) => {
        console.log('req.body:', req.body);
        new Playlist(req.body)
            .save()
            .then(playlist => res.send(playlist))
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        Playlist.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .then(playlist => res.send(playlist))
            .catch(next);
    })

    .delete('/:id', (req, res, next) => { 
        Playlist.findByIdAndRemove(req.params.id)
            .then(response => {
                res.send({ removed: response ? true : false });
            })
            .catch(next);
    });


module.exports = router;