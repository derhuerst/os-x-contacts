'use strict'

const got = require('got')
const fs = require('fs')
const path = require('path')

got('https://api.github.com/repos/pepebecker/contacts-cli/releases/latest', {json: true})
.then((res) => res.body.assets.find((asset) => asset.name === 'contacts-cli').browser_download_url)
.then((url) => new Promise((yay, nay) => {
	got.stream(url)
	.once('error', nay)
	.pipe(fs.createWriteStream(path.join(__dirname, 'contacts-cli'), {mode: 755}))
	.once('error', nay)
	.once('finish', () => yay())
}))
.catch((err) => {
	console.error(err.message)
	process.exit(1)
})
