const Users = require('./Users');
const Posts = require('./Posts');
const Comments = require('./Comments');



Users.hasMany(Posts, {
    foreignKey: 'users_id'
});

Posts.belongsTo(Users, {
    foreignKey: 'users_id',
    onDelete: 'cascade'
});

Comments.belongsTo(Users, {
    foreignKey: 'users_id',
    onDelete: 'cascade'
});

Comments.belongsTo(Posts, {
    foreignKey: 'posts_id',
    onDelete: 'cascade',
});

Users.hasMany(Comments, {
    foreignKey: 'users_id',
    onDelete: 'cascade'
});

Posts.hasMany(Comments, {
    foreignKey: 'posts_id',
    onDelete: 'cascade'
});

module.exports = { Users, Posts, Comments };