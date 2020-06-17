const { google } = require("googleapis");
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

//create a temporary auth token using JWT, reading from the service account config
async function authorize({ serviceAccount, credentials }) {
  const { client_secret, client_id } = credentials.installed;

  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    "postmessage"
  );

  const jwt = new google.auth.JWT(
    serviceAccount.client_email,
    null,
    serviceAccount.private_key,
    SCOPES
  );

  const tokens = await jwt.authorize();
  oAuth2Client.setCredentials({
    access_token: tokens.access_token
  });
  return oAuth2Client;
}

function authFetchSheet({ auth, sheetId, sheetName }) {
  const sheets = google.sheets({ version: "v4", auth });
  return sheets.spreadsheets.values
    .get({
      spreadsheetId: sheetId,
      range: sheetName
    })
    .then(res => {
      return res.data.values;
    });
}

function authAppendToSheet({ auth, sheetId, sheetName, data }) {
  const sheets = google.sheets({ version: "v4", auth });
  return sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: sheetName,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    resource: {
      values: [data]
    },
    auth: auth
  });
}

const fetchSheet = async ({
  serviceAccount,
  credentials,
  sheetId,
  sheetName
}) => {
  const auth = await authorize({ serviceAccount, credentials });
  return authFetchSheet({ auth, sheetId, sheetName });
};

const appendToSheet = async ({
  serviceAccount,
  credentials,
  sheetId,
  sheetName,
  data
}) => {
  const auth = await authorize({ serviceAccount, credentials });
  return authAppendToSheet({ auth, sheetId, sheetName, data });
};

exports.fetchSheet = fetchSheet;
exports.appendToSheet = appendToSheet;
