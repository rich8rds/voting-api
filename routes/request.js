const router = require('express').Router()
require('dotenv').config()

const { OAuth2Client } = require('google-auth-library')


router.post('/', async (req, res) => {
    const redirectUrl = 'https://votes-api.onrender.com:4000/api/oauth'

    const oAuth2Client = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        redirectUrl
    )

    const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: 'https://www.googleapis.com/auth/userinfo.profile   https://www.googleapis.com/auth/userinfo.email  openid ',
        prompt: 'consent'
    })

    res.json({ url: authorizeUrl })
})

module.exports = router

