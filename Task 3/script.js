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
      <p>Price: $${product.price}</p>
    `;
    productList.appendChild(productCard);
  });
}


  products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'product';
    productCard.innerHTML = `
      <img src="${product.thumbnail}" alt="${product.title}">
      <h4>${product.title}</h4>
      <p>Price: $${product.price}</p>
    `;
    productList.appendChild(productCard);
  });

