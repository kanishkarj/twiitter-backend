'use strict'
const { validate } = use('Validator')
const User = require('../../Models/User');

const UserSignInrules = {
  email: 'required|email|unique:users',
  username: 'required|unique:users',
  password: 'required|min:8|max:30'
}

class UserController {
    async register ({ request, response }) {
        let user = new User();
        const data = request.all();
        const validation = await validate(request.all(), UserSignInrules)

        if (validation.fails()) {
            return validation.messages();
        } else {
            try {
                user.email = data.email;
                user.username = data.username;
                user.password = data.password;
                await user.save();
                response.send("Registration Successful.")
            } catch (error) {
                response.send(error);
            }
        }
    }

    async login ({ request, auth }) {
      const { username, password } = request.all()
      
      try {
            await auth.attempt(username, password)
      } catch (error) {
            return error.message;           
      }
      
      const user = await User.findBy("username",username);
      return await auth.generate(user);
    }

    async follow ({ request, auth, params }) {
        const currentUser = await auth.getUser();
        const toFollowUser = await User.findBy("username",request.all().username);

        if(toFollowUser == null) {
            return "Username not found."
        }

        const exists =  await currentUser.following().where("username",toFollowUser.username).fetch()

        if(exists.rows.length == 0) {
            try {
                await currentUser.following().attach(toFollowUser.id);
                return "Successfully Added to Following List."
            } catch(error) {
                response.send(error)
            }
        } else {
            return "Already Exists."
        }

    }

    async unfollow ({ request, auth, params }) {
        const currentUser = await auth.getUser();
        const toFollowUser = await User.findBy("username",request.all().username);

        if(toFollowUser == null) {
            return "Username not found."
        }

        const exists =  await currentUser.following().where("username",toFollowUser.username).fetch()

        if(exists.rows.length == 0) {
            return "Not following."
        } else {
                try {
                    await currentUser.following().detach(toFollowUser.id);
                    return "Successfully Removed from the Following List."
                } catch(error) {
                    response.send(error)
                }
        }
    }
}

module.exports = UserController
