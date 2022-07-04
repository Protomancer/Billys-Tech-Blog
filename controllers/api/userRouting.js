const router = require('express').Router();
const { Users, Posts, Comments } = require('../../models');
router.get('/', (req, res) => {
    Users.findAll({
            attributes: { exclude: ['[password'] }
        })
        .then(userDbData => res.json(userDbData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/:id', (req, res) => {
    Users.findOne({
            attributes: { exclude: ['password'] },
            where: {
                id: req.params.id
            },
            include: [{
                    model: Posts,
                    attributes: [
                        'id',
                        'post_title',
                        'post_contents',
                        'posted_at'
                    ]
                },

                {
                    model: Comments,
                    attributes: ['id', 'comment_text', 'posted_at'],
                    include: {
                        model: Posts,
                        attributes: ['post_title']
                    }
                },
                {
                    model: Posts,
                    attributes: ['post_title'],
                }
            ]
        })
        .then(userDbData => {
            if (!userDbData) {
                res.status(404).json({ message: 'Invalid User ID' });
                return;
            }
            res.json(userDbData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});


router.post('/', (req, res) => {

    Users.create({
        users_name: req.body.users_name,
        users_password: req.body.users_password
    })

    .then(userDbData => {
            req.session.save(() => {
                req.session.user_id = userDbData.id;
                req.session.users_name = userDbData.users_name;
                req.session.loggedIn = true;

                res.json(userDbData);
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.post('/login', (req, res) => {
    Users.findOne({
            where: {
                users_name: req.body.users_name
            }
        }).then(userDbData => {
            if (!userDbData) {
                res.status(400).json({ message: 'No Users Found' });
                return;
            }
            const passwordValidation = userDbData.checkPassword(req.body.users_password);

            if (!passwordValidation) {
                res.status(400).json({ message: 'Password Invalid' });
                return;
            }
            req.session.save(() => {

                req.session.user_id = userDbData.id;
                req.session.users_name = userDbData.users_name;
                req.session.loggedIn = true;

                res.json({ user: userDbData, message: 'Logged In To System' });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

router.put('/:id', (req, res) => {

    Users.update(req.body, {
            individualHooks: true,
            where: {
                id: req.params.id
            }
        })
        .then(userDbData => {
            if (!userDbData[0]) {
                res.status(404).json({ message: 'Invalid User ID' });
                return;
            }
            res.json(userDbData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });

});

router.delete('/:id', (req, res) => {
    Users.destroy({
            where: {
                id: req.params.id
            }
        })
        .then(userDbData => {
            if (!userDbData) {
                res.status(404).json({ message: 'Invalid User ID' });
                return;
            }
            res.json(userDbData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;