#!/usr/bin/env node

import * as assert from 'node:assert'

import {readContacts as contacts} from '../index.js'

const successMock = (new URL('success-mock', import.meta.url)).pathname
console.info('platform:', process.platform)

assert.throws(() => contacts(successMock), {
	name: 'Error',
	message: /^Unsupported platform/i,
})
