import * as functions from 'firebase-functions';
const admin = require("firebase-admin");
admin.initializeApp();

exports.addMessage = functions.https.onRequest(async (req, res) => {
    // Grab the text parameter.
    const original = req.query.text;
    // Push the new message into Cloud Firestore using the Firebase Admin SDK.
    const writeResult = await admin.firestore().collection('messages').add({original: original});
    // Send back a message that we've succesfully written the message
    res.status(200).json({result: `Message with ID: ${writeResult.id} added.`});
  });


export const getUser = functions.https.onRequest((req, res) => {
    const uid = req.query.uid;
    const doc = admin.firestore().doc(`users/${uid}`);
    doc.get().then((snapshot: { data: () => any; email: any; }) => {
        res.status(200).json({result: `${JSON.stringify(snapshot.data())}`});
    }).catch((error: any) => {
        res.status(500).json({error}).send(error);
    })
});








// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

