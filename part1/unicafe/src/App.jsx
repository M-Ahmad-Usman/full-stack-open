import { useState } from 'react'

const Statistics = props => {

	const { all, average, positive } = props;

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

			<Statistics 
				all={good + neutral + bad} 
				average={(good * FEEDBACK_VALUES.GOOD + bad * FEEDBACK_VALUES.BAD) / (good + neutral + bad)}
				positive={(good * FEEDBACK_VALUES.GOOD / (good + neutral + bad)) * 100}
			/>
		</div>
	)
}

export default App