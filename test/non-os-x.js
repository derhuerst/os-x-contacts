#!/usr/bin/env node
'use strict'

const path = require('path')
const assert = require('assert')

const contacts = require('..')

const successMock = path.join(__dirname, 'success-mock')
console.info('platform:', process.platform)



assert.throws(() => contacts(successMock))
try { contacts(successMock) }
catch (e) {
	const expected = 'Unsupported platform'
	assert.strictEqual(e.message.slice(0, expected.length), expected)
}
