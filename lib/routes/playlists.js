const Router = require('express').Router;
const router = Router();
const Playlist = require('../models/playlist');

router.get('/', (req, res, next) => {
    Playlist.find()
        .then(playlists => res.send(playlists))
        .catch(next);
})

.put('/:id', (req, res, next) => {
    Playlist.findByIdAndUpdate(req.params.id, req.body, { new:true })
    .then(playlist => res.send(playlist))
    .catch(next);
});



module.exports = router;