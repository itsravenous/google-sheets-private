# @itsravenous/google-sheets-private
Simple package for reading and writing to private Google sheets with no user interaction, using a service account.

## Motivation
The [Sheets documentation](https://developers.google.com/sheets/) is mainly focused on accessing private sheets using Oauth2 with user interaction (i.e. being redirected to a page to allow access). I wanted to have my server application write directly to a sheet, which precludes user interaction. There _is_ good documentation about [using service accounts](https://developers.google.com/identity/protocols/oauth2/service-account) to do this, but it was a little tricky to find and the process is a little involved, so this module helps avoid that if you just want some basic functionality.

## Usage
Download your service account details and credentials (client id and secret) JSON files from your Google console. Let's call these `service-account.json` and `credentials.json`.

```js
const { fetchSheet, appendToSheet } = require('@itsravenous/google-sheets-private');
const serviceAccount = require('./service-account.json');
const credentials = require('./credentials.json');

// Get all rows from sheet
fetchSheet({
  sheetId: 'your-sheet-id-here',
  sheetName: 'German nouns',
  serviceAccount,
  credentials
}).then(rows => {
  console.log(rows)
});

// Append a row to sheet
appendToSheet({
  sheetId: 'your-sheet-id-here',
  sheetName: 'German nouns',
  serviceAccount,
  credentials,
  data: ['potato', 'kartoffel']
});
```

## TODO
- Ability to update rows using the first cell as a key
