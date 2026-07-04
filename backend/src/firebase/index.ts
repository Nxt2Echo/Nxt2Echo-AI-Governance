import * as admin from 'firebase-admin';
import { env } from '../config/env';

let app: admin.app.App | null = null;
let useMock = true;

if (env.FIREBASE.PROJECT_ID && env.FIREBASE.CLIENT_EMAIL && env.FIREBASE.PRIVATE_KEY) {
  try {
    app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: env.FIREBASE.PROJECT_ID,
        clientEmail: env.FIREBASE.CLIENT_EMAIL,
        privateKey: env.FIREBASE.PRIVATE_KEY,
      }),
      storageBucket: `${env.FIREBASE.PROJECT_ID}.appspot.com`,
    });
    console.log('Firebase Admin Initialized Successfully');
    useMock = false;
  } catch (error) {
    console.error('Firebase Admin Initialization Error:', error);
    console.warn('Falling back to local in-memory Mock Database & Auth.');
  }
} else {
  console.warn('Firebase credentials missing. Using local in-memory Mock Database & Auth.');
}

// ────────────────────────────────────────────────────────
// Mock Firestore Database Implementation
// ────────────────────────────────────────────────────────

class MockDoc {
  id: string;
  dataObj: any;
  exists: boolean;

  constructor(id: string, dataObj: any, exists = true) {
    this.id = id;
    this.dataObj = dataObj;
    this.exists = exists;
  }

  data() {
    return this.dataObj;
  }
}

class MockDocRef {
  id: string;
  collectionName: string;
  dbRef: MockDb;

  constructor(id: string, collectionName: string, dbRef: MockDb) {
    this.id = id;
    this.collectionName = collectionName;
    this.dbRef = dbRef;
  }

  async get() {
    const data = this.dbRef.dataStore[this.collectionName]?.[this.id];
    return new MockDoc(this.id, data, !!data);
  }

  async set(data: any) {
    if (!this.dbRef.dataStore[this.collectionName]) {
      this.dbRef.dataStore[this.collectionName] = {};
    }
    this.dbRef.dataStore[this.collectionName][this.id] = { ...data };
  }

  async update(data: any) {
    if (!this.dbRef.dataStore[this.collectionName]) {
      this.dbRef.dataStore[this.collectionName] = {};
    }
    const current = this.dbRef.dataStore[this.collectionName][this.id] || {};
    this.dbRef.dataStore[this.collectionName][this.id] = { ...current, ...data };
  }

  async delete() {
    if (this.dbRef.dataStore[this.collectionName]) {
      delete this.dbRef.dataStore[this.collectionName][this.id];
    }
  }
}

class MockQuery {
  collectionName: string;
  dbRef: MockDb;
  filters: Array<{ field: string; op: string; val: any }> = [];
  limitVal: number = 0;

  constructor(collectionName: string, dbRef: MockDb) {
    this.collectionName = collectionName;
    this.dbRef = dbRef;
  }

  where(field: string, op: string, val: any) {
    const next = new MockQuery(this.collectionName, this.dbRef);
    next.filters = [...this.filters, { field, op, val }];
    next.limitVal = this.limitVal;
    return next;
  }

  limit(n: number) {
    const next = new MockQuery(this.collectionName, this.dbRef);
    next.filters = [...this.filters];
    next.limitVal = n;
    return next;
  }

  async get() {
    const allDocs = Object.entries(this.dbRef.dataStore[this.collectionName] || {}).map(
      ([id, data]) => new MockDoc(id, data, true)
    );

    let filtered = allDocs.filter(doc => {
      const data = doc.data();
      return this.filters.every(f => {
        return data && data[f.field] === f.val;
      });
    });

    if (this.limitVal > 0) {
      filtered = filtered.slice(0, this.limitVal);
    }

    return {
      docs: filtered,
      empty: filtered.length === 0,
    };
  }
}

class MockCollection extends MockQuery {
  async add(data: any) {
    const id = 'mock-complaint-' + Math.random().toString(36).substring(2, 10);
    const docRef = new MockDocRef(id, this.collectionName, this.dbRef);
    await docRef.set(data);
    return docRef;
  }

  doc(id: string) {
    return new MockDocRef(id, this.collectionName, this.dbRef);
  }
}

class MockDb {
  dataStore: Record<string, Record<string, any>> = {};

  constructor() {
    this.dataStore = {
      users: {
        "mock-uid-officer": {
          email: "officer@example.com",
          name: "Gov Officer",
          role: "OFFICER",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        "mock-uid-123": {
          email: "citizen@example.com",
          name: "Mock Citizen",
          role: "CITIZEN",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      },
      complaints: {}
    };
  }

  collection(name: string) {
    return new MockCollection(name, this);
  }
}

// ────────────────────────────────────────────────────────
// Mock Firebase Auth Implementation
// ────────────────────────────────────────────────────────

class MockAuth {
  users: Record<string, any> = {
    "mock-uid-officer": {
      uid: "mock-uid-officer",
      email: "officer@example.com",
      displayName: "Gov Officer",
      role: "OFFICER"
    },
    "mock-uid-123": {
      uid: "mock-uid-123",
      email: "citizen@example.com",
      displayName: "Mock Citizen",
      role: "CITIZEN"
    }
  };

  async verifyIdToken(token: string) {
    // Match any mock token pattern
    if (token.startsWith("mock-jwt-token-")) {
      const username = token.replace("mock-jwt-token-", "");
      // Determine role from username
      const isOfficer = username.includes("officer") || username.includes("admin");
      const uid = isOfficer ? "mock-uid-officer" : "mock-uid-123";
      const user = this.users[uid];
      return {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        role: user.role
      };
    }
    throw new Error("Invalid mock token");
  }

  async createUser(data: { email: string; password?: string; displayName?: string }) {
    const uid = "mock-uid-" + Math.random().toString(36).substring(2, 10);
    const isOfficer = (data.email || "").includes("officer") || (data.email || "").includes("admin");
    const userRecord = {
      uid,
      email: data.email,
      displayName: data.displayName || "Citizen",
      role: isOfficer ? "OFFICER" : "CITIZEN"
    };
    this.users[uid] = userRecord;
    return userRecord;
  }
}

// ────────────────────────────────────────────────────────
// Mock Firebase Storage Implementation
// ────────────────────────────────────────────────────────

class MockStorage {
  bucket() {
    return {
      name: "mock-bucket",
      file: (filename: string) => ({
        save: async (buffer: any, meta: any) => {},
        makePublic: async () => {},
      })
    };
  }
}

// ────────────────────────────────────────────────────────
// Exports (Directly switchable)
// ────────────────────────────────────────────────────────

export const db = (useMock ? new MockDb() : admin.firestore()) as any;
export const auth = (useMock ? new MockAuth() : admin.auth()) as any;
export const storage = (useMock ? new MockStorage() : admin.storage()) as any;
