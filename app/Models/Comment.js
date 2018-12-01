'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Comment extends Model {
    owner() {
        return this.belongsTo('App/Models/User','user_id','id')
    }
    parentTweet() {
        return this.belongsTo('App/Models/Tweet','tweet_id','id')
    }
}

module.exports = Comment
