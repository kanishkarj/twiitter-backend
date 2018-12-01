'use strict'

class HomeController {
    index ({ request, response }) {
        response.send("Home")
    }

    async authCheck ({ request, response, auth }) {
        try {
            return await auth.getUser()
        } catch (error) {
            response.send('Missing or invalid jwt token')
        }
    }
}

module.exports = HomeController
