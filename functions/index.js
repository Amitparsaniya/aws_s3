/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const functions = require("firebase-functions")

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


exports.helloWord = functions.https.onRequest((req,res)=>{
    res.send("hello.....")
})


exports.api = functions.https.onRequest((req,res)=>{
    switch(req.method){
        case 'GET':
         res.send("it was get request")
         break;
         case 'POST':
            res.send("it was post request")
         break;
         case 'DELETE':
            res.send("it was delete request") 
         break  
         default:
            res.send("it was default request")
    }
})


exports.userAdded = functions.auth.user().onCreate((user)=>{
    console.log(`${user.email} is created`);
    return user
})

exports.userDeleted = functions.auth.user().onDelete((user)=>{
    console.log(`${user.email} is deleted`);
    return user
})