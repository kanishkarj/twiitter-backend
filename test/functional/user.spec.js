'use strict'

const { test,trait } = use('Test/Suite')('User')
const User = use('App/Models/User')

trait('Test/ApiClient')
trait('Auth/Client')
trait('DatabaseTransactions')

test('Registration Check', async ({ client }) => {
  const response = await client.post('/register').send({
    email: 'temp@mail.com',
    username: 'tempname',
    password: 'password',
  }).end()

  await client.post('/register').send({
    email: 'user@mail.com',
    username: 'username',
    password: 'password',
  }).end()

  response.assertStatus(200)
  response.assertJSONSubset({
    email: 'temp@mail.com',
    username: 'tempname',
  })
})

test('Registration Validation Check', async ({ client }) => {
  const response = await client.post('/register').send({
    email: 'tempmailcom',
    username: 'tempname',
  }).end()
  

  response.assertStatus(200)
  response.assertJSONSubset([{
     field:"email"
  },{
    field:"password"
  }])
})

test('Login Check', async ({ client }) => {
  let response = await client.post('/register').send({
    email: 'temp@mail.com',
    username: 'tempname',
    password: 'password',
  }).end()
  response = await client.post('/login').send({
    email: 'temp@mail.com',
    username: 'tempname',
    password: 'password'
  }).type('json').end()

  response.assertStatus(200)
  response.assertJSONSubset({
    type: 'bearer',
  })
})



