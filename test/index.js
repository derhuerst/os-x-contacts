#!/usr/bin/env node
'use strict'

const path = require('path')
const assert = require('assert')
const isStream = require('is-stream')
const sink = require('stream-sink')

const contacts = require('..')

const showError = (err) => {
	console.error(err.stack)
	process.exit(1)
	throw err
}

const successMock = path.join(__dirname, 'success-mock')
const failureMock = path.join(__dirname, 'failure-mock')



assert(isStream.transform(contacts(successMock)), 'not a transform stream')
assert.strictEqual(contacts(successMock)._readableState.objectMode, true, 'not in objectMode')

contacts(successMock).pipe(sink('object'))
.then((data) => assert.deepStrictEqual(data, [
	{firstName: 'Jane', lastName: 'Doe'},
	{firstName: 'John', lastName: 'Doe'}
]))
.catch(showError)

contacts(failureMock)
.once('error', (msg) => assert.strictEqual('Some error happened.\n', msg.message))
