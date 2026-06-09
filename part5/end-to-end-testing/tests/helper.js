
const createUser = async (request, user) => {
  await request.post('/api/users', { data: user })
}

const loginUser = async (page, user) => {
  // fill in the login form
  await page.getByLabel('username').fill(user.username)
  await page.getByLabel('password').fill(user.password)

  // On successful login, user will be redirected to '/'
  await page.getByRole('button', { name: 'Login' }).click()
}

const createBlog = async (page, blog) => {
  // fill in the form with blog data
  await page.getByLabel('Title').fill(blog.title)
  await page.getByLabel('Author').fill(blog.author)
  await page.getByLabel('URL').fill(blog.URL)

  // On successful blog creation, page will be redirected to '/'
  await page.getByRole('button', { name: 'Add Blog' }).click()

  // Wait for the blog to be rendered
  // await page.getByRole('link', { name: blog.title }).waitFor()
}

const likeBlog = async (page, blog) => {
  const blogElement = await page.getByText(blog.title)

  await blogElement.getByRole('button', { name: 'view' }).click()
  await blogElement.getByRole('button', { name: 'like' }).click()

  await blogElement.getByRole('button', { name: 'hide' }).click()

}

const generateBlog = (blog = {}) => {
  return {
    title: `Test Blog ${Date.now()}`,
    author: 'Test Author',
    URL: 'https://bloglist.com',
    ...blog
  }
}

const generateUser = (user = {}) => {
  return {
    name: 'Test User',
    username: `test_user_${Date.now()}`,
    password: 'password123',
    ...user
  }
}

const helper = {
  loginUser,
  createBlog,
  createUser,
  likeBlog,
  generateBlog,
  generateUser
}

module.exports = helper