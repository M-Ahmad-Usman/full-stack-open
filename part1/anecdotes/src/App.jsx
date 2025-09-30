import { useState } from 'react'

const App = () => {

  const data = [
    { anecdote: 'If it hurts, do it more often.', votes: 0 },
    { anecdote: 'Adding manpower to a late software project makes it later!', votes: 0 },
    { anecdote: 'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.', votes: 0 },
    { anecdote: 'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.', votes: 0 },
    { anecdote: 'Premature optimization is the root of all evil.', votes: 0 },
    { anecdote: 'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.', votes: 0 },
    { anecdote: 'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.', votes: 0 },
    { anecdote: 'The only way to go fast, is to go well.', votes: 0 }
  ]

  function setNextAnecdote() {
    const randomIndex = Math.floor(Math.random() * anecdotes.length);
    setSelected(randomIndex);
  }

  function updateVotes() {

    const copy = [...anecdotes];
    copy[selected].votes++;
    setAnecdotes(copy);

    if (copy[selected].votes > mostVotedAnecdote.votes)
      setMostVotedAnecdote(copy[selected]);

  }

  const [selected, setSelected] = useState(0)
  const [anecdotes, setAnecdotes] = useState(data);
  const [mostVotedAnecdote, setMostVotedAnecdote] = useState(anecdotes[0])

  return (
    <div>
      <h2>Anecdote of the day</h2>
      <p>{anecdotes[selected].anecdote}</p>
      <p>Has {anecdotes[selected].votes} votes</p>
      <button onClick={updateVotes}>Vote</button>
      <button onClick={setNextAnecdote}>Next Anecdote</button>

      <h2>Anecdote with most votes</h2>

      <p>{mostVotedAnecdote.anecdote}</p>
      <p>Has {mostVotedAnecdote.votes} votes</p>
    </div>
  )
}

export default App