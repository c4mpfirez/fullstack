import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, vi } from 'vitest';
import Blog from './Blog';



describe('Blog component tests', () => {
    test('renders content', () => {
        const blog = {
            id: '1',
            title: 'Testing React with Vitest',
            author: 'Jane Doe',
            url: 'http://example.com',
            likes: 5,
            user: { name: 'Test User' }               
        };

        const mockUpdateBlog = vi.fn();
        const mockDeleteBlog = vi.fn();

        render(<Blog blog={blog} updateBlog={mockUpdateBlog} deleteBlog={mockDeleteBlog} />);

        const titleElement = screen.getByText(/testing react with vitest/i, { exact: false });
        expect(titleElement).toBeDefined();

        const authorElement = screen.getByText(/jane doe/i, { exact: false });
        expect(authorElement).toBeDefined();

        expect(screen.queryByText('http://example.com')).toBeNull();
        expect(screen.queryByText(/5/i)).toBeNull();
    });

    test('renders url and likes when view button is clicked', () => {
      const blog = {
        id: '12345',
        title: 'Test Title',
        author: 'Test Author',
        url: 'http://test.com',
        likes: 5,
        user: {
          name: 'Test User',
          id: '12345'
        }
      }
    
      const loggedInUser = {
        id: '12345'
      }
    
      const updateBlog = () => {}
      const deleteBlog = () => {}
    
      const component = render(
        <Blog blog={blog} loggedInUser={loggedInUser} updateBlog={updateBlog} deleteBlog={deleteBlog} />
      )
    
      const button = component.getByText('view')
      fireEvent.click(button)
    
      expect(component.container).toHaveTextContent('http://test.com')
      expect(component.container).toHaveTextContent('5')
    })

    test('like button is called twice when clicked twice', async () => {
        const blog = {
            id: '1',
            title: 'Testing React with Vitest',
            author: 'Jane Doe',
            url: 'http://example.com',
            likes: 5,
            user: { name: 'Test User' }               
        };

        const mockUpdateBlog = vi.fn();
        const mockDeleteBlog = vi.fn();

        render(<Blog blog={blog} updateBlog={mockUpdateBlog} deleteBlog={mockDeleteBlog} />);

        const viewButton = screen.getByRole('button', { name: /view/i });
        await userEvent.click(viewButton);

        const likeButton = screen.getByRole('button', { name: /like/i });
        await userEvent.click(likeButton);
        await userEvent.click(likeButton);

        expect(mockUpdateBlog).toHaveBeenCalledTimes(2);
    });
});

          
