const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (req, res) =>{
  const { username, name, password } = req.body
  if (!name) {
    return res.status(400).json({ error: 'name is required' })
  }
  if (!username || username.length < 3){
    return res.status(400).json({ error: 'username must be min. 3 characters long' })
  }
  if (!password || password.length < 3){
    return res.status(400).json({ error: 'password must be min. 3 characters long' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const existingUser = await User.findOne({ username })

  if (existingUser) {
    return res.status(400).json({ error: 'username is taken' })
  }

  const user = new User({
    username,
    name,
    passwordHash,
  })
  const savedUser = await user.save()
  res.status(201).json(savedUser)
})
usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('blogs', { url: 1, title: 1, author: 1, id: 1 })
  response.json(users)
})

module.exports = usersRouter