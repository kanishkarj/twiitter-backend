'use strict'
const { validateAll } = use('Validator')

const Comment = use('App/Models/Comment')
const Tweet = use('App/Models/Tweet')

const CommentRules = {
  content: 'required|max:500'
}
  
class CommentController {

    async getAll ({ request, response, auth, params }) {
        let id = params.id
        try {
            let tweet = await Tweet.findBy('id',id)
            let comments = await tweet.comments().fetch()
            response.send(comments)
        } catch (error) {
            response.send(error) 
        } 
    }

    async getOwner ({ request, response, auth, params }) {
        try {
            let id = params.id
            let comment = await Comment.findBy('id',id)
            let owner = await comment.owner().fetch()
            response.send(owner)
         } catch (error) {
            response.send(error) 
         }
    }
    
    async getParentTweet ({ request, response, auth, params }) {
        try {
            let id = params.id
            let comment = await Comment.findBy('id',id)
            let parentTweet = await comment.parentTweet().fetch()
            response.send(parentTweet)
         } catch (error) {
            response.send(error) 
         }
    }

    async createCommentHead ({ request, response, auth, params }) {
        let data = request.body
        let comment = new Comment()
        const validation = await validateAll(request.all(), CommentRules)
        
        try {
            if (validation.fails()) {
                response.send(validation.messages())
            } else {
            let user = await auth.getUser()
            let tweet = await Tweet.findBy('id',data.tweetId)
            if(tweet.id) {
                comment['user_id'] = user.id
                comment['content'] = data.content
                let comments = await tweet.comments().create({
                    'user_id' : user.id,
                    'content' : data.content
                })
                response.send(comments)
            } else {
                throw Error("Tweet not found.")
            }
        }
        } catch (error) {
            response.send(error)            
        }

    }

}

module.exports = CommentController
