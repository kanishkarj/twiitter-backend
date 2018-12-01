'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

const User = use('App/Models/User');

class Tweet extends Model {
    user() {
        return this.belongsTo('App/Models/User');
    }
    likes() {
        return this.belongsToMany('App/Models/User',"tweet_id","user_id").pivotTable('likes');
    }
}

module.exports = Tweet
