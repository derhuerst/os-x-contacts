'use strict'

const {get} = require('https')
const {parse: parseUrl} = require('url')
const {ok} = require('assert')
const {createWriteStream} = require('fs')
const {join: pathJoin} = require('path')
const pkg = require('./package.json')

const USER_AGENT = `${pkg.name} v${pkg.version}`
const RELEASE_URL = `\
https://api.github.com/repos/pepebecker/contacts-cli/releases/4811892`

const dest = pathJoin(__dirname, process.argv[2])

const headers = process.env.GITHUB_TOKEN ? {
	Authorization: 'token ' + process.env.GITHUB_TOKEN
} : {}

const pGet = (...args) => {
	return new Promise((resolve, reject) => {
		get(...args, resolve)
		.once('error', reject)
	})
}

const readJsonBody = (res) => {
	return new Promise((resolve, reject) => {
		res.once('error', reject)
		let body = ''
		res.on('data', (chunk) => body += chunk)
		res.once('end', () => {
			try {
				resolve(JSON.parse(body))
			} catch (err) {
				reject(err)
			}
		})
	})
}

const poorMansFetch = (url, opt = {}, nrOfRedirects = 0) => {
	ok(nrOfRedirects < 10, 'too many redirects')

	const _url = parseUrl(url)
	return pGet({
		protocol: _url.protocol,
		hostname: _url.hostname,
		port: _url.port,
		path: _url.path,
		headers: Object.assign({
			'User-Agent': USER_AGENT,
		}, opt.headers || {}),
	})
	.then((res) => {
		if (res.statusCode === 301 || res.statusCode === 302) {
			const newUrl = res.headers['location']
			return poorMansFetch(newUrl, opt, nrOfRedirects + 1)
		}
		if (res.statusCode !== 200) {
			const err = new Error(`request to ${res.url} failed: ${res.statusCode} ${res.statusMessage}`)
			err.res = res
			throw err
		}

		return res
	})
}

const poorMansPipeline = (src, dest) => {
	return new Promise((resolve, reject) => {
		src
		.once('error', reject)
		.pipe(dest)
		.once('error', reject)
		.once('finish', () => resolve())
	})
}

poorMansFetch(RELEASE_URL, {
	headers: {
		'Accept': 'application/json',
	},
})
.then((res) => {
	const cType = res.headers['content-type']
	if (cType !== 'application/json; charset=utf-8') {
		const err = new Error(`${res.url} responded with an invalid content-type: ${cType}`)
		err.res = res
		throw err
	}

	res.setEncoding('utf8')
	return readJsonBody(res)
})
.then((body) => {
	const asset = body.assets.find((asset) => asset.name === 'contacts-cli')
	ok(asset, 'contacts-cli asset not found')
	return poorMansFetch(asset.browser_download_url)
})
.then((res) => {
	return poorMansPipeline(
		res,
		createWriteStream(dest)
	)
})
.catch((err) => {
	console.error(err)
	process.exit(1)
})
