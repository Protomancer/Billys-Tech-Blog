const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');

class Posts extends Model {}

Posts.init(
    {
        id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
        },
        post_title: {
        type: DataTypes.STRING,
        allowNull: false
        },
        post_contents: {
        type: DataTypes.STRING,
        allowNull: false
        },
        users_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key:'id'
            }
        }  
    },
    {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'posts'
    }
);

module.exports = Posts;