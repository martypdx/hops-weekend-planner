const Router = require('express').Router;
const router = Router();
const Song = require('../models/song');

router.get('/', (req, res, next) => {
    Song.find()
        .then(songs => res.send(songs))
        .catch(next);
})

.put('/:id', (req, res, next) => {
    Song.findByIdAndUpdate(req.params.id, req.body, { new:true })
    .then(song => res.send(song))
    .catch(next);
});



module.exports = router;