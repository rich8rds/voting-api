const router = require('express').Router()
const axios = require('axios')
const User = require('../models/User')
require('dotenv').config()

const { OAuth2Client } = require('google-auth-library')
// const REGISTER_URL = 'https://votes-api.onrender.com:4000/api/auth/register'
const REGISTER_URL = 'https://votes-api.onrender.com/api/auth/register'

const getUserData = async (accessToken) => {
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`)

    const data = await response.json()
    const { given_name, family_name, picture, email } = data

    const emailExists = await User.findOne({ email: email })
    if (emailExists) {
        return emailExists._id
    } else {
        axios.post(REGISTER_URL, {
            firstname: given_name,
            lastname: family_name,
            email: email,
            description: 'Social login registration',
            imgURL: picture,
            password: 'SomeRandomPassword',

        }).then(res => res.data.user )
        .catch(err =>  err)
    }

    console.log(given_name)
}

router.get('/', async (req, res) => {
    const code = req.query.code
    // console.log("Checking Request")


    try {
        // const redirectUrl = 'https://votes-api.onrender.com:4000/api/oauth'
        const redirectUrl = 'https://votes-api.onrender.com/api/oauth'

        const oAuth2Client = new OAuth2Client(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            redirectUrl
        )

        const response = await oAuth2Client.getToken(code)
        await oAuth2Client.setCredentials(response.tokens)
        // console.log("TOKEN ACQUIRED")

        const user = oAuth2Client.credentials;
        // console.log('credentials', user);
        const data = await getUserData(oAuth2Client.credentials.access_token);
        // res.redirect(303, `http://localhost:5173?token=${data}`)
        res.redirect(303, `https://voting-app-fe.onrender.com?token=${data}`)


    } catch (err) {
        console.log('Error sigining in with Google!')
        console.log(err)
    }

    // res.redirect(303, `http://localhost:5173?email=rbukunmi8@gmail.com`)
})


module.exports = router

