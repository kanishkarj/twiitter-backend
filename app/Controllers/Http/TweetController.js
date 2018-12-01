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
                await user.tweets().create({
                    title : data.title,
                    content : data.content
                });
        } catch (error) {
            response.send("error");
        }
        
    }

    async read ({ request, response, auth, params}) {
        let id = params.id; 
        try {
            let tweet = await Tweet.findBy("id",id);
            tweet['user_id'] = await tweet.user().fetch();
            response.send(tweet);
        } catch (err) {
            response.send(err);
        }
    }
    
    async delete ({ request, response, auth, params}) { 
        let id = request.all().id;
        try {
            const user = await auth.getUser();
            try {
                await user.tweets().where('id','=',id).delete();
                response.send('Deleted Successfully.');
            } catch (error) {
                response.send(error);
            }
        } catch (error) {
            response.send(error);
        }
    }
    
    async like ({ request, response, auth, params}) { 
        let id = request.all().id;
        try {
            const user = await auth.getUser();
            let tweet = await Tweet.findBy('id',id);
            await tweet.likes().attach(user.id);
            response.send('Liked Successfully.');
        } catch (error) {
            response.send(error);
        }
    }

    async unlike ({ request, response, auth, params}) { 
        let id = request.all().id;
        try {
            const user = await auth.getUser();
            let tweet = await Tweet.findBy('id',id);
            await tweet.likes().detach(user.id);
            response.send('Un-liked Successfully.');
        } catch (error) {
            response.send(error);
        }
    }

    async getLikes ({ request, response, auth, params}) { 
        let id = params.id;
        try {
            let tweet = await Tweet.findBy('id',id);
            response.send(await tweet.likes().fetch());
        } catch (error) {
            response.send(error);
        }
    }

    async getAllTweets ({ request, response, auth, params}) { 
        return await Tweet.all();
    }
}

module.exports = TweetController


