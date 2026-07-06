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
        "mock-uid-admin": {
          email: "admin@nxt2echo.com",
          name: "Admin User",
          role: "ADMIN",
          password: "$2a$10$azrSWoZIj4.t8OiI7wahd.XrDHN7teena1OvNTGBitTqQGwqHm9d2", // Admin@123
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        "mock-uid-officer": {
          email: "officer@example.com",
          name: "Gov Officer",
          role: "OFFICER",
          password: "$2a$10$w1w2qDG4Xn9tHA54Li/tiOBeilq5xJAnM15.VfyTMDHmk0uh4laty", // Officer@123
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        "mock-uid-123": {
          email: "citizen@example.com",
          name: "Mock Citizen",
          role: "CITIZEN",
          password: "$2a$10$o3ptG6lB2QJAAkRhjYLGeOEtq41PsfVPdGxuTlhXKXJmrrLvj1UyC", // Citizen@123
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      },
      complaints: {
        "demo-complaint-001": {
          userId: "mock-uid-123",
          title: "Pothole on Main Road near Bus Stop",
          description: "There is a large pothole on Main Road near the central bus stop that has been causing accidents. Vehicles have been damaged and pedestrians are at risk. Immediate repair needed.",
          category: "Infrastructure",
          severity: "High",
          status: "In Progress",
          priorityScore: 8,
          ward: "Ward 12 - Koramangala",
          address: "Main Road, near Central Bus Stop, Koramangala, Bengaluru",
          latitude: 12.9352,
          longitude: 77.6245,
          imageUrl: "",
          voiceUrl: "",
          isDuplicate: false,
          sentiment: "Negative",
          language: "English",
          department: "PWD",
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
          updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        "demo-complaint-002": {
          userId: "mock-uid-123",
          title: "Street Light Not Working for 2 Weeks",
          description: "The street light near my apartment complex (Block B entrance) has been non-functional for over 2 weeks. It is unsafe for residents, especially women and children at night.",
          category: "Electricity",
          severity: "Medium",
          status: "Pending",
          priorityScore: 5,
          ward: "Ward 12 - Koramangala",
          address: "Block B, Prestige Apartments, HSR Layout, Bengaluru",
          latitude: 12.9141,
          longitude: 77.6410,
          imageUrl: "",
          voiceUrl: "",
          isDuplicate: false,
          sentiment: "Negative",
          language: "English",
          department: "BESCOM",
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
          updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        },
        "demo-complaint-003": {
          userId: "mock-uid-123",
          title: "Garbage Not Collected for 5 Days",
          description: "Garbage collection has not happened for 5 consecutive days in our lane. The waste is piling up and creating an unbearable smell. Stray dogs and rats are getting attracted to the area.",
          category: "Sanitation",
          severity: "High",
          status: "Resolved",
          priorityScore: 7,
          ward: "Ward 15 - Indiranagar",
          address: "5th Cross, 12th Main, Indiranagar, Bengaluru",
          latitude: 12.9784,
          longitude: 77.6408,
          imageUrl: "",
          voiceUrl: "",
          isDuplicate: false,
          sentiment: "Very Negative",
          language: "English",
          department: "BBMP",
          createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days ago
          updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        },
        "demo-complaint-004": {
          userId: "mock-uid-123",
          title: "Water Supply Disruption — No Water Since Morning",
          description: "There has been no water supply in our area since 6 AM. We have been waiting all day. No prior notice was given by BWSSB. Multiple families are affected and we need an urgent resolution.",
          category: "WaterSupply",
          severity: "Critical",
          status: "Pending",
          priorityScore: 9,
          ward: "Ward 12 - Koramangala",
          address: "3rd Block, Koramangala, Bengaluru - 560034",
          latitude: 12.9300,
          longitude: 77.6200,
          imageUrl: "",
          voiceUrl: "",
          isDuplicate: false,
          sentiment: "Negative",
          language: "English",
          department: "BWSSB",
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
      }

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

// ────────────────────────────────────────────────────────
// Exports (Directly switchable with MongoDB persistence fallback)
// ────────────────────────────────────────────────────────

import { MongoClient } from 'mongodb';

const MONGODB_URI = "mongodb+srv://nxt2echo:nxt2echo123@cluster0.p1b4d.mongodb.net/nxt2echo?retryWrites=true&w=majority";
let mongoClient: MongoClient | null = null;
let mongoDb: any = null;

if (useMock) {
  try {
    mongoClient = new MongoClient(MONGODB_URI);
    // Connect synchronously in the background
    mongoClient.connect().then(() => {
      mongoDb = mongoClient!.db('nxt2echo');
      console.log('Connected to MongoDB Atlas successfully.');
    }).catch(err => {
      console.error('Failed to connect to MongoDB Atlas:', err.message);
    });
  } catch (e: any) {
    console.error('MongoDB Atlas init error:', e.message);
  }
}

// Implement MongoDB-backed Firestore Mock to persist complaints and users
class MongoQuery {
  collectionName: string;
  filters: Array<{ field: string; op: string; val: any }> = [];
  limitVal: number = 0;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  where(field: string, op: string, val: any) {
    const next = new MongoQuery(this.collectionName);
    next.filters = [...this.filters, { field, op, val }];
    next.limitVal = this.limitVal;
    return next;
  }

  limit(n: number) {
    const next = new MongoQuery(this.collectionName);
    next.filters = [...this.filters];
    next.limitVal = n;
    return next;
  }

  async get() {
    let list: any[] = [];
    if (mongoDb) {
      const selector: Record<string, any> = {};
      for (const f of this.filters) {
        if (f.op === '==' || f.op === '===') {
          selector[f.field] = f.val;
        } else {
          selector[f.field] = f.val;
        }
      }

      try {
        const cursor = mongoDb.collection(this.collectionName).find(selector);
        if (this.limitVal > 0) cursor.limit(this.limitVal);
        const docs = await cursor.toArray();
        list = docs.map((doc: any) => {
          const id = doc._id;
          const copy = { ...doc };
          delete copy._id;
          return new MockDoc(id, copy, true);
        });
      } catch (err) {
        console.error(`MongoDB query failed in collection ${this.collectionName}:`, err);
      }
    }
    
    if (list.length === 0) {
      const allDocs = Object.entries(dbStore.dataStore[this.collectionName] || {}).map(
        ([id, data]) => new MockDoc(id, data, true)
      );
      list = allDocs.filter(doc => {
        const data = doc.data();
        return this.filters.every(f => data && data[f.field] === f.val);
      });
      if (this.limitVal > 0) {
        list = list.slice(0, this.limitVal);
      }
    }

    return {
      docs: list,
      empty: list.length === 0
    };
  }
}

class MongoCollection extends MongoQuery {
  constructor(name: string) {
    super(name);
  }

  async add(data: any) {
    const id = 'mongo-id-' + Math.random().toString(36).substring(2, 10);
    const docRef = this.doc(id);
    await docRef.set(data);
    return docRef;
  }

  doc(id: string) {
    return {
      id,
      get: async () => {
        let data = null;
        if (mongoDb) {
          try {
            data = await mongoDb.collection(this.collectionName).findOne({ _id: id });
            if (data) {
              delete data._id;
            }
          } catch (err) {
            console.error(`MongoDB findOne failed:`, err);
          }
        }
        if (!data) {
          data = dbStore.dataStore[this.collectionName]?.[id];
        }
        return new MockDoc(id, data, !!data);
      },
      set: async (data: any) => {
        if (mongoDb) {
          try {
            await mongoDb.collection(this.collectionName).updateOne(
              { _id: id },
              { $set: data },
              { upsert: true }
            );
          } catch (err) {
            console.error(`MongoDB updateOne/upsert failed:`, err);
          }
        }
        if (!dbStore.dataStore[this.collectionName]) dbStore.dataStore[this.collectionName] = {};
        dbStore.dataStore[this.collectionName][id] = { ...data };
      },
      update: async (data: any) => {
        if (mongoDb) {
          try {
            await mongoDb.collection(this.collectionName).updateOne(
              { _id: id },
              { $set: data }
            );
          } catch (err) {
            console.error(`MongoDB updateOne failed:`, err);
          }
        }
        if (!dbStore.dataStore[this.collectionName]) dbStore.dataStore[this.collectionName] = {};
        const current = dbStore.dataStore[this.collectionName][id] || {};
        dbStore.dataStore[this.collectionName][id] = { ...current, ...data };
      },
      delete: async () => {
        if (mongoDb) {
          try {
            await mongoDb.collection(this.collectionName).deleteOne({ _id: id });
          } catch (err) {
            console.error(`MongoDB deleteOne failed:`, err);
          }
        }
        if (dbStore.dataStore[this.collectionName]) {
          delete dbStore.dataStore[this.collectionName][id];
        }
      }
    };
  }
}

class MongoDbWrapper {
  collection(name: string) {
    return new MongoCollection(name);
  }
}

const dbStore = new MockDb();

export const db = (useMock ? new MongoDbWrapper() : admin.firestore()) as any;
export const auth = (useMock ? new MockAuth() : admin.auth()) as any;
export const storage = (useMock ? new MockStorage() : admin.storage()) as any;
