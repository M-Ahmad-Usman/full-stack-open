import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Note from './Note'

test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  render(<Note note={note} />)

  // getByText by default searches for an element that contains only the text provided as a parameter and nothing else.
  // If an element has some additional text then getByText will fail to find it.
  const element = screen.getByText('Component testing is done with react-testing-library')
  // Other options
  // 1. We can provide an additional option like screen.getByText('text', { exact: false }) to perform a partial match.
  // const element = screen.getByText('text', { exact: false })

  // 2. We can use findByText. It is important to notice that, unlike the other ByText methods, findByText returns a promise!
  // const element = await screen.findByText('text')
  expect(element).toBeDefined()
})

/*
  There is another queryByText method.
  It returns the element but it does not cause an exception if it is not found.
  We could eg. use the method to ensure that something is not rendered to the component.
*/
test('does not render this', () => {
  const note = {
    content: 'This is a reminder',
    important: true
  }

  render(<Note note={note} />)

  const element = screen.queryByText('do not want this thing to be rendered')
  expect(element).toBeNull()
})

/*
  Other methods
  1. getByTestId: searches for elements based on id fields specifically created for testing purposes.
  2. We could also use CSS-selectors to find rendered elements by using the method querySelector of the object container that is one of the fields returned by the render.
*/
/* Recommendation
  It is recommended to search for elements primarily using methods other than the container object and CSS selectors.
  CSS attributes can often be changed without affecting the application's functionality, and users are not aware of them.
  It is better to search for elements based on properties visible to the user, for example, by using the getByText method.
  This way, the tests better simulate the actual nature of the component and how a user would find the element on the screen.
*/
test('renders content using css attributes', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  const { container } = render(<Note note={note} />)
  const div = container.querySelector('.note')
  expect(div).toHaveTextContent('Component testing is done with react-testing-library')

})

test('clicking the button calls event handler once', async () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  // Define event handler as a mock function created using vite.
  const mockHandler = vi.fn()
  render(
    <Note note={note} toggleImportance={mockHandler} />
  )

  // Start session to simulate user events.
  const user = userEvent.setup()
  const button = screen.getByText('make not important')
  await user.click(button)
  // mock.calls is an array that contains data about each call that the mock function has received.
  // toHaveLength(1) ensures that the mock function has been called exactly once.
  expect(mockHandler.mock.calls).toHaveLength(1)})