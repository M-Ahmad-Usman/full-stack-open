import { useState } from 'react'

const StatisticLine = props => {

	const { text, value } = props;

	return (
		<tr>
			<td>{text}:</td>
			<td> {value} {text === "Positive" && "%"} </td>
		</tr>
	)
}

const Statistics = props => {

	const { good, neutral, bad } = props;

	const FEEDBACK_SCORES = {
		GOOD: 1,
		NEUTRAL: 0,
		BAD: -1
	}

	const totalFeedbacks = good + neutral + bad;

	if (totalFeedbacks === 0) {
		return (
			<>
				<h2>Statistics</h2>
				<p>No Feedback Given</p>
			</>
		)
	}

	const all = totalFeedbacks;
	const average = (good * FEEDBACK_SCORES.GOOD + bad * FEEDBACK_SCORES.BAD) / totalFeedbacks;
	const positive = (good * FEEDBACK_SCORES.GOOD / totalFeedbacks) * 100;

	return (
		<>
			<h2>Statistics</h2>

			<table>
				<tbody>

					<StatisticLine text="Good" value={good} />
					<StatisticLine text="Neutral" value={neutral} />
					<StatisticLine text="Bad" value={bad} />

					<StatisticLine text="All" value={all} />
					<StatisticLine text="Average" value={average} />
					<StatisticLine text="Positive" value={positive} />

				</tbody>
			</table>
		</>
	)
}

const Button = props => {
	const { submitHandler, text } = props;

	return <button onClick={submitHandler}> {text} </button>
}

const App = () => {
	// save clicks of each button to its own state
	const [good, setGood] = useState(0)
	const [neutral, setNeutral] = useState(0)
	const [bad, setBad] = useState(0)

	const updateGood = () => setGood(good + 1)
	const updateNeutral = () => setNeutral(neutral + 1)
	const updateBad = () => setBad(bad + 1)

	return (
		<div>
			<h1>Give Feedback</h1>

			<Button submitHandler={updateGood} text="Good" />
			<Button submitHandler={updateNeutral} text="Neutral" />
			<Button submitHandler={updateBad} text="Back" />

			<Statistics good={good} neutral={neutral} bad={bad} />
		</div>
	)
}

export default App