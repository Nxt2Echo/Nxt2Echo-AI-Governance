require('dotenv').config();
const admin = require('firebase-admin');

if (!process.env.FIREBASE_PROJECT_ID) {
  console.error('Missing FIREBASE_PROJECT_ID in .env');
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

async function upgradeUsers() {
  try {
    const snapshot = await db.collection('users').get();
    let count = 0;
    for (const doc of snapshot.docs) {
      await doc.ref.update({ role: 'ADMIN' });
      count++;
    }
    console.log(`Successfully upgraded ${count} users to ADMIN role.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

upgradeUsers();
