const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const router = express.Router()
const auth = require('./../middlewares/auth')
const User = require('./../models/user')



router.get('/me', auth,(req, res) => {
    // Getall
    // User.find({})
    //     .then((users) =>{
    //         res.send(users)
    //     })
    //     .catch((err) =>{
    //        res.status(500).send(error)
    //     })

    // Get user with login
    res.send(req.user)
})

router.put('/me', auth ,async (req, res) => {
    const updates = Object.keys(req.body)

    try {
        
        const user = await User.findById(req.user._id)
        updates.forEach((update) => req.user[update] = req.body[update] )
        await req.user.save()

        res.send(req.user)
    }
    catch(err){
        res.status(500).send()
    }
})

router.delete('/me', auth ,async (req, res) => {
    try {
        req.user.remove()
        res.json({success: true, message:"delete successfully!"}).send(req.user)
        
    }
    catch(err) {
        return res.status(500).json({success: false, message:'Server Error'})
    }
})

const upload = multer({
    dest : 'avatars',
    limits: { 
        fileSize:1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(JPG|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }
        cb(undefined,true)
    }
})

router.post('/me/avatar', auth,upload.single('avatar'),async (req, res) => {
    // const buffer = await sharp(req.file.buffer).resize(250, 250).png().toBuffer()
    // req.user.avatar = req.file.path.split('\\').slice(2).join('/')
    // console.log(req.file)

    req.user.avatar = req.file.buffer
    await req.user.save()
    res.send({message:"update successfully"})
},(error , req, res, next) => {
    res.status(404).send({error: error.message})
})

router.delete('/me/avatar',auth,async (req, res)=> {
    req.user.avatar = undefined
    await req.user.save()
    res.send({mess:"delete avatar successfully"})
})


router.get('/:id/avatar', async(req , res) => {
    try{
        const user = User.findById(req.params.id)

    if(!user || !user.avatar) {
        throw new Error('')
    }

    res.set('Content-Type','image/jpg')
    res.send(user.avatar)

    }catch(e) {
        return res.status(500).json({success: false, message:'Server Error'})
    }

})


module.exports = router