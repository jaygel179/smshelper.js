[![Build Status](https://travis-ci.org/jaygel179/smshelper.js.svg?branch=master)](https://travis-ci.org/jaygel179/smshelper.js)

SMS Helper
==========
SMS tool that can help you properly count the length of an SMS, calculate the part and what encoding it is.


Installation
------------
`$ npm install smshelper`


Supports
--------
- Node


Requirements
------------
- None


Usage
-----
```javascript
const SMSHelper = require('smshelper')

SMSHelper.count('Sample message.')
// 15
SMSHelper.parts('Sample message.')
// 1
SMSHelper.detect_encoding('Sample message.')
// 'GSM_7BIT'
```


Test
-------------
`$ npm test`


Original Idea
-------------
[danxexe/sms-counter](https://github.com/danxexe/sms-counter)



License
-------
MIT licensed. See the bundled [LICENSE](LICENSE) file for more details.
