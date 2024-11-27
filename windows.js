
function loadCartFromLocalStorage() {
  const storedCart = localStorage.getItem('cart');
  if (storedCart) {
    cart.length = 0; // Vaciar el carrito actual
    cart.push(...JSON.parse(storedCart)); // Rellenar el carrito con los datos del localStorage
    updateCart(); // Actualizar la visualización del carrito
  }
}
async function loadAppleProducts() {
  try {
    console.log("Iniciando la carga de productos...");


    const response = await fetch(
      "https://products-foniuhqsba-uc.a.run.app/PCs"
    );
    console.log("Respuesta de la API:", response);

    if (!response.ok) {
      throw new Error("Error al obtener los productos.");
    }

    const products = await response.json(); 
    console.log("Productos obtenidos:", products);

   
    const appleProducts = products.filter(
      (product) => !product.title.includes("Apple")
    );
    console.log("Productos Apple:", appleProducts);

    renderProducts(appleProducts);
  } catch (error) {
    console.error("Error al cargar los productos:", error);
    document.getElementById("products-grid").innerHTML = `
        <p class="text-red-500 text-center col-span-4">Error al cargar los productos. Inténtelo más tarde.</p>`;
  }
}

function renderProducts(products) {
  const grid = document.getElementById("products-grid");
  const template = document.getElementById("article-template");

  grid.innerHTML = "";

  if (products.length === 0) {
    grid.innerHTML =
      '<p class="text-center col-span-4">No se encontraron productos Apple.</p>';
    return;
  }

  products.forEach((product) => {
    const productElement = document.importNode(template.content, true);

    productElement.querySelector("img").src = product.image;
    productElement.querySelector("img").alt = product.title;
    productElement.querySelector(".title").textContent = product.title;
    productElement.querySelector(".short-description").textContent =
      product.short_description;
    productElement.querySelector(".price").textContent = product.price;
    // Crear un enlace dinámico que redirija a article.html con el ID del producto
    const productLink = document.createElement("a");
    productLink.href = `article.html?id=${product.id}`;
    productLink.classList.add("block", "hover:underline"); 

 
    productLink.appendChild(productElement);


    grid.appendChild(productLink);
  });
}


document.addEventListener("DOMContentLoaded", loadAppleProducts);
class CustomSearch extends HTMLElement {
  constructor() {
    super();
    this.products = []; 
  }

  async connectedCallback() {
    const dialogBtn = this.querySelector(".dialog-search");
    const closeBtn = this.querySelector(".close-btn");
    const dialog = this.querySelector("dialog");

    dialogBtn.addEventListener("click", () => {
      dialog.showModal();
    });

    closeBtn.addEventListener("click", () => {
      dialog.close();
    });

    const siteSearch = this.querySelector("#site-search");
    siteSearch.addEventListener("input", (event) => this.search(event));

    await this.loadProducts();
  }

  async loadProducts() {
    try {
      const response = await fetch(
        "https://products-foniuhqsba-uc.a.run.app/PCs"
      );
      if (!response.ok) {
        throw new Error("Error al cargar los productos");
      }

      this.products = await response.json();
    } catch (error) {
      console.error("Error al cargar los productos:", error.message);
    }
  }

  search(event) {
    event.preventDefault();
    const siteSearch = this.querySelector("#site-search");
    const term = siteSearch.value;
    this.renderResults(term);
  }

  renderResults(term = "") {
    const searchResults = this.querySelector("#search-results");
    searchResults.innerHTML = "";

    if (term.trim() === "") return;

    const filteredProducts = this.products.filter((product) =>
      product.title.toLowerCase().includes(term.toLowerCase())
    );

    const template = this.querySelector("template").content;

    filteredProducts.map((product) => {
      const li = template.querySelector("li").cloneNode(true);

      const link = document.createElement("a");
      link.href = `article.html?id=${product.id}`;
      link.style.textDecoration = "none";
      link.style.color = "inherit";

      li.querySelector(".card .item-image").src = product.image;
      li.querySelector(".card .item-title").textContent = product.title;
      li.querySelector(".card .item-descripcion").textContent =
        product.rating + "⭐";
      li.querySelector(".card .item-price").textContent = product.price;

      link.appendChild(li);
      searchResults.appendChild(link);
    });
  }
}

function closeCart() {
  const dialog = document.getElementById("cart-dialog");
  dialog.close();
}
function openCart() {
  const dialog = document.getElementById("cart-dialog");
  const cartButton = document.querySelector(`button[onclick="openCart()"]`);

  if (cartButton) {
    const rect = cartButton.getBoundingClientRect();

    dialog.style.position = "absolute";
    dialog.style.top = `${rect.bottom + window.scrollY}px`;
    dialog.style.left = `${rect.left + window.scrollX - 230}px`;
    dialog.style.margin = "0"; 
  }
  dialog.classList.remove("hidden");
  dialog.showModal();
}

loadCartFromLocalStorage
customElements.define("custom-search", CustomSearch);

