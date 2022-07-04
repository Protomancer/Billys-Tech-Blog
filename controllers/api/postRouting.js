const router = require('express').Router();
const { Posts, Users, Comments } = require('../../models');
const sequelize = require('../../config/connection');
const withAuth = require('../../utils/auth');

router.get('/', (req, res) => {
    console.log('======================');
    Posts.findAll({
            attributes: ['id',
                'post_title',
                'post_contents',
                'posted_at'
            ],
            order: [
                ['posted_at', 'DESC']
            ],
            include: [{
                    model: Users,
                    attributes: ['users_name']
                },
                {
                    model: Comments,
                    attributes: ['id', 'comments_text', 'posts_id', 'users_id', 'posted_at'],
                    include: {
                        model: Users,
                        attributes: ['users_name']
                    }
                }
            ]
        })
        .then(postDbData => res.json(postDbData.reverse()))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });

});
router.get('/:id', (req, res) => {
    Posts.findOne({
            where: {
                id: req.params.id
            },
            attributes: ['id',
                'post_contents',
                'post_title',
                'posted_at'
            ],
            include: [{
                    model: Users,
                    attributes: ['users_name']
                },
                {
                    model: Comments,
                    attributes: ['id', 'comments_text', 'posts_id', 'users_id', 'posted_at'],
                    include: {
                        model: Users,
                        attributes: ['users_name']
                    }
                }
            ]
        })
        .then(postDbData => {
            if (!postDbData) {
                res.status(404).json({ message: 'Invalid Post ID' });
                return;
            }
            res.json(postDbData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.post('/', withAuth, (req, res) => {
    Posts.create({
            post_title: req.body.post_title,
            post_contents: req.body.post_contents,
            users_id: req.session.users_id
        })
        .then(postDbData => res.json(postDbData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.put('/:id', withAuth, (req, res) => {
    Posts.update({
            post_title: req.body.post_title,
            post_contents: req.body.post_contents
        }, {
            where: {
                id: req.params.id
            }
        }).then(postDbData => {
            if (!postDbData) {
                res.status(404).json({ message: 'Invalid Post ID' });
                return;
            }
            res.json(postDbData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});
router.delete('/:id', withAuth, (req, res) => {
    Posts.destroy({
        where: {
            id: req.params.id
        }
    }).then(postDbData => {
        if (!postDbData) {
            res.status(404).json({ message: 'Invalid Post ID' });
            return;
        }
        res.json(postDbData);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;