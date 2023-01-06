const { r } = require("tar")

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {

    if(!blogs) return 0
    return blogs.reduce((sum, item) => sum + item.likes, 0)
}

const favoriteBlog = (blogs) => {

    if (!blogs || blogs.length === 0) return null
    if (blogs.length === 1) return blogs[0]

    let favBlog = blogs[0]
    blogs.forEach(blog => {
        if(blog.likes > favBlog.likes){
            favBlog = blog
        }
    })
    
    return favBlog
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}