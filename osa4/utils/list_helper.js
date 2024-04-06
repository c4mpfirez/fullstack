const dummy = (blogs) => {
    return 1
  }
  
  module.exports = {
    dummy
  }
  
  const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
  }
  
  module.exports = {
    dummy,
    totalLikes
  }

  const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
      return null
    }
    const maxLikes = Math.max(...blogs.map(blog => blog.likes))
    const favorite = blogs.find(blog => blog.likes === maxLikes)
    return {
      title: favorite.title,
      author: favorite.author,
      likes: favorite.likes
    }
  }
  const mostBlogs = (blogs) => {
    const authors = blogs.reduce((acc, blog) => {
      acc[blog.author] = (acc[blog.author] || 0) + 1
      return acc
    }, {})
  
    const maxBlogs = Math.max(...Object.values(authors))
    const mostBlogsAuthor = Object.keys(authors).find(author => authors[author] === maxBlogs)
  
    return {
      author: mostBlogsAuthor,
      blogs: maxBlogs
    }
  }
  const mostLikes = (blogs) => {
    const authorLikes = blogs.reduce((acc, blog) => {
      acc[blog.author] = (acc[blog.author] || 0) + blog.likes
      return acc
    }, {})
  
    const maxLikes = Math.max(...Object.values(authorLikes))
    const mostLikesAuthor = Object.keys(authorLikes).find(author => authorLikes[author] === maxLikes)
  
    return {
      author: mostLikesAuthor,
      likes: maxLikes
    }
  }
  
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }