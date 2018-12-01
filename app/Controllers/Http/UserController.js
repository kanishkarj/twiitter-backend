'use strict'
const { validate } = use('Validator')

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
        const validation = await validate(request.all(), UserSignInrules)

        if (validation.fails()) {
            response.send(validation.messages())
        } else {
            try {
                user.email = data.email
                user.username = data.username
                user.password = data.password
                await user.save()
                response.send("Registration Successful.")
            } catch (error) {
                response.send(error)
            }
        }
    }

    async login ({ request, response, auth }) {
      const { username, password } = request.all()
      
      try {
            await auth.attempt(username, password)
      } catch (error) {
            response.send(error.message           )
      }
      
      const user = await User.findByOrFail("username",username)
      response.send(await auth.generate(user))
    }

    async follow ({ request, response, auth, params }) {
        const currentUser = await auth.getUser()
        const toFollowUser = await User.findByOrFail("username",request.all().username)

        if(toFollowUser == null) {
            response.send("Username not found.")
        }

        const exists =  await currentUser.following().where("username",toFollowUser.username).fetch()

        if(exists.rows.length == 0) {
            try {
                await currentUser.following().attach(toFollowUser.id)
                response.send("Successfully Added to Following List.")
            } catch(error) {
                response.send(error)
            }
        } else {
            response.send("Already Exists.")
        }

    }

    async unfollow ({ request, response, auth, params }) {
        const currentUser = await auth.getUser()
        const toFollowUser = await User.findByOrFail("username",request.all().username)

        if(toFollowUser == null) {
            response.send("Username not found.")
        }

        const exists =  await currentUser.following().where("username",toFollowUser.username).fetch()

        if(exists.rows.length == 0) {
            response.send("Not following.")
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
        let username = params.username;
        try {
            let user = await User.findByOrFail('username',username)
            response.send(await user.following().where("user_id",user.id).fetch())
        } catch (error) {
            response.send(error)
        }
    }
    
    async listFollowing ({ request, response, auth, params }) {
        let username = params.username;
        try {
            let user = await User.findByOrFail('username',username)
            response.send(await user.following().fetch())
        } catch (error) {
            response.send(error)
        }
    }

    async listTweets ({ request, response, auth, params }) {
        let username = params.username 
        try {
            let user = await User.findByOrFail('username',username)
            response.send(await user.tweets().fetch())
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
