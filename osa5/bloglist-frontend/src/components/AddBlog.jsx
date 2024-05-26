import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types'; 
import blogService from '../services/blogs';
import Togglable from './Togglable';

const AddBlog = ({ setBlogs, setNotification, setNotificationType }) => {
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const togglableRef = useRef();

  const addBlog = async (event) => {
    event.preventDefault();
    try {
      const blog = await blogService.create({ title: newTitle, author: newAuthor, url: newUrl });
      const updatedBlogs = await blogService.getAll();
      setBlogs(updatedBlogs);
      setNewTitle('');
      setNewAuthor('');
      setNewUrl('');
      setNotification(`A new blog '${blog.title}' by ${blog.author} added`);
      setNotificationType('success');
      togglableRef.current.toggleVisibility();
      setTimeout(() => {
        setNotification(null);
        setNotificationType('');
    }, 5000);
} catch (exception) {
    setNotification('Error creating blog');
    setNotificationType('error');
    setTimeout(() => {
        setNotification(null);
        setNotificationType('');
    }, 5000);
}
};
  

return (
  <Togglable buttonLabel="create new blog" ref={togglableRef}>
    <form onSubmit={addBlog}>
      <div>
        <label htmlFor="Title">title</label>
        <input id="Title" data-testid="Title" type="text" value={newTitle} name="Title" onChange={({ target }) => setNewTitle(target.value)} />
      </div>
      <div>
        <label htmlFor="Author">author</label>
        <input id="Author" data-testid="Author" type="text" value={newAuthor} name="Author" onChange={({ target }) => setNewAuthor(target.value)} />
      </div>
      <div>
        <label htmlFor="Url">url</label>
        <input id="Url" data-testid="Url" type="text" value={newUrl} name="Url" onChange={({ target }) => setNewUrl(target.value)} />
      </div>
      <button type="submit">create</button>
    </form>
  </Togglable>
);

};
AddBlog.propTypes = {
  blogs: PropTypes.array,
  setBlogs: PropTypes.func.isRequired, 
  setNotification: PropTypes.func.isRequired, 
  setNotificationType: PropTypes.func.isRequired 
};
export default AddBlog;
