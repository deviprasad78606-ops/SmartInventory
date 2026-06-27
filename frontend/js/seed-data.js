import { database } from "./firebase-config.js";

import {
    ref,
    set
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js";

const productsRef = ref(database, "products");

set(productsRef, {

    milk: {
        stock: 15,
        threshold: 5,
        shelf: "A1"
    },

    biscuits: {
        stock: 3,
        threshold: 5,
        shelf: "A2"
    },

    chocolate: {
        stock: 12,
        threshold: 5,
        shelf: "A3"
    }

})
.then(() => {

    console.log("Inventory added successfully.");

})
.catch((error) => {

    console.error(error);

});