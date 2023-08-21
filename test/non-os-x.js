#!/usr/bin/env node
'use strict'

const path = require('path')
const assert = require('assert')

const contacts = require('..')

const successMock = path.join(__dirname, 'success-mock')
console.info('platform:', process.platform)

assert.throws(() => contacts(successMock), {
	name: 'Error',
	message: /^Unsupported platform/i,
})
