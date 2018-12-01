'use strict'

const Tweet = use('App/Models/Tweet');
const User = use('App/Models/User');

class TweetController {
    async create ({ request, response, auth}) {
        const data = request.all();

        let tweet = new Tweet();
        tweet.title = data.title;        
        tweet.content = data.content;     

        try {
            const user = await auth.getUser();
            try {
                await user.tweets().create({
                    title : data.title,
                    content : data.content
                });
                // return
            } catch (error) {
                response.send("error");
            }
        } catch (error) {
            response.send("error");
        }
        
    }

    async read ({ request, response, auth, params}) {
        let id = params.id; 
        try {
            let tweet = await Tweet.findBy("id",id);
            tweet['user_id'] = await tweet.user().fetch();
            return tweet;
        } catch (err) {
            return err;
        }
    }
    
    async delete ({ request, response, auth, params}) { 
        let id = request.all().id;
        try {
            const user = await auth.getUser();
            try {
                await user.tweets().where('id','=',id).delete();
                return 'Deleted Successfully.';
            } catch (error) {
                response.send(error);
            }
        } catch (error) {
            response.send(error);
        }
    }
    
}

module.exports = TweetController


