require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/user')
const taskRouter = require('./routes/task')
const authRouter = require('./routes/auth')

// mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@task-project.igpcm.mongodb.net/Task-project?retryWrites=true&w=majority
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/taskapp',{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        })
        console.log('connect successfully')
    } catch (error) {
        console.log('connect failure')
    }
} 
connectDB()

const app = express();

const multer = require('multer')
const upload = multer({
    dest : 'images',
    limits: { 
        fileSize:1000000
    },
    fileFilter (req, file, cb) {
        if(!file.originalname.match(/\.(doc|docx)$/)){
            return cb(new Error('please up load a Word document'))
        }

        cb(undefined, true)
    }
})
app.post('/upload', upload.single('upload'),(req, res) => {
    res.send()
},(error , req, res, next) => {
    res.status(404).send({error: error.message})
}

)





app.use(express.urlencoded({extended: true,}))
app.use(express.json())

app.use('/api/users',userRouter)
app.use('/api/tasks',taskRouter)
app.use('/api/auth',authRouter)




const POST = process.env.PORT || 5000
app.listen(POST, () => console.log(`Server start on port ${POST}`))

// const Task = require('./models/task')
// const User = require('./models/user')

// const main = async () => {
//     const user = await User.findById('612f425154f55d1a78145b9e')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }

// main()