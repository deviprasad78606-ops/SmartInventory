// ==========================================
// Smart Inventory Management System
// Dashboard Script
// ==========================================

import { database } from "./firebase-config.js";

import {
    ref,
    onValue
}
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js";

// Load inventory when page opens
window.onload = function () {

    listenInventory();

};

// Read inventory from Firebase
function listenInventory()
{
    const productsRef = ref(database, "products");

    onValue(productsRef, (snapshot) =>
    {
        if (!snapshot.exists())
        {
            console.log("No data found");
            return;
        }

        const products = snapshot.val();

        updateDashboard(products);

    });
}

// Update dashboard
function updateDashboard(products)
{
    let totalProducts = 0;
    let totalStock = 0;
    let lowStockCount = 0;

    const table = document.getElementById("inventoryTable");

    table.innerHTML = "";

    for (const key in products)
    {
        totalProducts++;

        const product = products[key];

        totalStock += product.stock;

        let status = "Available";
        let statusClass = "available";

        if (product.stock <= product.threshold)
        {
            status = "Low Stock";
            statusClass = "low";
            lowStockCount++;
        }

        table.innerHTML += `
        <tr>
            <td>${capitalize(key)}</td>
            <td>${product.stock}</td>
            <td>${product.threshold}</td>
            <td>${product.shelf}</td>
            <td>
                <span class="status ${statusClass}">
                    ${status}
                </span>
            </td>
        </tr>
        `;
    }

    document.getElementById("totalProducts").textContent = totalProducts;

    document.getElementById("stockAvailable").textContent = totalStock;

    document.getElementById("lowStock").textContent = lowStockCount;

    // Maximum stock = 8 items per lane × 2 lanes = 16
    const maxStock = 16;

    const fill = Math.round((totalStock / maxStock) * 100);

    document.getElementById("fillLevel").textContent = fill + "%";

    const lastUpdate = document.getElementById("lastUpdate");

    if (lastUpdate)
    {
        lastUpdate.textContent = new Date().toLocaleTimeString();
    }
}
// Capitalize first letter
function capitalize(word) {

    return word.charAt(0).toUpperCase() + word.slice(1);

}