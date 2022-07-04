const router = require('express').Router();
const { Comments } = require('../../models');
const withAuth = require('../../utils/auth');
router.get('/', (req, res) => {
    Comments.findAll({})
        .then(commentDbData => res.json(commentDbData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
});

router.get('/:id', (req, res) => {
    Comments.findAll({
            where: {
                id: req.params.id
            }
        })
        .then(commentDbData => res.json(commentDbData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
});

router.post('/', withAuth, (req, res) => {
    if (req.session) {
        Comments.create({
                comments_text: req.body.comments_text,
                posts_id: req.body.posts_id,
                users_id: req.session.users_id,
            })
            .then(commentDbData => res.json(commentDbData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            })
    }
});

router.put('/:id', withAuth, (req, res) => {
    Comments.update({
        comments_text: req.body.comments_text
    }, {
        where: {
            id: req.params.id
        }
    }).then(commentDbData => {
        if (!commentDbData) {
            res.status(404).json({ message: 'Invalid Comment ID' });
            return;
        }
        res.json(commentDbData);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.delete('/:id', withAuth, (req, res) => {
    Comments.destroy({
        where: {
            id: req.params.id
        }
    }).then(commentDbData => {
        if (!commentDbData) {
            res.status(404).json({ message: 'Invalid Comment ID' });
            return;
        }
        res.json(commentDbData);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});
module.exports = router;