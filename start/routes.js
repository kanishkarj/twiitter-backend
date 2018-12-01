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

Route.post('/register', 'UserController.register').middleware('guest')
Route.post('/login', 'UserController.login').middleware('guest')
Route.post('/follow', 'UserController.follow').middleware('auth')
Route.post('/unfollow', 'UserController.unfollow').middleware('auth')


Route.group(() => {
    Route.post('create', 'TweetController.create').middleware('auth')
    Route.get(':id', 'TweetController.read')
    Route.post('delete', 'TweetController.delete').middleware('auth')
    Route.post('like/', 'TweetController.like').middleware('auth')
    Route.post('repost', 'TweetController.repost').middleware('auth')
    Route.post('unlike/', 'TweetController.unlike').middleware('auth')
    Route.get('likes/:id', 'TweetController.getLikes')
    Route.get('/', 'TweetController.getAllTweets')
}).prefix('tweets')


Route.group(() => {
    Route.get('followers', 'UserController.listFollowers')
    Route.get('following', 'UserController.listFollowing')
    Route.get('tweets', 'UserController.listTweets')
    Route.get('likes', 'UserController.listLiked')
}).prefix(':username')

Route.group(() => {
    Route.get('all/:id', 'CommentController.getAll')
    Route.post('create', 'CommentController.createCommentHead').middleware('auth')
    Route.get('owner/:id', 'CommentController.getOwner')
    Route.get('tweet/:id', 'CommentController.getParentTweet')
}).prefix('comments')