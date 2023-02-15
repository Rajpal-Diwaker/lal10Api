const knex = require("../db/knex");
const util = require("../Utilities/util");
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const cron = require('node-cron');
const gmail = google.gmail('v1');
const SCOPES = ['https://mail.google.com/'];   // full access to gmail

const DIR = __dirname;
const CREDENTIALS_PATH = DIR+'/credentials.json';
const TOKEN_PATH = DIR+'/token.json';

// read step to configure gmail to node js
// https://www.fullstacklabs.co/blog/access-mailbox-using-gmail-node

const emailSync = util.errHandler(async (req, res) => {

    code = util.statusCode.OK
    message = util.statusMessage.SUCCESS

    fs.readFile(CREDENTIALS_PATH,async (err, content) =>   {
       if (err) return console.log('Error loading client secret file:', err);
        authorize(JSON.parse(content), displayInbox);
        res.send({ code, message});
        await saveEmailEnquiries();
      });
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
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
        callback(oAuth2Client);
      });
    });
  }


/**
 * Get the recent email from your Gmail account
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */

function displayInbox(auth) {
    let request = gmail.users.messages.list({auth: auth,
      'userId': 'me',
      'labelIds': 'INBOX',
      // 'maxResults': 2
    }, async function(err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }
        let result=response['data']['messages'];
        console.log("result===",result)
        let dt= await saveData(result,auth);
        console.log("dt===",dt)
        return ;
      })
  }


async function saveData(result2,auth){

return new Promise((resolve, reject) => {
  let itemsProcessed = 0;
  result2.forEach((element, i) => {

    gmail.users.messages.get({auth: auth, userId: 'me', 'id': element.id}, async function( err, response ) {
      if (err) {
          console.log('The API returned an error: ' + err);
          return;
      }

      let body,subject,fromEmail;

        //  header=response['data']['payload']['headers'];
        //  headerJson = JSON.stringify(header);
        //  headerJson = headerJson.replace("'", "");
        //  headerJson = headerJson.replace(/'/g,"");

        // console.log("-<>><<",response['data']['payload']['parts'][0]['body']['data'])

      if(response['data']['payload']['parts']){

        body = new Buffer.from(response['data']['payload']['parts'][0]['body']['data'], 'base64');
        body = body.toString()

        console.log("parts->><<0",body)

        body = body.replace(/'/g,"");
        body = body.replace("'","");
        body = body.replace( /(<([^>]+)>)/ig, '').replace(/\n\s*\n/g, '\n');
        body=  body.replace(/<style.*<\/style>/g, '').replace( /(<([^>]+)>)/ig, '').replace(/\n\s*\n/g, '\n')
      }else{
        body = new Buffer.from(response['data']['payload']['body']['data'],'base64');
        body=body.toString()

        console.log("single data ",body)
        body = body.replace(/'/g,"");
        body = body.replace("'","");
        body = body.replace( /(<([^>]+)>)/ig, '').replace(/\n\s*\n/g, '\n');
        body=  body.replace(/<style.*<\/style>/g, '').replace( /(<([^>]+)>)/ig, '').replace(/\n\s*\n/g, '\n')

      }

      let abc=response['data']['payload']['headers'];

        for(i=0;i<abc.length;i++){

            if(abc[i].name==="Subject")
              subject=abc[i].value;

            if(abc[i].name==="From")
              fromEmail=abc[i].value
        }

      try{
          itemsProcessed++;
        let sql=`INSERT INTO email_Enq_data (fromEmail,header,body,messageId) SELECT * FROM (SELECT '${fromEmail}' as fromEmail ,'${subject}' as t1 ,'${body}' as t2,'${response['data']['id']}' as t4) AS tmp WHERE NOT EXISTS (SELECT messageId FROM email_Enq_data WHERE messageId = '${response['data']['id']}')`;
        knex.raw(sql).then(async (err, result) => {
                if(itemsProcessed === result2.length) {
                      resolve("true");
               }
          });
        }catch(error){
        }
       });
    })
  })

}

const saveEmailEnquiries = async () => {
  try {

    let uniqueId;
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM email_Enq_data WHERE messageId NOT IN (SELECT messageId FROM enquiries WHERE messageId IS NOT NULL )`;
      knex.raw(query).then( async (res) => {
        const res2 = res[0];
        let emailEnquiryData=res2;

        for(i=0;i<emailEnquiryData.length;i++){
          uniqueId = await util.getUniqueCode("ENQUIRY-","enquiries","uniqueId");
          await knex('enquiries').insert({
              uniqueId: uniqueId,
              messageId:emailEnquiryData[i].messageId,
              mailBody:emailEnquiryData[i].body,
              mailSubject:emailEnquiryData[i].header,
              mailBy:emailEnquiryData[i].fromEmail,
              typeOfEnquiry:'2',
              userId:'1',
            })
          }
        })
      })
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

function sleep(time, callback) {
  var stop = new Date().getTime();
  while(new Date().getTime() < stop + time) {
      ;
  }
  callback();
}

cron.schedule('0 */1 * * *', async () => {
  if (cluster.isMaster) {
    await emailSync();
    console.log("email sync is call")
    await sleep(2000, function() {});
  }
});

cron.schedule('* */2 * * *', async () => {
  if (cluster.isMaster) {
    await saveEmailEnquiries();
    console.log("email saveEmailEnquiries is call")
  }
});

module.exports = {
    emailSync:saveEmailEnquiries,
    saveEmailEnquiries:saveEmailEnquiries,
};
