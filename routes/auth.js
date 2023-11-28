const express = require('express')
const router = express.Router()
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { registerValidation, loginValidation } = require('../validation')


router.post('/login', async (req, res) => {
  console.log("Attempting to log user in")

  const { error } = loginValidation(req.body)
  if(error) return res.status(400).send(error)

  const user = await User.findOne({ email: req.body.email })
  if(!user) return res.status(400).send({ message: 'Email or password incorrect!' })

  const validPassword = await bcrypt.compare(req.body.password, user.password)
  if(!validPassword) return res.status(400).send({ message: 'Invalid credentials!'})

  const token = jwt.sign({ _id: user._id, role: user.role, email: user.email }, process.env.TOKEN_SECRET_KEY)
  res.header('Auth-Token', token).send({ token: token, message: 'Login successful' })
})


router.post('/register', async (req, res) => {
  console.log("Endpoint for signup reached!")
  console.log(req.body)

  const { error } = registerValidation(req.body)
  if(error) return res.status(400).send(error)

  const emailExists = await User.findOne({ email: req.body.email })
  if(emailExists) return res.status(400).send({
      message: 'Email already exists!'
  })

  // HASH PASSWORD
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(req.body.password, salt)
  const role = req.body.role
  const description = req.body.description

  const newUser = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: hashedPassword,
    imgURL: req.body?.imgURL,
    description: description ? description : null,
    role: role ? role : 'VOTER'
  }

  new User(newUser).save()
  .then((response) => {
    return res.json({
      success: true,
      message: "User Saved successfully!",
      user: response._id
    })
  }).catch(err => res.json(err))

})

router.get('/profile-token/:id', async (req, res) => {
  const id = req.params.id
  if(!id) return res.status(400).send({message: 'Invalid Id'})
  console.log('id', id)
  const user = await User.findById(id)
  console.log(user)

  const token = jwt.sign({ _id: user._id, role: user.role, email: user.email }, process.env.TOKEN_SECRET_KEY)
  res.header('Auth-Token', token).send({ 
    success: true,
    firstname: user.firstname,
    lastname: user.lastname,
    imgURL: user.imgURL,
    token: token,
   })
})

router.get('/profile/:id', async (req, res) => {
  const id = req.params.id
  if(!id) return res.status(400).send({message: 'Invalid Id'})
  console.log('id', id)
  const user = await User.findById(id)
  console.log(user)

  return res.json({
    success: true,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    role: user.role,
    imgURL: user.imgURL
  })
})


module.exports = router