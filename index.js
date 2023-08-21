import child from 'node:child_process'
import {parse as ndjson} from 'ndjson'
import sink from 'stream-sink'

const executable = (new URL('contacts-cli', import.meta.url)).pathname

const readContacts = (file = executable) => {
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

export {
	readContacts,
}
