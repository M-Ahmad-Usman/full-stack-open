import { useState } from 'react'

const App = () => {
	// save clicks of each button to its own state
	const [good, setGood] = useState(0)
	const [neutral, setNeutral] = useState(0)
	const [bad, setBad] = useState(0)

	const FEEDBACK_VALUES = {
		GOOD: 1,
		NEUTRAL: 0,
		BAD: -1
	}

	return (
		<div>
			<h1>Give Feedback</h1>

			<button onClick={() => setGood(good + 1)}>Good</button>
			<button onClick={() => setNeutral(neutral + 1)}>Neutral</button>
			<button onClick={() => setBad(bad + 1)}>Bad</button>

			<h2>Statistics</h2>

			<p>Good: {good}</p>
			<p>Neutral: {neutral}</p>
			<p>Bad: {bad}</p>

			<p>All: {good + neutral + bad}</p>
			<p>Average: {(good * FEEDBACK_VALUES.GOOD + bad * FEEDBACK_VALUES.BAD) / (good + neutral + bad)}</p>
			<p>Positive: {(good * FEEDBACK_VALUES.GOOD / (good + neutral + bad)) * 100} %</p>
		</div>
	)
}

export default App