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
}

module.exports = UserController
