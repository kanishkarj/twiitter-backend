'use strict'

class User {
  get rules () {
    return {
      email: 'required|email|unique:users',
      username: 'required|username|unique:users',
      password: 'required|min:8|max:30'
    }
  }
}

module.exports = User
