'use strict'

const path = require('path')
const child = require('child_process')
const ndjson = require('ndjson')
const sink = require('stream-sink')



const executable = path.join(__dirname, 'contacts-cli')

const contacts = (file = executable) => {
	if (process.platform !== 'darwin')
		throw new Error(`Unsupported platform ${process.platform}.`)

	const stdout = ndjson()
	const stderr = sink()

	const p = child.spawn(file)
	p.stderr.pipe(stderr)
	p.stdout.pipe(stdout)

	stderr.then((msg) => {
		if (msg) stdout.emit('error', new Error(msg))
	})
	return stdout
}

module.exports = contacts
