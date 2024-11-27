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
loadProductDetails();


loadCartFromLocalStorage();
customElements.define('custom-search', CustomSearch);