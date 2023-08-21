'use strict'

const got = require('got')
const fs = require('fs')
const path = require('path')

const dest = path.join(__dirname, process.argv[2])

const headers = process.env.GITHUB_TOKEN ? {
	Authorization: 'token ' + process.env.GITHUB_TOKEN
} : {}

got('https://api.github.com/repos/pepebecker/contacts-cli/releases/4811892', {json: true, headers})
.then((res) => res.body.assets.find((asset) => asset.name === 'contacts-cli').browser_download_url)
.then((url) => new Promise((yay, nay) => {
	got.stream(url)
	.once('error', nay)
	.pipe(fs.createWriteStream(dest))
	.once('error', nay)
	.once('finish', () => yay())
}))
.catch((err) => {
	console.error(err)
	process.exit(1)
})
