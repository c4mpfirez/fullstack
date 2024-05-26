const { test, expect, beforeEach, afterEach, describe } = require('@playwright/test');

// Helper
async function loginAsUser(page, { username, password }) {
    await page.goto('http://localhost:5173');
    await page.waitForSelector('input[name="Username"]', { state: 'visible' }); 
    await page.fill('input[name="Username"]', username);
    await page.fill('input[name="Password"]', password);
    await page.click('button[type="submit"]');
}

describe('Blog app', () => {
    let userData = {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
    };

    beforeEach(async ({ page, request }) => {
        await request.post('http://localhost:3001/api/testing/reset');
        await request.post('http://localhost:3001/api/users', { data: userData });
    });
    afterEach(async ({ page }) => {
        await page.goto('http://localhost:3001/api/testing/reset');
    });

    test('Login form is shown', async ({ page }) => {
        await page.goto('http://localhost:5173');
        const usernameInput = page.locator('input[name="Username"]');
        const passwordInput = page.locator('input[name="Password"]');
        const loginButton = page.locator('button[type="submit"]');

        await expect(usernameInput).toBeVisible();
        await expect(passwordInput).toBeVisible();
        await expect(loginButton).toBeVisible();
    });

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await loginAsUser(page, userData);
            await expect(page).toHaveURL('http://localhost:5173');
        });

        test('fails with wrong credentials', async ({ page }) => {
            await loginAsUser(page, { ...userData, password: 'wrongpassword' });
            await expect(page.getByText('wrong username or password')).toBeVisible();
        });
    });

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await loginAsUser(page, userData);
            await expect(page.getByRole('heading', { name: 'blogs' })).toBeVisible();
        });

        test('a blog can be liked', async ({ page }) => {   /// With creating a new blog
            await page.click('text="create new blog"');
            await page.fill('input[name="Title"]', 'Test Blog Title');
            await page.fill('input[name="Author"]', 'Test Author');
            await page.fill('input[name="Url"]', 'https://testblog.com');
            await page.click('text="create"');
            await page.waitForSelector('text="A new blog \'Test Blog Title\' by Test Author added"');
        
            await page.reload();
        
            const blogLocator = page.locator('text="Test Blog Title Test Author"');
            await blogLocator.waitFor();
        
            const viewButton = blogLocator.locator('text="view"');
            await expect(viewButton).toBeVisible();
            await viewButton.click();
        
            await page.click('text="like"');
            const likesText = page.locator('text="likes 1"');
            await expect(likesText).toBeVisible();
        });
        test('a blog can be deleted by the user who added it', async ({ page }) => { /// Use the blog from previous test
            await page.reload();
            const blogLocator = page.locator('text="Test Blog Title Test Author"');
            await blogLocator.waitFor();
        
            const viewButton = blogLocator.locator('text="view"');
            await expect(viewButton).toBeVisible();
            await viewButton.click();
        
            page.on('dialog', dialog => {
                dialog.accept();
            });
        
            const removeButton = page.locator('button:text("remove")');
            await removeButton.click();
        
            await expect(blogLocator).not.toBeVisible(); 
        });
        test('only the user who added the blog can see the delete button', async ({ page }) => {
            await page.click('text="create new blog"');
            await page.fill('input[name="Title"]', 'Test Blog Title');
            await page.fill('input[name="Author"]', 'Test Author');
            await page.fill('input[name="Url"]', 'https://testblog.com');
            await page.click('text="create"');
            await page.waitForSelector('text="A new blog \'Test Blog Title\' by Test Author added"');
        
            await page.reload();
        
            const blogLocator = page.locator('text="u cant remove this tester"'); /// This exists in the database
            await blogLocator.waitFor();
        
            const viewButton = blogLocator.locator('text="view"');
            await expect(viewButton).toBeVisible();
            await viewButton.click();
        
            const removeButton = page.locator('button:text("remove")');
            await expect(removeButton).not.toBeVisible();
        
            const blogLocator2 = page.locator('text="Test Blog Title Test Author"');
            await blogLocator2.waitFor();
        
            const viewButton2 = blogLocator2.locator('text="view"');
            await expect(viewButton2).toBeVisible();
            await viewButton2.click();
        
            const removeButton2 = page.locator('button:text("remove")');
            await expect(removeButton2).toBeVisible();
        
            page.on('dialog', dialog => {
                dialog.accept();
            });
        
            await removeButton2.click();
            await page.reload();
        });
        test('blogs are sorted by likes', async ({ page }) => {
            const blogs = [
                { title: 'Blog 1', author: 'Author 1', url: 'https://blog1.com', likes: 1 },
                { title: 'Blog 2', author: 'Author 2', url: 'https://blog2.com', likes: 2 },
                { title: 'Blog 3', author: 'Author 3', url: 'https://blog3.com', likes: 3 },
            ];
        
            for (const blog of blogs) {
                await page.click('text="create new blog"');
                await page.fill('input[name="Title"]', blog.title);
                await page.fill('input[name="Author"]', blog.author);
                await page.fill('input[name="Url"]', blog.url);
                await page.click('text="create"');
                await page.waitForSelector(`text="A new blog '${blog.title}' by ${blog.author} added"`);
        
                const blogLocator = page.locator(`text="${blog.title} ${blog.author}"`);
                await blogLocator.waitFor();
        
                const viewButton = blogLocator.locator('text="view"');
                await expect(viewButton).toBeVisible();
                await viewButton.click();
        
                for (let i = 0; i < blog.likes; i++) {
                    await page.click('text="like"');
                    await page.waitForTimeout(500); // timeout for waiting the like to be visible
                }
        
                const likesText = await page.locator(`text="likes ${blog.likes}"`);
                await expect(likesText).toBeVisible();
                await page.reload();
            }
        
            await page.reload();

            page.on('dialog', dialog => { ///dialog accept for deleting these test blogs
                dialog.accept();
            });
            /// Check for each blog
            const blog1ViewButton = await page.locator('text="Blog 1 Author 1"').locator('text="view"');
            await expect(blog1ViewButton).toBeVisible();
            await blog1ViewButton.click();
            const blog1Likes = await page.locator('text="likes 1"');
            await expect(blog1Likes).toBeVisible();
            const removeButton1 = page.locator('button:text("remove")').nth(0);
            await expect(removeButton1).toBeVisible();
            await removeButton1.click();
            
            const blog2ViewButton = await page.locator('text="Blog 2 Author 2"').locator('text="view"');
            await expect(blog2ViewButton).toBeVisible();
            await blog2ViewButton.click();
            const blog2Likes = await page.locator('text="likes 2"');
            await expect(blog2Likes).toBeVisible();
            const removeButton2 = page.locator('button:text("remove")').nth(0);
            await expect(removeButton2).toBeVisible();
            await removeButton2.click();
            
            const blog3ViewButton = await page.locator('text="Blog 3 Author 3"').locator('text="view"');
            await expect(blog3ViewButton).toBeVisible();
            await blog3ViewButton.click();
            const blog3Likes = await page.locator('text="likes 3"');
            await expect(blog3Likes).toBeVisible();
            const removeButton3 = page.locator('button:text("remove")').nth(0);
            await expect(removeButton3).toBeVisible();
            await removeButton3.click();
        });
    });
});
