document.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const taxElement = document.getElementById('tax');
    const TAX_RATE = 0.08;

    fetch('products.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            displayProducts(data);
            initializeCartButtons(data);
        })
        .catch(error => console.error('Error fetching products:', error));

    const displayProducts = (products) => {
        const productGallery = document.querySelector('.product-gallery');
        if (!productGallery) return;
        productGallery.innerHTML = ''; // Clear existing products
        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product');
            productDiv.setAttribute('data-name', product.name);
            productDiv.setAttribute('data-price', product.price);

            productDiv.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="overlay">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <button class="add-to-cart">Add to Cart</button>
                </div>
            `;
            productGallery.appendChild(productDiv);
        });
    };

    const showNotification = (message) => {
        const notification = document.getElementById('notification');
        if (notification) {
            notification.textContent = message;
            notification.style.display = 'block';
            setTimeout(() => {
                notification.style.display = 'none';
            }, 3000); // Hide the notification after 3 seconds
        }
    };

    const initializeCartButtons = (products) => {
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', event => {
                const productElement = event.target.closest('.product');
                const productName = productElement.getAttribute('data-name');
                const productPrice = parseFloat(productElement.getAttribute('data-price'));

                const product = cart.find(item => item.name === productName);
                if (product) {
                    product.quantity += 1;
                } else {
                    cart.push({ name: productName, price: productPrice, quantity: 1 });
                }
                updateCart();
                localStorage.setItem('cart', JSON.stringify(cart));
                showNotification(`"${productName}" added to cart`);
            });
        });
    };

    const updateCart = () => {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        cart.forEach(item => {
            total += item.price * item.quantity;
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <span>${item.name} x ${item.quantity}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
        cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);

        const tax = total * TAX_RATE;
        const grandTotal = total + tax;

        taxElement.textContent = `Tax: $${tax.toFixed(2)}`;
        totalPriceElement.textContent = `Total: $${grandTotal.toFixed(2)}`;
    };

    const clearCart = () => {
        localStorage.removeItem('cart'); // Clear cart from local storage
        cart.length = 0; // Clear cart array
        updateCart(); // Update cart display
    };

    document.getElementById('checkout').addEventListener('click', () => {
        alert('Checkout successful. Thank you for your purchase!');
        clearCart(); // Clear the cart after checkout
    });

    // Clear Cart functionality
    const clearCartButton = document.getElementById('clear-cart');
    if (clearCartButton) {
        clearCartButton.addEventListener('click', clearCart);
    } else {
        console.error('Clear Cart button not found.');
    }

    updateCart(); // Initial call to display cart on page load
});
