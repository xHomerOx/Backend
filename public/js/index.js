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
    
    try {
        const response = await fetch("/api/products", {
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
    } catch (error) {
        console.error(error);
    }
});

document.addEventListener("click", async (event) => {
    if (event.target.classList.contains("deleteButton")) {
        const productId = event.target.dataset.id;

        try {
            const response = await fetch(`/products/${productId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                console.log("Product deleted successfully");
            } else {
                console.error("Error deleting product");
            }
        } catch (error) {
            console.error(error);
        }
    }
});
