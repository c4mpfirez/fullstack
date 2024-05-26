import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddBlog from './AddBlog';
import blogService from '../services/blogs'; 

// vi.mockit
blogService.create = vi.fn();
blogService.getAll = vi.fn();

describe('AddBlog component', () => {
  it('correctly handles the full flow from opening the form to submitting a new blog', async () => {
    const mockSetBlogs = vi.fn();
    const user = userEvent.setup();
    const fakeBlog = {
      title: 'Example Blog',
      author: 'Jane Doe',
      url: 'http://example.com'
    };
    const blogs = [fakeBlog];

    // blogService.create ja getAll arvot
    blogService.create.mockResolvedValue(fakeBlog);
    blogService.getAll.mockResolvedValue(blogs);

    render(<AddBlog setBlogs={mockSetBlogs} setNotification={vi.fn()} setNotificationType={vi.fn()} />);

    const openFormButton = screen.getByText('create new blog');
    await user.click(openFormButton);
    await user.type(screen.getByTestId('Title'), fakeBlog.title);
    await user.type(screen.getByTestId('Author'), fakeBlog.author);
    await user.type(screen.getByTestId('Url'), fakeBlog.url);

    const createButton = screen.getByText('create');
    await user.click(createButton);

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(mockSetBlogs).toHaveBeenCalledTimes(1);
    expect(mockSetBlogs).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({
      title: fakeBlog.title,
      author: fakeBlog.author,
      url: fakeBlog.url
    })]));
  });
});
