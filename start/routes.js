'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/','HomeController.authCheck')
Route.post('/register', 'UserController.register')
Route.post('/login', 'UserController.login')
Route.post('/follow', 'UserController.follow')
Route.post('/unfollow', 'UserController.unfollow')

Route.post('/tweets/create', 'TweetController.create')
Route.get('/tweets/:id', 'TweetController.read')
Route.post('/tweets/delete', 'TweetController.delete')
Route.post('/tweets/like/', 'TweetController.like')
Route.post('/tweets/unlike/', 'TweetController.like')
Route.get('/tweets/likes/:id', 'TweetController.getLikes')
Route.get('/tweets/', 'TweetController.getAllTweets')

Route.get('/:username/followers', 'UserController.listFollowers')
Route.get('/:username/following', 'UserController.listFollowing')
Route.get('/:username/tweets', 'UserController.listTweets')
Route.get('/:username/likes', 'UserController.listLiked')
