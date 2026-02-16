require('dotenv').config()

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')

app.use(express.json()) // Lets our application use json

const posts = [
    {
        username: "Kyle",
        title: "Post 1"
    },
    {
        username: "Jim",
        title: "Post 2"
    }
]

app.get('/posts', authenticateToken, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name))
})

//Now we want not everyone to access the posts, but only some specific users

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] //1 to get the 2nd paramater TOKEN
    //Bearer TOKEN
    if(token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => { //Verify token
        if(err) return res.sendStatus(403)   // You have a token which is no longer active, so no access
        req.user = user
        next()
    })  
}

app.listen(3000)