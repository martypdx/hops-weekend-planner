const Router = require('express').Router;
const router = Router();
const Song = require('../models/song');

router.get('/', (req, res, next) => {
    Song.find()
        .lean()
        .select('-__v')
        .then(songs => res.send(songs))
        .catch(next);
})

    .get('/:id', (req, res, next) => {
        const id = req.params.id;
        Song.findById(id).lean()
            .then(song => res.send(song))
            .catch(next);
    })

    .post('/', (req, res, next) => {
        new Song(req.body)
            .save()
            .then(song => res.send(song))
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        Song.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .then(song => res.send(song))
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        Song.findByIdAndRemove(req.params.id)
            .then(response => {
                res.send({ removed: response ? true : false });
            })
            .catch(next);
    });


module.exports = router;