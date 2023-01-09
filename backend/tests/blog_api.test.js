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
    await Blog.insertMany(initialBlogs)
}, 100000)

describe('viewing a specific blog', () => {
    test('all blogs are returned', async () => {

        const response = await api.get('/api/blogs')
    
        expect(response.body).toHaveLength(initialBlogs.length)
    })
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

    test('a blog with no likes, gets 0 likes', async () => {
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

    test('blog with no title or url', async () => {
        const newBlog = {
            author: "John Doe",
            url: "www.johndoe.com",
            likes: 10,
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
    }, 100000)
})

describe('deleting a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {

        const blogsResponse = await api.get('/api/blogs')
        const blogsToDelete = blogsResponse.body[blogsResponse.body.length - 1] //last blog

        await api.delete(`/api/blogs/${blogsToDelete.id}`)

        const newBlogsResponse = await api.get('/api/blogs')
        const titles = newBlogsResponse.body.map(r => r.title)

        expect(titles).not.toContain(blogsToDelete.title)
    })
}, 100000)

afterAll(() => {
    mongoose.connection.close()
})