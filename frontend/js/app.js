// ==========================================
// Smart Inventory Management System
// Dashboard Script
// ==========================================

import { database } from "./firebase-config.js";

import {
    ref,
    get
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js";

// Load inventory when page opens
window.onload = function () {
    loadInventory();
};

// Read inventory from Firebase
async function loadInventory() {

    try {

        const snapshot = await get(ref(database, "products"));

        if (!snapshot.exists()) {

            alert("No inventory data found!");

            return;
        }

        const products = snapshot.val();
        console.log("Products from Firebase:", products);
        console.log("Milk Stock:", products.milk.stock);


        updateDashboard(products);

    } catch (error) {

        console.error("Firebase Error:", error);

    }

}

// Update dashboard
function updateDashboard(products) {

    let totalProducts = 0;
    let lowStockCount = 0;

    const table = document.getElementById("inventoryTable");

    table.innerHTML = "";

    for (const key in products) {

        totalProducts++;

        const product = products[key];

        let status = "Available";

        if (product.stock <= product.threshold) {

            status = "Low Stock";

            lowStockCount++;

        }

        table.innerHTML += `

        <tr>

            <td>${capitalize(key)}</td>

            <td>${product.stock}</td>

            <td>${product.threshold}</td>

            <td>${product.shelf}</td>

            <td>${status}</td>

        </tr>

        `;

    }

    document.getElementById("totalProducts").textContent = totalProducts;

    document.getElementById("lowStock").textContent = lowStockCount;

    document.getElementById("lastUpdate").textContent =
        new Date().toLocaleTimeString();

}

// Capitalize first letter
function capitalize(word) {

    return word.charAt(0).toUpperCase() + word.slice(1);

}