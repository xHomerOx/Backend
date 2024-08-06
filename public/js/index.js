document.addEventListener("DOMContentLoaded", () => {
    const productList = document.getElementById("product-list");
    const cartId = productList?.dataset.cartId;
    const role = document.querySelector('small[data-user-role]')?.dataset.userRole;
    const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
    const removeFromCartButtons = document.querySelectorAll(".remove-from-cart-btn");
    const logoutButton = document.getElementById("logout-button");

    if (logoutButton) {
        logoutButton.addEventListener("click", function() {
            localStorage.setItem('userLoggedOut', 'true');
        });
    }

    restoreCartState();
    updateItemCount();

    async function restoreCartState() {
        const logoutFlag = localStorage.getItem('userLoggedOut');
        if (logoutFlag === 'true') {
            localStorage.removeItem('userLoggedOut');
    
            document.querySelectorAll('.item-count').forEach(span => {
                span.textContent = "0";
            });
    
            updateRemoveButtonVisibility({});
        } else {
            const storedCart = localStorage.getItem('cart');
            if (storedCart) {
                const productsInCart = JSON.parse(storedCart);
        
                document.querySelectorAll('.item-count').forEach(span => {
                    const productId = span.dataset.productId;
                    const count = productsInCart[productId] || 0;
                    span.textContent = count;
                });
    
                updateRemoveButtonVisibility(productsInCart);
            }
        }
    }    
    
    async function updateItemCount() {
        try {
            const response = await fetch(`/api/carts/${cartId}`);
    
            if (response.ok) {
                const cartData = await response.json();
    
                if (cartData && cartData.payload && Array.isArray(cartData.payload.products)) {
                    const productsInCart = cartData.payload.products.reduce((map, product) => {
                        map[product.product._id] = product.quantity;
                        return map;
                    }, {});

                    localStorage.setItem('cart', JSON.stringify(productsInCart));
 
                    document.querySelectorAll('.item-count').forEach(span => {
                        const productId = span.dataset.productId;
                        const count = productsInCart[productId] || 0;
                        span.textContent = count;
                    });
                } else {
                    console.error('Cart data does not have expected structure:', cartData);
                }
            } else {
                console.error("Failed to fetch cart data:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching cart data:", error);
        }
    }

    async function updateRemoveButtonVisibility() {
        try {
            const response = await fetch(`/api/carts/${cartId}`);

            if (response.ok) {
                const cartData = await response.json();

                if (cartData && cartData.payload && Array.isArray(cartData.payload.products)) {
                    const productsInCart = cartData.payload.products.map(product => product.product._id);
    
                    removeFromCartButtons.forEach(button => {
                        const productId = button.dataset.productId;
    
                        if (productsInCart.includes(productId)) {
                            button.classList.remove('d-none');
                        } else {
                            button.classList.add('d-none');
                        }
                    });
                } else {
                    console.error('Cart data does not have expected structure:', cartData);
                }
            } else {
                console.error("Failed to fetch cart data:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching cart data:", error);
        }
    }
    
    addToCartButtons.forEach(button => {
        button.addEventListener("click", async (event) => {
            event.preventDefault();
            const productId = button.dataset.productId;
    
            try {
                const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ productId, cartId })
                });
                if (response.ok) {
                    Swal.fire({
                        title: 'Product Added',
                        text: 'The product has been added to your cart',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                    await updateItemCount();
                    await updateRemoveButtonVisibility();
                }
            } catch (error) {
                console.error(error);
            }
        });
    });
    
    removeFromCartButtons.forEach(button => {
        button.addEventListener("click", async (event) => {
            event.preventDefault();
            const productId = button.dataset.productId;

            try {
                const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ productId, cartId })
                });
                if (response.ok) {
                    Swal.fire({
                        title: 'Product Removed',
                        text: 'The product has been removed from your cart',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                    await updateItemCount();
                    await updateRemoveButtonVisibility();
                }
            } catch (error) {
                console.error(error);
            }
        });
    });
    
    const finishPurchaseButtons = document.querySelectorAll('.finishPurchase');
    
    finishPurchaseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const cartId = button.dataset.cartId;
            window.location.href = `/api/carts/${cartId}/checkout`;
        });
    });
    
    document.getElementById('confirm-purchase')?.addEventListener('click', async () => {
        const cartId = document.getElementById('confirm-purchase').dataset.cartId;
        try {
            const response = await fetch(`/api/carts/${cartId}/purchase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                window.location.href = `/api/carts/${cartId}/purchase`;
            } else {
                throw new Error('Error occurred while completing purchase');
            }
        } catch (error) {
            console.error(error);
        }
    });
    

    if (role === 'admin' || role === 'premium') {
        const addThumbnailBtn = document.getElementById('addThumbnailBtn');
        const thumbnailsContainer = document.getElementById('thumbnailsContainer');
        let thumbnailCount = 1;
    
        addThumbnailBtn.addEventListener('click', () => {
            if (thumbnailCount < 3) {
                thumbnailCount++;
    
                const newThumbnailDiv = document.createElement('div');
                newThumbnailDiv.className = 'mb-3';
    
                const newLabel = document.createElement('label');
                newLabel.className = 'form-label';
                newLabel.setAttribute('for', `thumbnail${thumbnailCount}`);
                newLabel.textContent = `Thumbnail ${thumbnailCount}:`;
                newThumbnailDiv.appendChild(newLabel);
    
                const newInput = document.createElement('input');
                newInput.type = 'file';
                newInput.id = `thumbnail${thumbnailCount}`;
                newInput.name = 'thumbnail';
                newInput.className = 'form-control';
                newInput.required = true;
                newThumbnailDiv.appendChild(newInput);
    
                thumbnailsContainer.appendChild(newThumbnailDiv);
            } else {
                Swal.fire({
                    title: 'Limit Reached',
                    text: 'Maximum of three thumbnails allowed',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        });

        const addProductForm = document.getElementById("addProductForm");
        addProductForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const formData = new FormData(addProductForm);

            try {
                const response = await fetch("/api/products", {
                    method: "POST",
                    body: formData
                });

                if (response.ok) {
                    Swal.fire({
                        title: 'Product Added',
                        text: 'The product has been added successfully',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: 'Code cannot be the same as an existent one!',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                    throw new Error("Error adding product");
                }
            } catch (error) {
                throw new Error(error);
            }
        });

        productList.addEventListener("click", async (event) => {
            if (event.target.classList.contains("deleteButton")) {
                const productId = event.target.dataset.productId;
                try {
                    const response = await fetch(`/api/products/${productId}`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });

                    if (response.ok) {
                        event.target.parentElement.remove();
                        Swal.fire({
                            title: 'Product Deleted',
                            text: 'The product has been deleted successfully',
                            icon: 'success',
                            confirmButtonText: 'OK'
                        });
                    } else {
                        Swal.fire({
                            title: 'Error',
                            text: 'There was an error deleting the product',
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                        throw new Error("Error deleting product");
                    }
                } catch (error) {
                    throw new Error(error);
                }
            }
        });
        
        productList.addEventListener("click", async (event) => {
            if (event.target.classList.contains("updateButton")) {
                const productId = event.target.dataset.productId;
                
                Swal.fire({
                    title: 'Update Product',
                    html:
                    '<form id="updateProductForm">' +
                        '<input type="hidden" id="productId" name="productId" value="' + productId + '">' +
                        '<label for="title">Title:</label>' +
                        '<input type="text" id="title" name="title" required>' +
                        '<br>' +
                        '<label for="description">Description:</label>' +
                        '<textarea id="description" name="description" rows="4" cols="50" required></textarea>' +
                        '<br>' +
                        '<label for="price">Price:</label>' +
                        '<input type="number" id="price" name="price" required>' +
                        '<br>' +
                        '<label for="thumbnail" class="form-label">Thumbnail:</label>' +
                        '<input type="file" id="thumbnail" name="thumbnail" class="form-control">' +
                        '<br>' +
                        '<label for="code">Product Code:</label>' +
                        '<input type="text" id="code" name="code" required>' +
                        '<br>' +
                        '<label for="stock">Stock:</label>' +
                        '<input type="number" id="stock" name="stock" required>' +
                        '<br>' +
                        '<label for="category">Category:</label>' +
                        '<input type="text" id="category" name="category" required>' +
                        '<br>' +
                        '<button type="button" id="updateProductBtn">Update Product</button>' +
                    '</form>',
                    showConfirmButton: false,
                    didOpen: () => {
                        const form = document.getElementById('updateProductForm');
                        const updateButton = document.getElementById('updateProductBtn');
                    
                        updateButton.addEventListener('click', async function(e) {
                            const formData = new FormData(form);
        
                            try {
                                const response = await fetch(`/api/products/${productId}`, {
                                    method: "PUT",
                                    body: formData
                                });
        
                                if (response.ok) {
                                    Swal.fire({
                                        title: 'Product Updated',
                                        text: 'The product has been updated successfully',
                                        icon: 'success',
                                        confirmButtonText: 'OK'
                                    });
                                } else {
                                    Swal.fire({
                                        title: 'Error',
                                        text: 'There was an error updating the product',
                                        icon: 'error',
                                        confirmButtonText: 'OK'
                                    });
                                }
                            } catch (error) {
                                Swal.fire({
                                    title: 'Error',
                                    text: 'There was an error updating the product',
                                    icon: 'error',
                                    confirmButtonText: 'OK'
                                });
                            }
                        });
                    }
                });
            }
        });
    }
});