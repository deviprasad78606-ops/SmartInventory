// ===========================================
// Firebase Configuration
// Smart Inventory Management System
// ===========================================

// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
    getDatabase
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {

    apiKey: "AIzaSyCjw-4ayiYKr8LYukCqTq6cpgXGXamhWAs",

    authDomain: "smartinventory-8b6e2.firebaseapp.com",

    databaseURL: "https://smartinventory-8b6e2-default-rtdb.asia-southeast1.firebasedatabase.app",

    projectId: "smartinventory-8b6e2",

    storageBucket: "smartinventory-8b6e2.firebasestorage.app",

    messagingSenderId: "610948975869",

    appId: "1:610948975869:web:792b22bd1730c8253e4294"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Connect to Realtime Database
const database = getDatabase(app);

// Export database so other JavaScript files can use it
export { database };