import { useState, useEffect } from 'react';
///import axios from 'axios';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import AddBlog from './components/AddBlog';
import NotificationMessage from './components/NotificationMessage';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const [notificationType, setNotificationType] = useState('');
  const [loginError, setLoginError] = useState(null);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
      blogService.getAll().then(blogs => setBlogs(blogs)).catch(() => {
        ///console.error('Failed to fetch blogs:', error);
        setNotification('Unable to load blogs');
        setNotificationType('error');
      });
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username, password,
      });

      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      );
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      setLoginError('wrong username or password!');
      setTimeout(() => {
        setLoginError(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser');
    blogService.setToken(null); // deleting token from service
    setUser(null);
  };
  const removeBlog = async (blogId) => {
    try {
      await blogService.remove(blogId);
      setBlogs(blogs.filter(blog => blog.id !== blogId));
    } catch (exception) {
      setNotification('Unable to remove the blog');
      setNotificationType('error');
      ///console.log(exception);
    }
  };
  const addLikes = async (blogId) => {
    const blogToUpdate = blogs.find(blog => blog.id === blogId);
    if (!blogToUpdate) {
      ///console.error('Blog not found');
      setNotification('Blog not found');
      setNotificationType('error');
      return;
    }

    const updatedBlog = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1
    };

    try {
      const returnedBlog = await blogService.updateBlog(blogId, updatedBlog);
      const updatedBlogWithUser = {
        ...returnedBlog,
        user: blogToUpdate.user 
      };
      setBlogs(blogs.map(blog => blog.id !== blogId ? blog : updatedBlogWithUser));
    } catch (exception) {
      setNotification('Unable to update the blog');
      setNotificationType('error');
      ///console.log(exception);
    }
  };

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        {loginError && <NotificationMessage message={loginError} type="error" />}
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h1>blogs</h1>
      <NotificationMessage message={notification} type={notificationType} />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <p style={{ marginRight: '10px' }}><strong>{user.name}</strong> logged in</p>
        <button onClick={handleLogout}>logout</button>
      </div>
      {user && <AddBlog blogs={blogs} setBlogs={setBlogs} setNotification={setNotification} setNotificationType={setNotificationType} />}
      {[...blogs].sort((a, b) => b.likes - a.likes).map(blog => (
        <Blog key={blog.id} blog={blog} updateBlog={addLikes} removeBlog={removeBlog} loggedInUser={user || {}} />
      ))}
    </div>
  );
};

export default App;