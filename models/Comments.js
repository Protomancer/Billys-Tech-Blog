const {Model, Datatypes} = require('sequelize');
const sequelize = require('../config/connection');
class Comments extends Model {}

Comments.init({
    id:{
        type: Datatypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    comments_text: {
        type: Datatypes.STRING,
        validate: {
            len:[3]
        }
    },
    users_id: {
        type: Datatypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users'
        }
    },
    users_id: {
        type: Datatypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    posts_id: {
        type: Datatypes.INTEGER,
        allowNull: false,
        references: {
            model: 'posts',
            key: 'id'
        }
    }
}, {
    sequelize,
    freezeTableName: true,
    modelName: 'comments'
});

module.exports = Comments;