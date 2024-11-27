class NewsViewer extends HTMLElement {
    constructor() {
      super();
      this.productsData = [];
    }
  
    connectedCallback() {
      this.loadArticles(); 
    }
    
    async loadArticles() {
      try {
        const response = await fetch("https://products-foniuhqsba-uc.a.run.app/PCs");
        if (!response.ok) {
          throw new Error("Error al obtener los productos");
        }
  
        const products = await response.json();
        this.productsData = products; 
        this.renderArticles(products); 
      } catch (error) {
        console.error("Error:", error.message);
        this.innerHTML = `<p class="text-red-500 text-center">Error al cargar los productos. Inténtelo nuevamente más tarde.</p>`;
      }
    }
  
    renderArticles(products) {
      const template = document.getElementById("article-template");
    

      this.innerHTML = `<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8"></div>`;
      const grid = this.querySelector("div");
    
      products.forEach((product) => {
        const articleContent = document.importNode(template.content, true);
    
        // Configurar contenido dinámico
        articleContent.querySelector("img").src = product.image;
        articleContent.querySelector("img").alt = product.title;
        articleContent.querySelector(".title").textContent = product.title;
        articleContent.querySelector(".short-description").textContent = product.short_description;
        articleContent.querySelector(".date").textContent = product.date;
        articleContent.querySelector(".price").textContent = product.price;
        articleContent.querySelector(".rating").textContent = product.rating + "⭐";
        
        //aqui me aparecera en mi popover
        const popover = articleContent.querySelector("#details-popover");
        popover.innerHTML = `
          <li>RAM: ${product.tags[0] || "No disponible"}</li>
          <li>Almacenamiento: ${product.tags[1] || "No disponible"}</li>
          <li>Procesador: ${product.tags[2] || "No disponible"}</li>
          <li>Pantalla: ${product.tags[3] || "No disponible"}</li>
        `;
    
        // Añadir evento de clic para redirigir a article.html con el ID del producto
        const image = articleContent.querySelector("img");
        const txt = articleContent.querySelector(".title");
        const sd = articleContent.querySelector(".short-description");
        const da = articleContent.querySelector(".date");
        const pr = articleContent.querySelector(".price");
        const ra = articleContent.querySelector(".rating");
        

        //Aqui lo hago clickable cada elemento 
        txt.addEventListener("click", () => {
          window.location.href = `article.html?id=${product.id}`;
        });
 
        sd.addEventListener("click", () => {
          window.location.href = `article.html?id=${product.id}`;
        });

        da.addEventListener("click", () => {
          window.location.href = `article.html?id=${product.id}`;
        });

        pr.addEventListener("click", () => {
          window.location.href = `article.html?id=${product.id}`;
        });

        ra.addEventListener("click", () => {
          window.location.href = `article.html?id=${product.id}`;
        });

        image.addEventListener("click", () => {
          window.location.href = `article.html?id=${product.id}`;
        });
    
        grid.appendChild(articleContent);
      });
    }
  
    //Aqui ordeno por precio
    sortByPrice() {       //[...this.productsData] esto es para hacer una copia de mi array , para no modificar el original y poder volver a trabajar.
      const sortedProducts = [...this.productsData].sort((a, b) => {
        const priceA = parseFloat(a.price.replace("€", "").trim());
        const priceB = parseFloat(b.price.replace("€", "").trim());
        return priceA - priceB; // Orden ascendente
      });
      this.renderArticles(sortedProducts); 
    }
    //Aqui ordeno por precio descendente
    sortByPriceDesc() {
      const sortedProducts = [...this.productsData].sort((a, b) => {
        const priceA = parseFloat(a.price.replace("€", "").trim());
        const priceB = parseFloat(b.price.replace("€", "").trim());
        return priceB - priceA; // Orden descente
      });
      this.renderArticles(sortedProducts); 
    }
  
    //Aqui ordeno por el rate
    sortByRating() {
      const sortedProducts = [...this.productsData].sort((a, b) => b.rating - a.rating); // Orden descendente para que me salgan primero los mejores
      this.renderArticles(sortedProducts); 
    }
  }
  


  customElements.define("news-viewer", NewsViewer);


  document.addEventListener("DOMContentLoaded", () => {
    const newsViewer = document.querySelector("news-viewer");
  

    document.getElementById("sort-by-price").addEventListener("click", () => {
      newsViewer.sortByPrice();
    });
    document.getElementById("sort-by-pricedesc").addEventListener("click", () => {
      newsViewer.sortByPriceDesc();
    });
  

    document.getElementById("sort-by-rating").addEventListener("click", () => {
      newsViewer.sortByRating();
    });
  });
  class CustomSearch extends HTMLElement {
    constructor() {
      super();
      this.products = []; 
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
  

      await this.loadProducts();
    }
  
    async loadProducts() {
      try {
        const response = await fetch("https://products-foniuhqsba-uc.a.run.app/PCs");
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

  customElements.define('custom-search', CustomSearch);
  
  //Aqui funciones de carrito

  function openCart() {
    const dialog = document.getElementById("cart-dialog");
    const cartButton = document.querySelector(`button[onclick="openCart()"]`);
  
    if (cartButton) {
      const rect = cartButton.getBoundingClientRect(); //ES para que me de la ubicacion del boton y poder jugar con el para dejarlo a mi gusto, justo debajo del boton

      dialog.style.position = "absolute";
      dialog.style.top = `${rect.bottom + window.scrollY}px`; 
      dialog.style.left = `${rect.left + window.scrollX -230}px`; 
      dialog.style.margin = "0"; 
    }  
    dialog.classList.remove("hidden"); 
    dialog.showModal();
  }
  

  //AQui los destacados
  document.addEventListener('DOMContentLoaded', async () => {
    const sliderWrapper = document.getElementById('slider-wrapper');
    let currentIndex = 0; 
  
    try {
  
      const response = await fetch('https://products-foniuhqsba-uc.a.run.app/PCs');
      const productos = await response.json();
  
      const topRated = productos
        .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
        .slice(0, 3); // Tomo solo los 3 primeros
  
  
      function renderProducto(index) { 
        const producto = topRated[index];
        sliderWrapper.innerHTML = `
          <div class="p-4 flex-shrink-0">
            <div class="bg-white cursor-pointer rounded-lg overflow-hidden shadow-md p-4">
              <img class="w-full h-48 object-contain mb-4" src="${producto.image}" alt="${producto.title}">
              <h3 class="text-lg font-bold text-gray-900">${producto.title}</h3>
              <p class="text-sm text-gray-600 mb-2">${producto.short_description}</p>
              <p class="text-blue-600 font-bold">${producto.rating} ⭐</p>
            </div>
          </div>
        `;
        const card = sliderWrapper.querySelector('.bg-white');
        card.addEventListener('click', () => {
          window.location.href = `article.html?id=${producto.id}`;
        });
      }

     
  
      // Mostrar el primer producto
      renderProducto(currentIndex);
  
      // Controles del slider
      const prevBtn = document.getElementById('prev-btn');
      const nextBtn = document.getElementById('next-btn');
  
      prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + topRated.length) % topRated.length; //La funcion para que me de el anterior
        renderProducto(currentIndex); //esto es para que vuelve al principio si estamos al final.
      });
  
      nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % topRated.length; //La funcion que me da el siguiente Va al elemento anterior en el array, y salta al final si estamos al principio.
        renderProducto(currentIndex);
      });
    } catch (error) {
      console.error('Error al cargar los productos:', error);
    }
  });

  

  function openModal() {
    document.getElementById('contactModal').classList.remove('hidden');
  }

  function closeModal() {
    document.getElementById('contactModal').classList.add('hidden');
  }
  document.getElementById("contactForm").addEventListener("submit", function (event) {
  event.preventDefault(); 
  alert("Gracias por ponerte en contacto. Te contactaremos en 24 horas.");
  this.reset(); 
});