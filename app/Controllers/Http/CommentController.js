'use strict'

const Comment = use('App/Models/Comment')
const Tweet = use('App/Models/Tweet')

class CommentController {
    
    async getAll ({ request, response, auth, params }) {
        try {
            let id = params.id
            let tweet = await Tweet.findBy('id',id).catch((error) => {
                throw error
            })
            let comments = await tweet.comments().fetch().catch((error) => {
                throw error
            })
            response.send(comments)
        } catch (error) {
           response.error(error) 
        } 
    }

    async getOwner ({ request, response, auth, params }) {
        try {
            let id = params.id
            let comment = await Comment.findBy('id',id).catch((error) => {
                throw error
            })
            let owner = await comment.owner().fetch().catch((error) => {
                throw error
            })
            response.send(owner)
         } catch (error) {
            response.send(error) 
         }
    }
    
    async getParentTweet ({ request, response, auth, params }) {
        try {
            let id = params.id
            let comment = await Comment.findBy('id',id).catch((error) => {
                throw error
            })
            let parentTweet = await comment.parentTweet().fetch().findBy('id',id).catch((error) => {
                throw error
            })
            response.send(parentTweet)
         } catch (error) {
            response.send(error) 
         }
    }

    async createCommentHead ({ request, response, auth, params }) {
        let data = request.body
        let comment = new Comment()
        
        try {
            let user = await auth.getUser().catch((error) => {
                throw error
            })
            let tweet = await Tweet.findBy('id',data.tweetId).catch((error) => {
                throw error
            })
            if(tweet.id) {
                comment['user_id'] = user.id
                comment['content'] = data.content
                let comments = await tweet.comments().create({
                    'user_id' : user.id,
                    'content' : data.content
                }).catch((error) => {
                    throw error
                })
                response.send(comments)
            } else {
                throw Error("Tweet not found.")
            }
        } catch (error) {
            response.send(error)            
        }

    }

}

module.exports = CommentController
