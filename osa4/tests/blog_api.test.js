const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    const newUser = {
      username: 'testuser',
      password: 'testpassword'
  }
// Adding test user
  await api
      .post('/api/users')
      .send(newUser);
  const result = await api
      .post('/api/login')
      .send(newUser);

  token = result.body.token
  console.log(token)
})

describe('bloglist tests', () => {

    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
        const blogsInDb = await helper.blogsInDb()

        console.log(`Number of blogs: ${blogsInDb.length}`)
        expect(response.body).toHaveLength(blogsInDb.length)
    })

    test('blogs have id field', async () => {
      const response = await api.get('/api/blogs')
      
      if(response.body[0]) {
          console.log('blogs have id field' + response.body[0].id)
          expect(response.body[0].id).toBeDefined()
      } else {
          console.log('No blogs found')
      }
  })
    test('a valid blog can be added by authorized users', async () => {
      const existingUser = {
        username: 'testuser', 
        password: 'testpassword',
      }
    
      const result = await api
        .post('/api/login')
        .send(existingUser)
    
      const newBlog = {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2
      }  
      const blogsAtStart = await helper.blogsInDb()

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${result.body.token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      
      const blogsAtEnd = await helper.blogsInDb()
      
      expect(blogsAtEnd.length).toBeGreaterThan(blogsAtStart.length)
      const titles = blogsAtEnd.map(n => n.title)
    
      expect(titles).toContain(
        'Type wars'
      )
    }, 100000)

    test('default like count to zero', async () => {
      const newBlog = {
        title: 'New',
        author: 'Test',
        url: 'https://addingnewblog.com',
      }
    
      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
      expect(response.body.likes).toBe(0)
    })

    test('blog without title', async () => {
      const newBlog = {
        author: 'Test Author',
        url: 'https://addingnewblog.com',
        likes: 5
      }
      const blogsAtStart = await helper.blogsInDb()
    
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    
      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
    })
    
    test('blog without url', async () => {
      const newBlog = {
        title: 'New',
        author: 'Test',
        likes: 5
      }
    
      const blogsAtStart = await helper.blogsInDb()
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    
      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
    })
    test('deleting blog', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart.find(blog => blog.title === 'Blog to delete')
    
      if (blogToDelete) {
        await api
          .delete(`/api/blogs/${blogToDelete.id}`)
          .expect(204)
    
        const blogsAtEnd = await helper.blogsInDb()
    
        expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
    
        const titles = blogsAtEnd.map(r => r.title)
    
        expect(titles).not.toContain(blogToDelete.title)
      } else {
        console.log('Blog not found,skipping')
      }
    })
  
// User & password tests

test('user with short username is not created', async () => {
  const newUser = {
    username: 'te',
    name: 'te',
    password: 'tess',
  }
  const result = await api
    .post('/api/users')
    .send(newUser)

  expect(result.status).toBe(400)
  expect(result.body.error).toBe('username must be min. 3 characters long')
})

test('user without password is not created', async () => {
  const newUser = {
    username: 'user',
    name: 'Test User',
  }
  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
})
test('user with short password is not created', async () => {
  const newUser = {
    username: 'user',
    name: 'Test User',
    password: 'pw',
  }
  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
})
test('user with non-unique username is not created', async () => {
  const newUser = {
    username: 'testaan', //already taken
    name: 'Test User',
    password: 'password',
  }
  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
})

    test('updating blog', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
    
      const newBlog = {
        ...blogToUpdate,
        likes: blogToUpdate.likes + 1,
      }
    
      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(newBlog)
        .expect(200)
    
      const blogsAtEnd = await helper.blogsInDb()
    
      expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
    
      const updatedBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id)
      expect(updatedBlog.likes).toBe(blogToUpdate.likes + 1)
    })

afterAll(() => {
    mongoose.connection.close()
})
})