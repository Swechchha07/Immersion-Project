document.getElementById('searchBtn').addEventListener('click', () => {
  const query = document.getElementById('searchBar').value.trim();
    if (!query) {
    alert('Search field cannot be empty!');
    return;
  }

  fetch(`https://dummyjson.com/products/search?q=${query}`)
    .then(res => res.json())
    .then(data => displayProducts(data.products))
    .catch(err => console.error('Error:', err));
});

function displayProducts(products) {
  const sortValue = document.getElementById('sort').value;
  const brandValue = document.getElementById('brand').value.toLowerCase();
  const minPrice = parseFloat(document.getElementById('minPrice').value);
  const maxPrice = parseFloat(document.getElementById('maxPrice').value);

  
  if (brandValue) {
    products = products.filter(p => p.brand.toLowerCase().includes(brandValue));
  }

 
  products = products.filter(p => {
    return (!isNaN(minPrice) ? p.price >= minPrice : true) &&
           (!isNaN(maxPrice) ? p.price <= maxPrice : true);
  });


  if (sortValue === 'asc') {
    products.sort((a, b) => a.price - b.price);
  } else if (sortValue === 'desc') {
    products.sort((a, b) => b.price - a.price);
  }

 
  const productList = document.getElementById('productList');
  productList.innerHTML = '';

  if (products.length === 0) {
    productList.innerHTML = '<p>No products found.</p>';
    return;
  }

 
  products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'product';
    productCard.innerHTML = `
      <img src="${product.thumbnail}" alt="${product.title}">
      <h4>${product.title}</h4>
      <p>Brand: ${product.brand}</p>
      <p>Price: $${product.price}</p>
    `;
    productList.appendChild(productCard);
  });
};

