'use strict'

const Comment = use('App/Models/Comment')
const Tweet = use('App/Models/Tweet')

class CommentController {
    
    async getAll ({ request, response, auth, params }) {
        try {
           let id = params.id;
           let tweet = await Tweet.findBy('id',id)
           response.send(await tweet.comments().fetch())
        } catch (error) {
           response.send(error); 
        } 
    }

    async getOwner ({ request, response, auth, params }) {
        try {
            let id = params.id;
            let comment = await Comment.findBy('id',id)
            response.send(await comment.owner().fetch())
         } catch (error) {
            response.send(error); 
         }
    }
    
    async getParentTweet ({ request, response, auth, params }) {
        try {
            let id = params.id;
            let comment = await Comment.findBy('id',id)
            response.send(await comment.parentTweet().fetch())
         } catch (error) {
            response.send(error); 
         }
    }

    async createCommentHead ({ request, response, auth, params }) {
        let data = request.body;
        let comment = new Comment();
        
        try {
            let user = await auth.getUser();
            let tweet = await Tweet.findBy('id',data.tweetId)
            if(tweet.id) {
                comment['user_id'] = user.id;
                comment['content'] = data.content;
                response.send(await tweet.comments().create({
                    'user_id' : user.id,
                    'content' : data.content
                }));
            } else {
                response.send("Tweet not Found.");
            }
        } catch (error) {
            response.send(error);            
        }

    }

}

module.exports = CommentController
