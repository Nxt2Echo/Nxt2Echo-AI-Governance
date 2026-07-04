require('dotenv').config();
const admin = require('firebase-admin');

if (!process.env.FIREBASE_PROJECT_ID) {
  console.error('Missing FIREBASE_PROJECT_ID');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
  })
});

const db = admin.firestore();

async function check() {
  const snapshot = await db.collection('complaints').get();
  console.log(`Number of complaints in DB: ${snapshot.size}`);
  snapshot.docs.forEach(doc => {
    console.log(`- ID: ${doc.id}, Title: ${doc.data().title}, Status: ${doc.data().status}`);
  });
  process.exit(0);
}

check();
