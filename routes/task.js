const express = require('express')
const router = express.Router()
const Task = require('./../models/task')
const auth = require('./../middlewares/auth')


router.post('/', auth,  async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
})


// Query
// GET api/tasks?completed=true

// Pagination
// GET api/tasks?limit=5&skip=5

// Sort
// Get api/task?sortBy = createdAt: desc

router.get('/', auth, async (req, res) => {
    // condition query
    const match = {}

    if(req.query.completed) {
        match.completed = req.query.completed === 'true'
    }
    
    // sort
    const sort = {}
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        // console.log(parts)
        sort[parts[0]] = parts[1] === 'desc' ? -1 :1
    }
    
    try{
        await req.user.populate({
            // query with value
            path: 'tasks',
            match,
            // pagination
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    }catch(e) {
        res.status(500).send()
    }
})

router.get('/:id', auth ,async(req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOne({_id, owner: req.user._id})
        if(!task) {
            return res.status(404).send
        }

        res.send(task)

    }catch(e) {
        res.status(500).send()

    }
})

router.put('/:id', auth,  async (req, res)=> {
    const updates = Object.keys(req.body)
    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})

        if(!task) {
            return res.status(404).send()
        }

        updates.forEach(update => task[update] = req.body[update])
        await task.save()
        res.send(task)

    }catch(e) {
        res.status(500).send()
    }
})

router.delete('/:id',auth,  async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id : req.params.id, owner: req.user._id })

        if(!task) {
            return res.status(404).send()
        }
        res.send({message: "Delete successfully"})
    }catch(e) {
        res.status(500).send()
    }
})

module.exports = router


