'use strict'

const {ok} = require('assert')
const {Writable} = require('node:stream')
const {createWriteStream} = require('fs')
const {join: pathJoin} = require('path')
const pkg = require('./package.json')

const USER_AGENT = `${pkg.name} v${pkg.version}`
const RELEASE_URL = `\
https://api.github.com/repos/pepebecker/contacts-cli/releases/4811892`

const dest = pathJoin(__dirname, process.argv[2])

const headers = {
	'User-Agent': USER_AGENT,
	...(process.env.GITHUB_TOKEN ? {
		Authorization: 'token ' + process.env.GITHUB_TOKEN,
	} : {}),
}

;(async () => {
	const res = await fetch(RELEASE_URL, {
		redirect: 'follow',
		headers: {
			...headers,
			'Accept': 'application/json',
		},
	})
	if (!res.ok) {
		const err = new Error(`${res.url}: ${res.status} ${res.statusText}`)
		err.res = res
		throw err
	}

	const cType = res.headers.get('content-type')
	if (cType !== 'application/json; charset=utf-8') {
		const err = new Error(`${res.url} responded with an invalid content-type: ${cType}`)
		err.res = res
		throw err
	}

	const assetsBody = await res.json()
	const asset = assetsBody.assets.find((asset) => asset.name === 'contacts-cli')
		ok(asset, 'contacts-cli asset not found')

	const assetRes = await fetch(asset.browser_download_url, {
		redirect: 'follow',
		headers,
	})
	if (!assetRes.ok) {
		const err = new Error(`${assetRes.url}: ${assetRes.status} ${assetRes.statusText}`)
		err.res = assetRes
		throw err
	}

	await assetRes.body.pipeTo(Writable.toWeb(createWriteStream(dest)))
})()
.catch((err) => {
	console.error(err)
	process.exit(1)
})
