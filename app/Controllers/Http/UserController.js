'use strict'

const User = require('../../Models/User');

class UserController {
    async register ({ request, response }) {
        let data = request.body;
        let user = new User(data);
        
        user.username = data.username;
        user.email = data.email;
        user.password = data.password;
        
        try {
            await user.save();
        } catch (error) {
            response.send(error);
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
    //   return 'Logged in successfully'
    }
}

module.exports = UserController
