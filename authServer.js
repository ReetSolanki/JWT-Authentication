require('dotenv').config()

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')

app.use(express.json()) // Lets our application use json

let refreshTokens = [] //This is better than making a db just to store refreshtoken, even tho this gets updated after restarting the server

app.post('/token', (req, res) => {
    const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(401)
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403)
        const accessToken = generateAcessToken({name: user.name})
        res.json({ accessToken: accessToken })
    })
})

app.delete('/logout', (req, res) => { //Deauthenticate a refresh token
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204) //Shows token deleted successfully
}) 

//Now we want not everyone to access the posts, but only some specific users
app.post('/login', (req, res) =>{
    //Authentication User

    const username = req.body.username
    const user = { name: username }

    const accessToken = generateAcessToken(user) // This token has no expiration date, therfore we make refresh token
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken)
    res.json({ accessToken: accessToken, refreshToken: refreshToken })
})

function generateAcessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' }) 
}

app.listen(4000)