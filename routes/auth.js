const express = require('express');
const router = express.Router();
const auth = require('./../middlewares/auth')
const User = require('./../models/user')
const jwt = require('jsonwebtoken')


router.post('/register', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    }catch(e) {
        res.status(400).send(e)
    }
})



router.post('/login', async(req , res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        return res.send({mess:"Login successfully",user, token })
        }
    catch(e){
        res.status(500).json({success: false, message:'Server errorrr'})

    }
})

router.post('/logout',auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send({mess:"Logout successfully"})
    }catch(e) {
        res.status(500).send()
    }
})


module.exports = router