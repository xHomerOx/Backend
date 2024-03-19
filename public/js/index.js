const socket = io();

socket.emit("message", "Client connected to Socket");

socket.on('connect', () => {
    console.log('Client connected to Socket');
});

socket.on("productAdded", (addedProducts) => {
    const productList = document.getElementById("productList");
    productList.innerHTML = "";
    
    addedProducts.forEach(product => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <h2>Title: ${product.title}</h2>
            <p>Description: ${product.description}</p>
            <p>Price: $${product.price}</p>
            <p>Product Code: ${product.code}</p>
            <p>Stock: ${product.stock}</p>
            <p>Category: ${product.category}</p>
        `;
        productList.appendChild(listItem);
    });
});

const addProductForm = document.getElementById("addProductForm");

addProductForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const price = document.getElementById("price").value;
    const thumbnail = document.getElementById("thumbnail").value;
    const code = document.getElementById("code").value;
    const status = document.getElementById("status").value;
    const stock = document.getElementById("stock").value;
    const category = document.getElementById("category").value;
    
    const response = await fetch("/realtimeproducts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, description, price, thumbnail, code, status, stock, category })
    });
    
    if (response.ok) {
        console.log("Product added successfully");
    } else {
        console.error("Error adding product");
    }
});