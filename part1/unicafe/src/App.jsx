import { useState } from 'react'

const Statistics = props => {

	const { good, neutral, bad } = props;

	const FEEDBACK_SCORES = {
		GOOD: 1,
		NEUTRAL: 0,
		BAD: -1
	}

	const totalFeedbacks = good + neutral + bad;

	const all = totalFeedbacks;
	const average = (good * FEEDBACK_SCORES.GOOD + bad * FEEDBACK_SCORES.BAD) / totalFeedbacks;
	const positive = (good * FEEDBACK_SCORES.GOOD / totalFeedbacks) * 100;

	return (
		<>
			<p>All: {all}</p>
			<p>Average: { Number.isNaN(average)? 0: average }</p>
			<p>Positive: { Number.isNaN(positive)? 0: positive }%</p>
		</>
	)
}

const App = () => {
	// save clicks of each button to its own state
	const [good, setGood] = useState(0)
	const [neutral, setNeutral] = useState(0)
	const [bad, setBad] = useState(0)

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

			<Statistics good={good} neutral={neutral} bad={bad} />
		</div>
	)
}

export default App