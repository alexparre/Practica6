cart = [];
let products = [];

loadCartFromLocalStorage()

async function loadProductDetails() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  try {
    const response = await fetch(`https://products-foniuhqsba-uc.a.run.app/PCs`);
    if (!response.ok) throw new Error("Error al obtener los detalles del producto");

    products = await response.json(); 
    const product = products.find((p) => p.id === parseInt(productId));

    if (!product) throw new Error("Producto no encontrado");

    // Renderizar los detalles del producto
    document.getElementById("product-details").innerHTML = `
      <div class="flex flex-col md:flex-row items-center">
        <img class="w-full md:w-1/3 h-80 object-contain rounded-lg mb-6 md:mb-0" src="${product.image}" alt="${product.title}">
        <div class="md:ml-6">
          <h1 class="text-3xl text-black font-bold mb-4">${product.title}</h1>
          <p class="text-black text-lg mb-4">${product.date}</p>
          <p class="text-black text-lg mb-4">${product.description}</p>
         
          <p class="text-2xl font-bold text-blue-500 mb-5">${product.price}</p>
          <ul class="mb-6">
            ${product.tags.map(tag => `<li class="inline-block bg-gray-700 text-white px-3 py-1 rounded-full text-sm mr-2">${tag}</li>`).join("")}
          </ul>
          <h3 class="text-xl text-gray-400 font-semibold mb-2">Características:</h3>
          <ul class="mb-6">
            ${product.features.map(feature => `
              <li class="text-gray-400"><strong>${feature.type}:</strong> ${feature.value}</li>
            `).join("")}
          </ul>
           <p class="text-xl text-gray-400 font-semibold mb-2"><span class="text-gray-400">${product.rating} ⭐</span></p>
          <button onclick="addToCart(${product.id})" class="mb-12 mt-10 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700">
            Añadir al carrito 🛒
          </button>
        </div>
      </div>
    `;
  } catch (error) {
    console.error(error);
    document.getElementById("product-details").innerHTML =
      "<p class='text-center text-red-500'>Error al cargar los detalles del producto. Intente nuevamente más tarde.</p>";
  }
}

function agregadoAlCarrito(){
  const purchaseDialog1 = document.getElementById("purchase-dialog1");
  purchaseDialog1.classList.remove("hidden");
  purchaseDialog1.showModal();
}
// Añadir producto al carrito
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (product) {
    cart.push({
      ...product,
      price: parseFloat(product.price),
    });
    updateCart(); 
    agregadoAlCarrito();

    // Guardar el carrito en localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
  } else {
    console.error("Producto no encontrado para añadir al carrito.");
  }
}
function loadCartFromLocalStorage() {
  const storedCart = localStorage.getItem('cart');
  if (storedCart) {
    cart.length = 0; // Vaciar el carrito actual
    cart.push(...JSON.parse(storedCart)); // Rellenar el carrito con los datos del localStorage
    updateCart(); // Actualizar la visualización del carrito
  }
}

// Actualizar contenido del carrito
function updateCart() {
const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

// Actualizar el contador del carrito
cartCount.textContent = cart.length;
console.log("Cantidad de productos en el carrito:", cart.length); // Verifica el número de productos

// Renderizar los elementos del carrito
cartItems.innerHTML = cart.map(
(item, index) =>
  `<li class="flex items-center justify-between py-4">
<img src="${item.image}" alt="${item.title}" class="w-12 h-12 object-cover rounded-lg shadow-md mr-4">
<div class="flex-1">
  <p class="font-semibold text-gray-800">${item.title}</p>
  <p class="text-sm text-gray-500">${item.price.toFixed(2)} €</p>
</div>
<button onclick="removeFromCart(${index})" class="text-red-500 hover:text-red-700 text-lg font-bold">
  ✖
</button>
</li>`
).join("");
console.log("HTML generado para el carrito:", cartItems.innerHTML); // Verifica el HTML que se está generando

// Calcular el total
const total = cart.reduce((sum, item) => sum + item.price, 0);
cartTotal.textContent = `${total.toFixed(2)} €`;
console.log("Total del carrito:", total.toFixed(2)); // Verifica el total calculado
}

function openCart() {
const dialog = document.getElementById("cart-dialog");
const cartButton = document.querySelector(`button[onclick="openCart()"]`);

if (cartButton) {
  const rect = cartButton.getBoundingClientRect();
  dialog.style.position = "absolute";
  dialog.style.top = `${rect.bottom + window.scrollY}px`; 
  dialog.style.left = `${rect.left + window.scrollX -230}px`; 
  dialog.style.margin = "0"; 
}

dialog.classList.remove("hidden"); // Mostrar el diálogo
dialog.showModal();
}

// Cerrar el diálogo del carrito
function closeCart() {
  const dialog = document.getElementById("cart-dialog");
  dialog.close();
}

// Cargar los detalles del producto al cargar la página
loadProductDetails();

function proceedToCheckout() {
  if (cart.length === 0) {
    alert("Tu carrito está vacío. Añade productos antes de pagar.");
    return;
  }
  localStorage.removeItem('cart');
  // Vaciar el carrito
  cart.length = 0;
  updateCart(); // Actualizar el contenido del carrito

  // Mostrar el mensaje de confirmación
  const purchaseDialog = document.getElementById("purchase-dialog");
  purchaseDialog.classList.remove("hidden");
  purchaseDialog.showModal();

  // Cerrar el diálogo del carrito
  closeCart();
}

function removeFromCart(index) {
  cart.splice(index, 1); // Eliminar el producto del carrito por su índice
  localStorage.setItem('cart', JSON.stringify(cart)); // Actualizar el carrito en localStorage
  updateCart(); // Volver a renderizar el carrito
}
function cerrarDialog() {
  const purchaseDialog1 = document.getElementById("purchase-dialog1");
  purchaseDialog1.close();
  purchaseDialog1.classList.add("hidden");
}

// Función para cerrar el diálogo de confirmación de compra
function closePurchaseDialog() {
  const purchaseDialog = document.getElementById("purchase-dialog");
  purchaseDialog.close();
  purchaseDialog.classList.add("hidden");
}
