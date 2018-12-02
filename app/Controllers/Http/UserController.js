'use strict'
const { validateAll } = use('Validator')

const User = use('App/Models/User')

const UserSignInrules = {
  email: 'required|email|unique:users',
  username: 'required|unique:users',
  password: 'required|min:8|max:30'
}

class UserController {
    async register ({ request, response }) {
        let user = new User()
        const data = request.all()
        const validation = await validateAll(request.all(), UserSignInrules)

        if (validation.fails()) {
            response.send(validation.messages())
        } else {
            try {
                user.email = data.email
                user.username = data.username
                user.password = data.password
                await user.save().catch((error) => {
                    throw error
                })
                response.send(user)
            } catch (error) {
                response.send(error)
            }
        }
    }

    async login ({ request, response, auth }) {
      const { username, password } = request.all()
      
      try {
        await auth.attempt(username, password)
        const user = await User.findBy("username",username)
        let token = await auth.generate(user);
        response.send(token)
      } catch (error) {
            response.send(error)
      }
      
    }

    async follow ({ request, response, auth, params }) {
        const currentUser = await auth.getUser()
        const toFollowUser = await User.findBy("username",request.all().username)
        
        if(toFollowUser == null) {
            throw Error("Username not found.")
        }
        
        const exists = await currentUser.following().where("username",toFollowUser.username).fetch()
        
        if(exists.rows.length == 0) {
            try {
                await currentUser.following().attach(toFollowUser.id)
                response.send("Successfully Added to Following List.")
            } catch(error) {
                throw error
                // response.send(error)
            }
        } else {
            throw Error("Already Exists.")
        }

    }

    async unfollow ({ request, response, auth, params }) {
        const currentUser = await auth.getUser()
        const toFollowUser = await User.findByOrFail("username",request.all().username)

        if(toFollowUser == null) {
            throw Error("Username not found.")
        }

        const exists =  await currentUser.following().where("username",toFollowUser.username).fetch().catch((error) => {
            throw error
        })

        if(exists.rows.length == 0) {
            throw Error("Not following.")
        } else {
                try {
                    await currentUser.following().detach(toFollowUser.id)
                    response.send("Successfully Removed from the Following List.")
                } catch(error) {
                    response.send(error)
                }
        }
    }

    async listFollowers ({ request, response, auth, params }) {
        let username = params.username
        try {
            let user = await User.findBy('username',username)
            let followers = await user.followers().fetch()
            response.send(followers)
        } catch (error) {
            response.send(error)
        }
    }
    
    async listFollowing ({ request, response, auth, params }) {
        let username = params.username
        try {
            let user = await User.findBy('username',username)
            let following = await user.following().fetch()
            response.send(following)
        } catch (error) {
            response.send(error)
        }
    }

    async listTweets ({ request, response, auth, params }) {
        let username = params.username 
        try {
            let user = await User.findByOrFail('username',username)
            let tweets = await user.tweets().fetch()
            response.send(tweets)
        } catch (error) {
            response.send(error)
        }
    }
    
    async listLiked ({ request, response, auth, params }) {
        let username = params.username 
        try {
            let user = await User.findByOrFail('username',username)
            let liked = await user.liked().fetch()
            response.send(liked)
        } catch (error) {
            response.send(error)
        }
    }
}

module.exports = UserController
