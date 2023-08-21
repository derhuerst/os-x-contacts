#!/usr/bin/env node

import * as assert from 'node:assert'
import {isTransformStream} from 'is-stream'
import sink from 'stream-sink'

import {readContacts as contacts} from '../index.js'

const showError = (err) => {
	console.error(err.stack)
	process.exit(1)
	throw err
}

const successMock = (new URL('success-mock', import.meta.url)).pathname
const failureMock = (new URL('failure-mock', import.meta.url)).pathname

assert.ok(isTransformStream(contacts(successMock)), 'not a transform stream')
assert.strictEqual(contacts(successMock)._readableState.objectMode, true, 'not in objectMode')

contacts(successMock).pipe(sink('object'))
.then((data) => assert.deepStrictEqual(data, [
	{firstName: 'Jane', lastName: 'Doe'},
	{firstName: 'John', lastName: 'Doe'}
]))
.catch(showError)

contacts(failureMock)
.once('error', (msg) => assert.strictEqual('Some error happened.\n', msg.message))
