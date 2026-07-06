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

const fallbackComplaints = [
  { id: "CMP-001", title: "Pothole on MG Road causing accidents", status: "Pending", priority: "High", category: "Infrastructure", department: "PWD", area: "Koramangala", date: "2024-06-15T10:00:00Z", description: "Large pothole on MG Road near signal causing vehicle damage.", aiScore: 96, sentiment: "Angry", risk: 9.2, lat: 12.9352, lng: 77.6245 },
  { id: "CMP-002", title: "Water supply disruption for 3 days", status: "InProgress", priority: "High", category: "WaterSupply", department: "BWSSB", area: "Indiranagar", date: "2024-06-14T10:00:00Z", description: "No water supply in the area for 3 consecutive days.", aiScore: 91, sentiment: "Frustrated", risk: 8.1, lat: 12.9784, lng: 77.6408 },
  { id: "CMP-003", title: "Garbage not collected for 2 weeks", status: "Pending", priority: "Medium", category: "Sanitation", department: "BBMP", area: "HSR Layout", date: "2024-06-14T11:00:00Z", description: "Garbage collection skipped for over 2 weeks.", aiScore: 88, sentiment: "Disappointed", risk: 6.5, lat: 12.9116, lng: 77.6474 },
  { id: "CMP-004", title: "Broken street light near school", status: "Resolved", priority: "Medium", category: "Electricity", department: "BESCOM", area: "Jayanagar", date: "2024-06-13T10:00:00Z", description: "Street light has been broken for over a month near government school.", aiScore: 85, sentiment: "Concerned", risk: 5.8, lat: 12.9299, lng: 77.5933 },
  { id: "CMP-005", title: "Stray dog menace in residential area", status: "Pending", priority: "High", category: "PublicSafety", department: "BBMP", area: "Whitefield", date: "2024-06-13T11:00:00Z", description: "Large pack of stray dogs attacking residents.", aiScore: 92, sentiment: "Fearful", risk: 8.7, lat: 12.9698, lng: 77.7499 },
  { id: "CMP-006", title: "Sewage overflow on main street", status: "Pending", priority: "High", category: "Sanitation", department: "BWSSB", area: "BTM Layout", date: "2024-06-12T10:00:00Z", description: "Sewage water overflowing onto the main road causing health hazard.", aiScore: 97, sentiment: "Outraged", risk: 9.8, lat: 12.9166, lng: 77.6101 },
  { id: "CMP-007", title: "Illegal construction blocking road", status: "InProgress", priority: "Medium", category: "Infrastructure", department: "BBMP", area: "Rajajinagar", date: "2024-06-12T11:00:00Z", description: "Unauthorized construction material dumped on public road.", aiScore: 79, sentiment: "Annoyed", risk: 5.2, lat: 12.9881, lng: 77.5549 },
  { id: "CMP-008", title: "Power outage lasting 8 hours daily", status: "InProgress", priority: "High", category: "Electricity", department: "BESCOM", area: "Electronic City", date: "2024-06-11T10:00:00Z", description: "Scheduled power cuts exceeding 8 hours affecting IT companies.", aiScore: 89, sentiment: "Frustrated", risk: 7.4, lat: 12.8399, lng: 77.6770 },
  { id: "CMP-009", title: "Park encroached by commercial vendors", status: "Pending", priority: "Low", category: "PublicSpaces", department: "BBMP", area: "Malleswaram", date: "2024-06-11T11:00:00Z", description: "Vendors have set up permanent stalls inside the public park.", aiScore: 72, sentiment: "Disappointed", risk: 3.9, lat: 13.0035, lng: 77.5689 },
  { id: "CMP-010", title: "Noise pollution from construction site", status: "Resolved", priority: "Medium", category: "Environment", department: "KSPCB", area: "Marathahalli", date: "2024-06-10T10:00:00Z", description: "Construction work running 24x7 violating noise pollution norms.", aiScore: 81, sentiment: "Annoyed", risk: 4.7, lat: 12.9569, lng: 77.7011 },
  { id: "CMP-011", title: "Missing manhole cover on busy road", status: "Pending", priority: "High", category: "Infrastructure", department: "BBMP", area: "Shivajinagar", date: "2024-06-10T11:00:00Z", description: "Open manhole on busy junction causing accidents.", aiScore: 98, sentiment: "Alarmed", risk: 9.9, lat: 12.9857, lng: 77.6057 },
  { id: "CMP-012", title: "Waterlogging during rain at underpass", status: "Pending", priority: "High", category: "Drainage", department: "BBMP", area: "Hebbal", date: "2024-06-09T10:00:00Z", description: "Underpass floods during every rain causing traffic blockage.", aiScore: 87, sentiment: "Frustrated", risk: 7.6, lat: 13.0354, lng: 77.5988 },
  { id: "CMP-013", title: "Illegal dumping of construction waste", status: "InProgress", priority: "Medium", category: "Environment", department: "KSPCB", area: "Sarjapur", date: "2024-06-09T11:00:00Z", description: "Builder illegally dumping debris near lake area.", aiScore: 84, sentiment: "Concerned", risk: 6.1, lat: 12.9226, lng: 77.6841 },
  { id: "CMP-014", title: "No proper bus shelter at major stop", status: "Pending", priority: "Low", category: "Transport", department: "BMTC", area: "Yeshwanthpur", date: "2024-06-08T10:00:00Z", description: "Bus stop on major route has no shelter causing inconvenience.", aiScore: 68, sentiment: "Disappointed", risk: 2.8, lat: 13.0278, lng: 77.5409 },
  { id: "CMP-015", title: "Tree fallen on power line after storm", status: "Resolved", priority: "High", category: "Electricity", department: "BESCOM", area: "Basavanagudi", date: "2024-06-08T11:00:00Z", description: "Tree fallen on high tension power line after last night's storm.", aiScore: 95, sentiment: "Alarmed", risk: 9.1, lat: 12.9422, lng: 77.5738 },
];

async function seedData() {
  try {
    // Get the first user to assign ownership of these complaints
    const usersSnapshot = await db.collection('users').limit(1).get();
    let defaultUserId = 'seed-user-123';
    if (!usersSnapshot.empty) {
      defaultUserId = usersSnapshot.docs[0].id;
    }

    let count = 0;
    for (const item of fallbackComplaints) {
      // Check if complaint already exists to prevent duplication
      const existing = await db.collection('complaints').where('title', '==', item.title).get();
      if (!existing.empty) continue;

      const complaintData = {
        userId: defaultUserId,
        title: item.title,
        description: item.description,
        category: item.category,
        severity: item.priority,
        priorityScore: item.aiScore,
        sentiment: item.sentiment,
        isDuplicate: false,
        latitude: item.lat,
        longitude: item.lng,
        ward: item.area,
        status: item.status,
        createdAt: item.date,
        updatedAt: item.date,
      };

      await db.collection('complaints').add(complaintData);
      count++;
    }

    console.log(`Successfully seeded ${count} complaints!`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedData();
