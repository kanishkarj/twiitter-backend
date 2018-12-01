'use strict'
const Database = use('Database')
const TweetDB = Database.table('tweets')

const Tweet = require('../../Models/Tweet');

class TweetController {
    async create ({ request, response, auth}) {
        const data = request.all();

        let tweet = new Tweet();
        tweet.title = data.title;        
        tweet.content = data.content;     

        try {
            const user = await auth.getUser();
            try {
                return await user.tweets().create({
                    title : data.title,
                    content : data.content
                });
            } catch (error) {
                response.send(error);
            }
        } catch (error) {
            response.send(error);
        }
        
    }

    async read ({ request, response, auth, params}) {
        let id = params.id; 
        try {
            return await TweetDB.where('id','=',id);
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
