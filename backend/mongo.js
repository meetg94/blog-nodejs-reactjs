const mongoose = require('mongoose')

const password = process.argv[2]

const url = `mongodb+srv://blogusername:${password}@cluster0.pmrid2k.mongodb.net/?retryWrites=true&w=majority`

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

mongoose
    .connect(url)
        .then((result) => {
            console.log('connected')
            const blog = new Blog({
                title: 'This is first Blogpost',
                author: 'Meet Guleria',
                url: 'www.dumbobumbo.com/23232',
                likes: 23
            })

        return blog.save()
        })
        .then(() => {
            console.log('blog saved!')
            return mongoose.connection.close()
        })