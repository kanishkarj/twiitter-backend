'use strict'

const Comment = use('App/Models/Comment')
const Tweet = use('App/Models/Tweet')

class CommentController {
    
    async getAll ({ request, response, auth, params }) {
         try {
            response.send(await Comment.findByOrFail('tweet_id',params.id));
         } catch (error) {
            response.send(error); 
         }
    }

    async createCommentHead ({ request, response, auth, params }) {
        let data = request.body;
        let comment = new Comment();
        
        try {
            let user = await auth.getUser();
            let tweet = await Tweet.findByOrFail('id',data.tweetId)
            if(tweet.id) {
                comment['user_id'] = user.id;
                comment['content'] = data.content;
                comment['tweet_id'] = tweet.id;
                await comment.save();
                response.send("Commented Successfully.");
            } else {
                response.send("Tweet not Found.");
            }
        } catch (error) {
            response.send(error);            
        }

    }

}

module.exports = CommentController
