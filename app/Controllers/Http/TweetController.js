'use strict'
const { validateAll } = use('Validator')

const Tweet = use('App/Models/Tweet')
const User = use('App/Models/User')

const TweetRules = {
  title: 'required|max:200',
  content: 'required|max:1000'
}

class TweetController {

    async create ({ request, response, auth}) {
        const data = request.all()

        const validation = await validateAll(request.all(), TweetRules)

        if (validation.fails()) {
            response.send(validation.messages())
        } else { 
            let tweet = new Tweet()
            tweet.title = data.title        
            tweet.content = data.content     
    
            try {
                const user = await auth.getUser().catch((error) => {
                    throw error
                })
                await user.tweets().create({
                    title : data.title,
                    content : data.content
                }).catch((error) => {
                    throw error
                })
                response.send(tweet)
            } catch (error) {
                response.send(error)
            }
        }
    }

    async read ({ request, response, auth, params}) {
        let id = params.id 
        try {
            let tweet = await Tweet.findByOrFail("id",id).catch((error) => {
                throw error
            })
            tweet['user_id'] = await tweet.user().fetch().catch((error) => {
                throw error
            })
            response.send(tweet)
        } catch (err) {
            response.send(err)
        }
    }
    
    async delete ({ request, response, auth, params}) { 
        let id = request.all().id
        const user = await auth.getUser()
        const exists = await user.tweets().where('id','=',id).fetch()
        if(exists) {
            try {
                await user.tweets().where('id','=',id).delete().catch((error) => {
                    throw error
                })
                response.send('Deleted Successfully.')
            } catch (error) {
                response.send(error)
            }
        } else {
            throw Error("You do not own the tweet.")
        }
    }
    
    async like ({ request, response, auth, params}) { 
        let id = request.all().id
        try {
            const user = await auth.getUser()
            let tweet = await Tweet.findByOrFail('id',id)
            await tweet.likes().attach(user.id)
            response.send('Liked Successfully.')
        } catch (error) {
            response.send(error)
        }
    }

    async unlike ({ request, response, auth, params}) { 
        let id = request.all().id
        try {
            const user = await auth.getUser().catch((error) => {
                throw error
            })
            let tweet = await Tweet.findByOrFail('id',id).catch((error) => {
                throw error
            })
            if(tweet.id) {
                await tweet.likes().detach(user.id).catch((error) => {
                    throw error
                })
                response.send('Un-liked Successfully.')
            } else {
                throw Error("Tweet not found.")
            }
        } catch (error) {
            response.send(error)
        }
    }

    async getLikes ({ request, response, auth, params}) { 
        let id = params.id
        try {
            let tweet = await Tweet.findByOrFail('id',id).catch((error) => {
                throw error
            })
            let likes = await tweet.likes().fetch().catch((error) => {
                throw error
            })
            response.send(likes)
        } catch (error) {
            response.send(error)
        }
    }

    async getAllTweets ({ request, response, auth, params}) { 
        let tweets = await Tweet.all().catch((error) => {
            throw error
        })
        response.send(tweets)
    }

    async repost ({ request, response, auth, params}) { 
        let id = request.all().id
        const user = await auth.getUser()
        let tweet = await Tweet.findByOrFail('id',id)
        try {
            if(tweet.id) {
                let newTweet = await user.tweets().create({
                    title : tweet.title,
                    content : tweet.content
                })
                response.send(newTweet)
            } else {
                throw Error("Tweet not found.")
            }
        } catch (error) {
            response.send(error)
        }
    }
}

module.exports = TweetController


