// Mock Firebase Service for Local Development
export const app = {};

class MockAuth {
  currentUser = null;
  listeners = [];

  constructor() {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      this.currentUser = {
        uid: parsed.id || "mock-uid-123",
        displayName: parsed.name || "Mock Citizen",
        email: parsed.email || "citizen@example.com",
        photoURL: parsed.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150",
        getIdToken: async () => `mock-jwt-token-${parsed.email ? parsed.email.split('@')[0] : 'citizen'}`
      };
    }
  }

  onAuthStateChanged(callback) {
    this.listeners.push(callback);
    callback(this.currentUser);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  updateCurrentUser(user) {
    if (user) {
      this.currentUser = {
        uid: user.id,
        displayName: user.name,
        email: user.email,
        photoURL: user.avatar,
        getIdToken: async () => `mock-jwt-token-${user.email ? user.email.split('@')[0] : 'user'}`
      };
    } else {
      this.currentUser = null;
    }
    this.listeners.forEach(callback => callback(this.currentUser));
  }
}

export const auth = new MockAuth();
export const googleProvider = {};
