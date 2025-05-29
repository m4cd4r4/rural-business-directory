/**
 * Firebase Integration for Rural Business Directory
 * Provides real-time database with offline support
 */

import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

/**
 * Firebase business collection operations
 */
export const firebaseBusinessAPI = {
  // Get all businesses with filtering
  getBusinesses: async (filters = {}) => {
    try {
      let q = collection(db, 'businesses');
      const constraints = [];

      // Add filters
      if (filters.state && filters.state.length > 0) {
        if (Array.isArray(filters.state)) {
          constraints.push(where('location.state', 'in', filters.state));
        } else {
          constraints.push(where('location.state', '==', filters.state));
        }
      }

      if (filters.industry && filters.industry.length > 0) {
        if (Array.isArray(filters.industry)) {
          constraints.push(where('industry', 'in', filters.industry));
        } else {
          constraints.push(where('industry', '==', filters.industry));
        }
      }

      if (filters.region) {
        constraints.push(where('location.region', '==', filters.region));
      }

      if (filters.featured) {
        constraints.push(where('featured', '==', true));
      }

      // Add sorting
      const sortField = filters.sortBy || 'name';
      constraints.push(orderBy(sortField));

      // Add pagination
      if (filters.limit) {
        constraints.push(limit(filters.limit));
      }

      if (filters.lastDoc) {
        constraints.push(startAfter(filters.lastDoc));
      }

      // Build query
      if (constraints.length > 0) {
        q = query(q, ...constraints);
      }

      const snapshot = await getDocs(q);
      const businesses = [];
      
      snapshot.forEach(doc => {
        businesses.push({
          id: doc.id,
          ...doc.data(),
          firestoreDoc: doc // Keep reference for pagination
        });
      });

      return {
        businesses,
        lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
        hasMore: snapshot.docs.length === (filters.limit || 25)
      };

    } catch (error) {
      console.error('Firebase getBusinesses error:', error);
      throw error;
    }
  },

  // Get single business by ID
  getBusinessById: async (id) => {
    try {
      const docRef = doc(db, 'businesses', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      } else {
        throw new Error('Business not found');
      }
    } catch (error) {
      console.error('Firebase getBusinessById error:', error);
      throw error;
    }
  },

  // Get featured businesses
  getFeaturedBusinesses: async (limitCount = 5) => {
    try {
      const q = query(
        collection(db, 'businesses'),
        where('featured', '==', true),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      const businesses = [];
      
      snapshot.forEach(doc => {
        businesses.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return businesses;

    } catch (error) {
      console.error('Firebase getFeaturedBusinesses error:', error);
      throw error;
    }
  },

  // Add new business
  addBusiness: async (businessData) => {
    try {
      const docData = {
        ...businessData,
        createdAt: new Date(),
        updatedAt: new Date(),
        featured: false
      };

      const docRef = await addDoc(collection(db, 'businesses'), docData);
      return { id: docRef.id, ...docData };

    } catch (error) {
      console.error('Firebase addBusiness error:', error);
      throw error;
    }
  }
};

/**
 * Firebase metadata operations
 */
export const firebaseMetadataAPI = {
  // Get all industries
  getIndustries: async () => {
    try {
      const snapshot = await getDocs(
        query(collection(db, 'industries'), orderBy('name'))
      );
      const industries = [];
      
      snapshot.forEach(doc => {
        industries.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return industries;
    } catch (error) {
      console.error('Firebase getIndustries error:', error);
      return [];
    }
  },

  // Get unique states from businesses
  getStates: async () => {
    try {
      const snapshot = await getDocs(collection(db, 'businesses'));
      const states = new Set();
      
      snapshot.forEach(doc => {
        const business = doc.data();
        if (business.location?.state) {
          states.add(business.location.state);
        }
      });

      return Array.from(states).sort().map(state => ({ id: state, name: state }));
    } catch (error) {
      console.error('Firebase getStates error:', error);
      return [];
    }
  },

  // Get unique regions from businesses
  getAllRegions: async () => {
    try {
      const snapshot = await getDocs(collection(db, 'businesses'));
      const regions = new Set();
      
      snapshot.forEach(doc => {
        const business = doc.data();
        if (business.location?.region) {
          regions.add(business.location.region);
        }
      });

      return Array.from(regions).sort();
    } catch (error) {
      console.error('Firebase getAllRegions error:', error);
      return [];
    }
  }
};

/**
 * Firebase real-time subscriptions
 */
export const firebaseSubscriptions = {
  // Subscribe to businesses collection changes
  subscribeToBusinesses: (callback, filters = {}) => {
    let q = collection(db, 'businesses');
    const constraints = [];

    // Add filters (similar to getBusinesses)
    if (filters.state) {
      constraints.push(where('location.state', '==', filters.state));
    }
    if (filters.industry) {
      constraints.push(where('industry', '==', filters.industry));
    }
    if (filters.featured) {
      constraints.push(where('featured', '==', true));
    }

    constraints.push(orderBy(filters.sortBy || 'name'));

    if (constraints.length > 0) {
      q = query(q, ...constraints);
    }

    // Return unsubscribe function
    return onSnapshot(q, (snapshot) => {
      const businesses = [];
      snapshot.forEach(doc => {
        businesses.push({
          id: doc.id,
          ...doc.data()
        });
      });
      callback(businesses);
    }, (error) => {
      console.error('Firebase subscription error:', error);
    });
  },

  // Subscribe to single business changes
  subscribeToBusinesse: (businessId, callback) => {
    const docRef = doc(db, 'businesses', businessId);
    
    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        callback({
          id: doc.id,
          ...doc.data()
        });
      } else {
        callback(null);
      }
    }, (error) => {
      console.error('Firebase business subscription error:', error);
    });
  }
};
