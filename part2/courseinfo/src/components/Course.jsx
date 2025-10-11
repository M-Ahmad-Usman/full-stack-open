
const Header = (props) => {

	const { course } = props

	return <h2>{course}</h2>
}

const Part = (props) => {

	const { name, exercises } = props

	return <p>{name} {exercises}</p>
}

const Content = (props) => {

	const { parts } = props;

	return parts
		.map(
			({ id, name, exercises }) =>
				<Part key={id} name={name} exercises={exercises}></Part>
		)
}

const Total = (props) => {

	const { parts } = props;
	const totalExercises = parts.reduce((accum, curr) => accum + curr.exercises, 0);

	return <p><b>total of {totalExercises} exercises </b></p>
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

export default Course