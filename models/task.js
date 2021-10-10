const mongoose = require('mongoose')
const Schema = mongoose.Schema
const validator = require('validator')

const TaskSchema  = new Schema({
   description: {
       type: String, 
       required: true, 
       trim: true,  
   },
   completed:{
       type: Boolean, 
       default: false, 
   },
    owner: {
       type: mongoose.Types.ObjectId,
       required: true, 
       ref: 'users'

   }
  
},{
    timestamps: true,
})

module.exports = mongoose.model('tasks',TaskSchema)


