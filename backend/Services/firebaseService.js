const admin = require('firebase-admin');
const serviceAccount = require('../config/firebaseServiceAccountKey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();
const taskCollection = db.collection('tasks');
module.exports = taskCollection;
