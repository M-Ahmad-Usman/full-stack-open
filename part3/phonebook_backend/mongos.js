
const mongoose = require('mongoose')

if (process.argv.length < 3) {
	console.log('Password is required as argument')
	process.exit(1)
}

const urlEncodedPassword = encodeURIComponent(process.argv[2])
const url = `mongodb+srv://ahmad_admin:${urlEncodedPassword}@full-stack-open-cluster.brcbh9o.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Full-Stack-Open-Cluster`;

mongoose.set('strictQuery', false)


const personSchema = new mongoose.Schema({
	name: String,
	number: String
})

const Person = mongoose.model('Person', personSchema)

console.log('Connecting to MongoDB')

mongoose.connect(url)
	.then(() => {
		console.log("Connected to MongoDB successfuly")

		if (process.argv.length === 3) {
			Person
				.find({})
				.then(people => {
					people.forEach(person => {
						console.log(person)
					})
				})
		}
		else if (process.argv.length === 5) {

			const name = process.argv[3]
			const number = process.argv[4]

			const person = new Person({
				name,
				number
			})

			person
				.save()
				.then(res => console.log(`added ${name} number ${number} to phonebook`))
		}


	})
	.catch(err => console.log(err.message))