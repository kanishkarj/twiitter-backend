'use strict'
const { validate } = use('Validator')

const Tweet = use('App/Models/Tweet');
const User = use('App/Models/User');

const TweetRules = {
  title: 'required|max200',
  content: 'required|max:1000'
}

class TweetController {

    async create ({ request, response, auth}) {
        const data = request.all();

        const validation = await validate(request.all(), TweetRules)

        if (validation.fails()) {
            return validation.messages();
        } else { 
            let tweet = new Tweet();
            tweet.title = data.title;        
            tweet.content = data.content;     
    
            try {
                const user = await auth.getUser();
                await user.tweets().create({
                    title : data.title,
                    content : data.content
                });
                response.send("Tweeted Successfully.")
            } catch (error) {
                response.send("error");
            }
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
            const exists = await user.tweets().where('id','=',id);
            if(exists.row.length == 0) {
                response.send('You do not own the tweet.');
            } else {
                await user.tweets().where('id','=',id).delete();
                response.send('Deleted Successfully.');
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
            if("id" in tweet) {
                await tweet.likes().attach(user.id);
                response.send('Liked Successfully.');
            } else {
                response.send('Tweet not found.');                
            }
        } catch (error) {
            response.send(error);
        }
    }

    async unlike ({ request, response, auth, params}) { 
        let id = request.all().id;
        try {
            const user = await auth.getUser();
            let tweet = await Tweet.findBy('id',id);
            if("id" in tweet) {
                await tweet.likes().detach(user.id);
                response.send('Un-liked Successfully.');
            } else {
                response.send('Tweet not found.');                
            }
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

    async repost ({ request, response, auth, params}) { 
        let id = request.all().id;
        try {
            const user = await auth.getUser();
            let tweet = await Tweet.findBy('id',id);
            if("id" in tweet) {
                await user.tweets().create({
                    title : tweet.title,
                    content : tweet.content
                });
                response.send('Re-posted Successfully.');
            } else {
                response.send('Tweet not found.');                
            }
        } catch (error) {
            response.send(error);
        }
    }
}

module.exports = TweetController


