# *os-x-contacts*

**Query all [macOS *Address Book*](https://support.apple.com/en-us/HT201728) contacts.** Uses [`contacts-cli`](https://github.com/pepebecker/contacts-cli) under the hood.

[![npm version](https://img.shields.io/npm/v/os-x-contacts.svg)](https://www.npmjs.com/package/os-x-contacts)
[![build status](https://img.shields.io/travis/derhuerst/os-x-contacts.svg)](https://travis-ci.org/derhuerst/os-x-contacts)
[![dependency status](https://img.shields.io/david/derhuerst/os-x-contacts.svg)](https://david-dm.org/derhuerst/os-x-contacts)
[![dev dependency status](https://img.shields.io/david/dev/derhuerst/os-x-contacts.svg)](https://david-dm.org/derhuerst/os-x-contacts#info=devDependencies)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/os-x-contacts.svg)
[![chat on gitter](https://badges.gitter.im/derhuerst.svg)](https://gitter.im/derhuerst)
[![support me on Patreon](https://img.shields.io/badge/support%20me-on%20patreon-fa7664.svg)](https://patreon.com/derhuerst)


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

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/derhuerst/os-x-contacts/issues).
