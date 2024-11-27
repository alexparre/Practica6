function openModal() {
    document.getElementById('contactModal').classList.remove('hidden');
  }

  function closeModal() {
    document.getElementById('contactModal').classList.add('hidden');
  }
// Función para cargar y filtrar productos
async function loadAppleProducts() {
try {
  console.log("Iniciando la carga de productos...");

  // Obtener productos desde la API
  const response = await fetch("https://products-foniuhqsba-uc.a.run.app/PCs");
  console.log("Respuesta de la API:", response);

  if (!response.ok) {
    throw new Error("Error al obtener los productos.");
  }

  const products = await response.json(); // Parsear productos
  console.log("Productos obtenidos:", products);

  // Filtrar productos relacionados con Apple
  const appleProducts = products.filter((product) =>
    product.title.includes("Apple")
  );
  console.log("Productos Apple:", appleProducts);

  // Renderizar los productos en el grid
  renderProducts(appleProducts);
} catch (error) {
  console.error("Error al cargar los productos:", error);
  document.getElementById("products-grid").innerHTML = `
    <p class="text-red-500 text-center col-span-4">Error al cargar los productos. Inténtelo más tarde.</p>`;
}
}

// Función para renderizar productos en el grid
function renderProducts(products) {
const grid = document.getElementById("products-grid");
const template = document.getElementById("article-template");

// Limpiar el contenido actual
grid.innerHTML = "";

if (products.length === 0) {
  grid.innerHTML =
    '<p class="text-center col-span-4">No se encontraron productos Apple.</p>';
  return;
}

// Renderizar cada producto
products.forEach((product) => {
  const productElement = document.importNode(template.content, true);

  // Configurar los elementos del producto
  productElement.querySelector("img").src = product.image;
  productElement.querySelector("img").alt = product.title;
  productElement.querySelector(".title").textContent = product.title;
  productElement.querySelector(".short-description").textContent =
    product.short_description;
  productElement.querySelector(".price").textContent = product.price


  // Crear un enlace dinámico que redirija a article.html con el ID del producto
  const productLink = document.createElement("a");
  productLink.href = `article.html?id=${product.id}`;
  productLink.classList.add("block", "hover:underline"); // Agregar clases para estilo

  // Añadir el contenido del producto al enlace
  productLink.appendChild(productElement);

  // Agregar el enlace al grid
  grid.appendChild(productLink);
});
}

// Llamar a la función al cargar la página
document.addEventListener("DOMContentLoaded", loadAppleProducts);
class CustomSearch extends HTMLElement {
  constructor() {
    super();
    this.products = []; // Guardará los productos cargados desde la API
  }

  async connectedCallback() {
    const dialogBtn = this.querySelector('.dialog-search');
    const closeBtn = this.querySelector('.close-btn');
    const dialog = this.querySelector('dialog');

    dialogBtn.addEventListener('click', () => {
      dialog.showModal();
    });

    closeBtn.addEventListener('click', () => {
      dialog.close();
    });

    const siteSearch = this.querySelector('#site-search');
    siteSearch.addEventListener('input', (event) => this.search(event));

    // Cargar productos desde la API
    await this.loadProducts();
  }

  async loadProducts() {
    try {
      const response = await fetch("https://products-foniuhqsba-uc.a.run.app/PCs");
      if (!response.ok) {
        throw new Error("Error al cargar los productos");
      }

      this.products = await response.json(); // Guardar productos en la instancia
    } catch (error) {
      console.error("Error al cargar los productos:", error.message);
    }
  }

  search(event) {
    event.preventDefault();
    const siteSearch = this.querySelector('#site-search');
    const term = siteSearch.value;
    this.renderResults(term);
  }

  renderResults(term = '') {
    const searchResults = this.querySelector('#search-results');
    searchResults.innerHTML = '';

    if (term.trim() === '') return;

    const filteredProducts = this.products.filter(product =>
      product.title.toLowerCase().includes(term.toLowerCase())
    );

    const template = this.querySelector('template').content;

    filteredProducts.map(product => {
      const li = template.querySelector('li').cloneNode(true);

      // Crear un enlace dinámico
      const link = document.createElement('a');
      link.href = `article.html?id=${product.id}`;
      link.style.textDecoration = 'none';
      link.style.color = 'inherit';

      li.querySelector('.card .item-image').src = product.image;
      li.querySelector('.card .item-title').textContent = product.title;
      li.querySelector('.card .item-descripcion').textContent = product.rating+"⭐";
      li.querySelector('.card .item-price').textContent = product.price;


      link.appendChild(li);
      searchResults.appendChild(link);
    });
  }
}

// Registrar el Custom Element
customElements.define('custom-search', CustomSearch);

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
      dialog.style.left = `${rect.left + window.scrollX -230}px`; 
      dialog.style.margin = "0"; // Sin márgenes automáticos
    }  
    dialog.classList.remove("hidden"); 
    dialog.showModal();
  }