'use strict'

const { test,trait } = use('Test/Suite')('User')
const User = use('App/Models/User')

trait('DatabaseTransactions')
trait('Test/ApiClient')
trait('Auth/Client')

test('Registration Check', async ({ client }) => {
  const response = await client.post('/register').send({
    email: 'temp@mail.com',
    username: 'tempname',
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
  const response = await client.post('/login').send({
    email: 'temp@mail.com',
    username: 'tempname',
    password: 'password',
  }).end()

  response.assertStatus(200)
  response.assertJSONSubset({
    email: 'temp@mail.com',
    username: 'tempname',
  })
})

