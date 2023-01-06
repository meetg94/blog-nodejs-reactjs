const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: "Blog 1",
        author: "Satoshi Nakamoto",
        url: "www.concordia.com/nonon",
        likes: 123
    },
    {
        title: "Blog 2",
        author: "Shinigami",
        url: "www.deathnote.com/32904",
        likes: 320
    },
]

beforeEach(async () => {
    await Blog.deleteMany({})

    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
}, 100000)

test('all blogs are returned', async () => {

    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(initialBlogs.length)
})

describe('creating a blog', () => {
    test('valid id exists for blogs', async () => {
        const response = await api.get('/api/blogs')
        const blogs = response.body 
        expect(blogs[0].id).toBeDefined()
    })
    
    test('blog is posted successfully', async () => {
        const newBlog = {
            title: "Blog 3 is getting posted",
            author: "Michael Jordna",
            url: "www.fakebook.com/epeip",
        }
    
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        const response = await api.get('/api/blogs')
    
        const contents = response.body.map(r => r.title)
    
        expect(response.body).toHaveLength(initialBlogs.length + 1)
        expect(contents).toContain('Blog 3 is getting posted')
    })

    test('a blog with no likes', async () => {
        const newBlog = {
            title: "Chicken over Rice",
            author: "Macklemoor",
            url: "www.mackfoods.com"
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const response = await api.get('/api/blogs')

        const blogtoTest = response.body.find(r => r.title === newBlog.title)

        expect(blogtoTest.likes).toBe(0)
    })
})

afterAll(() => {
    mongoose.connection.close()
})