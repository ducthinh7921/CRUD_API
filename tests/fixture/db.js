const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../models/user')
const Task = require('../../models/task')


const userId = new mongoose.Types.ObjectId()
const user = {
    _id:userId,
    name:"ducthinh",
    email:"ren123456@gmail.com",
    password:"ducthinh123",
    tokens:[{
        token: jwt.sign({_id:userId},process.env.ACCESS_TOKEN_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id:userTwoId,
    name:"ducthinh2",
    email:"ren789456@gmail.com",
    password:"ducthinh123",
    tokens:[{
        token: jwt.sign({_id:userTwoId},process.env.ACCESS_TOKEN_SECRET)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'First task',
    completed:false,
    owner:userTwo._id
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Second task',
    completed:true,
    owner:userTwo._id
}





const setupDB = async() => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(user).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()


}
 
module.exports = {
    userId,
    user,
    userTwoId,
    userTwo,
    setupDB,
    taskOne,
    taskTwo
   
}