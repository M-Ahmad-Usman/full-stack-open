import { render, screen } from '@testing-library/react'
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