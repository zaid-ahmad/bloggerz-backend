import express from 'express'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

import login from '../auth/login.js'
import User from '../models/user.js'

const router = express.Router()

const expirationtimeInMs = process.env.JWT_EXPIRATION_TIME
const secret = process.env.JWT_SECRET

router.post('/login', login, async (req, res) => {
  let user

  if (res.locals.user) {
    user = res.locals.user
  } else {
    res.status(400).json({
      error: 'User not found',
    })
  }

  const userFound = await User.findOne({ username: user.username })

  const payload = {
    name: userFound.name,
    username: userFound.username,
    expiration: Date.now() + parseInt(expirationtimeInMs),
  }

  const token = jwt.sign(JSON.stringify(payload), secret)

  res.status(200).json({
    message: 'You have logged in :D',
    token: token, // Include the token in the response
  })
})

router.get('/logout', (req, res) => {
  if (req.cookies['jwt']) {
    res.clearCookie('jwt').status(200).json({
      message: 'You have logged out',
    })
  } else {
    res.status(401).json({
      error: 'Invalid jwt',
    })
  }
})

// router.get(
//   '/protected',
//   passport.authenticate('jwt', { session: false }),
//   (req, res) => {
//     res.status(200).json({
//       message: 'welcome to the protected route!',
//     })
//   }
// )

export { router as userRouter }
