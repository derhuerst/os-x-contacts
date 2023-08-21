# *os-x-contacts*

**Query all [macOS *Address Book*](https://support.apple.com/en-us/HT201728) contacts.** Uses [`contacts-cli`](https://github.com/pepebecker/contacts-cli) under the hood.

[![npm version](https://img.shields.io/npm/v/os-x-contacts.svg)](https://www.npmjs.com/package/os-x-contacts)
[![build status](https://img.shields.io/travis/derhuerst/os-x-contacts.svg)](https://travis-ci.org/derhuerst/os-x-contacts)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/os-x-contacts.svg)
![minimum Node.js version](https://img.shields.io/node/v/os-x-contacts.svg)
[![support me via GitHub Sponsors](https://img.shields.io/badge/support%20me-donate-fa7664.svg)](https://github.com/sponsors/derhuerst)
[![chat with me on Twitter](https://img.shields.io/badge/chat%20with%20me-on%20Twitter-1da1f2.svg)](https://twitter.com/derhuerst)


## Installing

```shell
npm install os-x-contacts
```


## Usage

Returns a [readable stream](https://nodejs.org/api/stream.html#stream_class_stream_readable) in [object mode](https://nodejs.org/api/stream.html#stream_object_mode).

```js
const contacts = require('os-x-contacts')

contacts()
.on('data', console.log)
.on('error', console.error)
```

```js
{
  lastName: 'Appleseed', firstName: 'John',
  phones: [ { label: 'mobile', value: '+49123456789' } ],
  emails: [ { label: 'home', value: 'john.appleseed@example.org' } ]
}
{
  lastName: 'Appleseed', firstName: 'Jane',
  phones: [ { label: 'mobile', value: '+49123456789' } ],
  emails: [ { label: 'home', value: 'jane.appleseed@example.org' } ]
}
```


## Contributing

If you have a question or need support using `os-x-contacts`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, use [the issues page](https://github.com/derhuerst/os-x-contacts/issues).
