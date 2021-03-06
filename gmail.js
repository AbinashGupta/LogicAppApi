const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

// If modifying these scopes, delete credentials.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_PATH = 'credentials.json';
let mailResponse = false;

getMailResponse = new Promise((resolve, reject) => {
    // Load client secrets from a local file.
  fs.readFile('client_secret.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content), fetchReply);
  });

  /**
   * Create an OAuth2 client with the given credentials, and then execute the
   * given callback function.
   * @param {Object} credentials The authorization client credentials.
   * @param {function} callback The callback to call with the authorized client.
   */
  function authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getNewToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    });
  }

  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback for the authorized client.
   */
  function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) {
          return callback(err);
        }
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
        callback(oAuth2Client);
      });
    });
  }

  /**
   * Lists the labels in the user's account.
   *
   * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
   */

  function fetchReply(auth) {
    const userId = "me";
    const query = "subject:(Re: New message pushed server)";
    const callback = (result) => {
      console.log(result)
    }

    listMessages(userId, query, callback, auth)
  }

  function listMessages(userId, query, callback, auth) {
    const gmail = google.gmail({version: 'v1', auth});
    gmail.users.messages.list({
      'userId': userId,
      'q': query,
      'maxResults': 10
    }, (err, {data}) => {
      if (err) return console.log('The API returned an error: ' + err);
      const messages = data.messages;
      if (messages) {
        messages.forEach((message) => {
          console.log("Message Data")
          gmail.users.threads.get({
            'userId': userId,
            'id': message.threadId
          }, (err, {data}) => {
            if (err) return console.log('The API returned an error: ' + err);
            console.log(data.messages[0].snippet);
            if (data.messages[0].snippet.match(/yes/i)) {
              mailResponse = true;
              resolve(mailResponse);
            }
            else {
              resolve(mailResponse);
            }
          })
        })
      } 
      else {
        console.log('No messages found.');
        resolve(mailResponse);
      }

    })
  }

  // function listLabels(auth) {
  //   const gmail = google.gmail({version: 'v1', auth});
  //   gmail.users.labels.list({
  //     userId: 'me',
  //   }, (err, {data}) => {
  //     if (err) return console.log('The API returned an error: ' + err);
  //     const labels = data.labels;
  //     if (labels.length) {
  //       console.log('Labels:');
  //       labels.forEach((label) => {
  //         console.log(`- ${label.name}`);
  //       });
  //     } else {
  //       console.log('No labels found.');
  //     }
  //   });
  // }
})

module.exports = {
    getMailResponse: getMailResponse
}