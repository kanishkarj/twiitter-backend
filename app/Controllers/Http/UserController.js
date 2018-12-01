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
        const validation = await validate(request.all(), UserSignInrules).catch((error) => {
            throw error
        })

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
                response.send("Registration Successful.")
            } catch (error) {
                response.send(error)
            }
        }
    }

    async login ({ request, response, auth }) {
      const { username, password } = request.all()
      
      try {
            await auth.attempt(username, password).catch((error) => {
                throw error
            })
      } catch (error) {
            response.send(error.message           )
      }
      
      const user = await User.findByOrFail("username",username)
      response.send(await auth.generate(user))
    }

    async follow ({ request, response, auth, params }) {
        const currentUser = await auth.getUser().catch((error) => {
            throw error
        })
        const toFollowUser = await User.findByOrFail("username",request.all().username).catch((error) => {
            throw error
        })

        if(toFollowUser == null) {
            throw Error("Username not found.")
        }

        const exists =  await currentUser.following().where("username",toFollowUser.username).fetch().catch((error) => {
            throw error
        })

        if(exists.rows.length == 0) {
            try {
                await currentUser.following().attach(toFollowUser.id).catch((error) => {
                    throw error
                })
                response.send("Successfully Added to Following List.")
            } catch(error) {
                response.send(error)
            }
        } else {
            throw Error("Already Exists.")
        }

    }

    async unfollow ({ request, response, auth, params }) {
        const currentUser = await auth.getUser().catch((error) => {
            throw error
        })
        const toFollowUser = await User.findByOrFail("username",request.all().username).catch((error) => {
            throw error
        })

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
                    await currentUser.following().detach(toFollowUser.id).catch((error) => {
                        throw error
                    })
                    response.send("Successfully Removed from the Following List.")
                } catch(error) {
                    response.send(error)
                }
        }
    }

    async listFollowers ({ request, response, auth, params }) {
        let username = params.username
        try {
            let user = await User.findByOrFail('username',username).catch((error) => {
                throw error
            })
            let following = await user.following().where("user_id",user.id).fetch().catch((error) => {
                throw error
            })
            response.send(following)
        } catch (error) {
            response.send(error)
        }
    }
    
    async listFollowing ({ request, response, auth, params }) {
        let username = params.username
        try {
            let user = await User.findByOrFail('username',username).catch((error) => {
                throw error
            })
            let following = await user.following().fetch().catch((error) => {
                throw error
            })
            response.send(following)
        } catch (error) {
            response.send(error)
        }
    }

    async listTweets ({ request, response, auth, params }) {
        let username = params.username 
        try {
            let user = await User.findByOrFail('username',username).catch((error) => {
                throw error
            })
            let tweets = await user.tweets().fetch().catch((error) => {
                throw error
            })
            response.send(tweets)
        } catch (error) {
            response.send(error)
        }
    }
    
    async listLiked ({ request, response, auth, params }) {
        let username = params.username 
        try {
            let user = await User.findByOrFail('username',username).catch((error) => {
                throw error
            })
            let liked = await user.liked().fetch().catch((error) => {
                throw error
            })
            response.send(liked)
        } catch (error) {
            response.send(error)
        }
    }
}

module.exports = UserController
