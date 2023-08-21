import {createRequire} from 'node:module'
const require = createRequire(import.meta.url)

import {ok} from 'node:assert'
import {Writable} from 'node:stream'
import {createWriteStream} from 'node:fs'
const pkg = require('./package.json')

const USER_AGENT = `${pkg.name} v${pkg.version}`
const RELEASE_URL = `\
https://api.github.com/repos/pepebecker/contacts-cli/releases/4811892`

const dest = (new URL(process.argv[2], import.meta.url)).pathname

const headers = {
	'User-Agent': USER_AGENT,
	...(process.env.GITHUB_TOKEN ? {
		Authorization: 'token ' + process.env.GITHUB_TOKEN,
	} : {}),
}

{
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
}
