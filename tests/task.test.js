const request = require('supertest')
const app = require('../app')
const Task = require('../models/task')

const { 
    userId,
    user,
    userTwoId,
    userTwo,
    taskOne,
    taskTwo,
    setupDB,
} = require('./fixture/db')



beforeEach(setupDB)

test("create task ",async ()=> {
    const res = await request(app).post('/api/tasks')
    .set('Authorization',`Bearer ${userTwo.tokens[0].token}`)
    .send({
        description:"create description3"
    })
    .expect(201)

    const task = await Task.findById(res.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)

})

test("get task ",async ()=> {
    const res = await request(app).get('/api/tasks')
    .set('Authorization',`Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(200)

    expect(res.body.length).toEqual(2)
})

test("delete task ",async ()=> {
    const res = await request(app).delete(`/api/tasks/${taskOne._id}`)
    .set('Authorization',`Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(200)

    const task = await Task.findById(taskOne._id)
    expect(task).toBeNull()
})