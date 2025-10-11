
const Header = (props) => {

	const { course } = props

	return <h1>{course}</h1>
}

const Part = (props) => {

	const { name, exercises } = props

	return <p>{name} {exercises}</p>
}

const Content = (props) => {

	const { parts } = props;

	return parts.map(part => <Part key={part.id} name={part.name} exercises={part.exercises}></Part>)
}

const Total = (props) => {

	const { parts } = props;

	return <p>Number of exercises {parts.reduce((accum, curr) => accum + curr.exercises, 0)}</p>
}

const Course = (props) => {
	const { course } = props

	return (
		<>
			<Header course={course.name} />
			<Content parts={course.parts} />
			<Total parts={course.parts} />
		</>
	)

}

const App = () => {

	const course = {
		id: 1,
		name: 'Half Stack application development',
		parts: [
			{
				name: 'Fundamentals of React',
				exercises: 10,
				id: 1
			},
			{
				name: 'Using props to pass data',
				exercises: 7,
				id: 2
			},
			{
				name: 'State of a component',
				exercises: 14,
				id: 3
			}
		]
	}

	return <Course course={course} />
}

export default App