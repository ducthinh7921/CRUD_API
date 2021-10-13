const request = require('supertest')
const app = require('../app')
const User = require('../models/user')
const { 
    userId,
    user,
    setupDB,
} = require('./fixture/db')


beforeEach(setupDB)

test("register a new user",async ()=> {
    const res = await request(app).post('/api/auth/register').send({
        name:"ducthinh",
        email:"ducthinh7922@gmail.com",
        password:"ducthinh123"
    }).expect(201)

    // Kiem tra ton tai 
    const user = await User.findById(res.body.user._id)
    expect(user).not.toBeNull()

    // match
    expect(res.body).toMatchObject({
        user: {
            name:"ducthinh",
            email:"ducthinh7922@gmail.com"
        },
        token:user.tokens[0].token
    })
    // hash nen k giong
    expect(user.password).not.toBe('ducthinh123')

})

test("login ",async ()=> {
    const res = await request(app).post('/api/auth/login').send({
        email: user.email, 
        password: user.password
    }).expect(200)

    const user1 = await User.findById(user) 
    // kiem tra token trung
    expect(res.body.token).toBe(user1.tokens[1].token)
})

test("login with nonexistent user",async ()=> {
    await request(app).post('/api/auth/login').send({
        email: user.email, 
        password: "thisisnotpassword"
    }).expect(400)
})

test("get profile",async ()=> {
    await request(app).get('/api/users/me')
    .set('Authorization',`Bearer ${user.tokens[0].token}`)
    .send()
    .expect(200)
})

test("get profile with Unauthorized",async ()=> {
    await request(app).get('/api/users/me')
    .send()
    .expect(401)
})


test("delete account",async ()=> {
    await request(app).delete('/api/users/me')
    .set('Authorization',`Bearer ${user.tokens[0].token}`)
    .send()
    .expect(200)

    // kiem tra da xoa account chua
    const user1 = await User.findById(user._id)
    expect(user1).toBeNull()
})

test("delete account with Unauthorized",async ()=> {
    await request(app).delete('/api/users/me')
    .send()
    .expect(401)
})

test("upload file",async ()=> {
    await request(app).post('/api/users/me/avatar')
    .set('Authorization',`Bearer ${user.tokens[0].token}`)
    .attach('avatar','tests/fixture/Capture2.JPG')
    .expect(200)

    const user1 = await User.findById(user)
    expect(user1.avatar).toEqual(expect.any(Buffer));
    
})

test("upload file",async ()=> {
    await request(app).put('/api/users/me')
    .set('Authorization',`Bearer ${user.tokens[0].token}`)
    .send({
        name:"Rayn"
    })
    .expect(200)

    const user1 = await User.findById(user)
    expect(user1.name).toEqual("Rayn");
    
})






