'use strict'

const path = require('path')
const process = require('child_process')
const ndjson = require('ndjson')
const sink = require('stream-sink')



const executable = path.join(__dirname, 'contacts-cli')

const contacts = (file = executable) => {
	const stdout = ndjson()
	const stderr = sink()

	const p = process.spawn(file)
	p.stderr.pipe(stderr)
	p.stdout.pipe(stdout)

	stderr.then((msg) => {
		if (msg) stdout.emit('error', new Error(msg))
	})
	return stdout
}

module.exports = contacts
