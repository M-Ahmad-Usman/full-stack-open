import { render, screen } from '@testing-library/react'
import NoteForm from './NoteForm'
import userEvent from '@testing-library/user-event'

test('<NoteForm /> updates parent state and calls onSubmit', async () => {
  const createNote = vi.fn()
  const user = userEvent.setup()

  render(<NoteForm createNote={createNote} />)

  /*
    This wouldn't work if the component has multiple textboxes
    We can user getAllByRole which will return an array of all inputs.
    This approach isn't good as it depends on the order of inputs.
  */
  // const input = screen.getByRole('textbox')

  // The more easy option would be to call by label text
  const input = screen.getByLabelText('content')
  const sendButton = screen.getByText('save')

  await user.type(input, 'testing a form...')
  await user.click(sendButton)

  // console.log(createNote.mock.calls)
  /* Expected output:
  [
    [ { content: 'testing a form...' } ]
  ]
  */

  // console.log(createNote)

  expect(createNote.mock.calls).toHaveLength(1)
  expect(createNote.mock.calls[0][0].content).toBe('testing a form...')
})