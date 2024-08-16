import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios'; // Add this line
import { AppContext } from '../context/AppContext';
import { useSearch } from '../context/SearchContext';
import { FaHeart, FaRegHeart } from 'react-icons/fa'; // Import icons
import Modal from '../components/Modal'; // Import Modal
import '../styles/Products.css';

// ...rest of your component


const Products = () => {
  const { addToCart, wishlist, addToWishlist, removeFromWishlist, userId } = useContext(AppContext);
  const { searchQuery } = useSearch();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categories, setCategories] = useState({
    all: true,
    phone: false,
    footwear: false,
    clothes: false,
  });

  // Fetch products from API when component mounts
  useEffect(() => {
    axios.get('http://localhost:8080/api/products')
      .then(response => {
        setProducts(response.data);
        setFilteredProducts(response.data); // Set initially filtered products
      })
      .catch(error => {
        console.error('Failed to fetch products:', error);
      });
  }, []);

  // Filter products based on searchQuery and selected categories
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    let filtered = products.filter(product =>
      product.name.toLowerCase().includes(query)
    );

    if (!categories.all) {
      filtered = filtered.filter(product => {
        if (categories.phone && product.category.toLowerCase() === 'phone') return true;
        if (categories.footwear && product.category.toLowerCase() === 'footwear') return true;
        if (categories.clothes && product.category.toLowerCase() === 'clothes') return true;
        return false;
      });
    }

    setFilteredProducts(filtered);
  }, [searchQuery, categories, products]);

  const handleCategoryChange = (e) => {
    const { name, checked } = e.target;
    setCategories(prevState => {
      if (name === 'all') {
        return {
          all: checked,
          phone: false,
          footwear: false,
          clothes: false,
        };
      } else {
        const newState = {
          ...prevState,
          [name]: checked,
          all: false,
        };
        if (!newState.phone && !newState.footwear && !newState.clothes) {
          newState.all = true;
        }
        return newState;
      }
    });
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseProductCard = () => {
    setSelectedProduct(null);
  };

  const handleWishlistToggle = (product) => {
    if (!userId) {
      console.error('User not logged in.');
      return;
    }

    if (wishlist.some(item => item.id === product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="products-container">
      <div className="category-filter">
        <label>
          <input
            type="checkbox"
            name="all"
            checked={categories.all}
            onChange={handleCategoryChange}
          />
          All Products
        </label>
        <label>
          <input
            type="checkbox"
            name="phone"
            checked={categories.phone}
            onChange={handleCategoryChange}
          />
          Phones
        </label>
        <label>
          <input
            type="checkbox"
            name="footwear"
            checked={categories.footwear}
            onChange={handleCategoryChange}
          />
          Footwear
        </label>
        <label>
          <input
            type="checkbox"
            name="clothes"
            checked={categories.clothes}
            onChange={handleCategoryChange}
          />
          Clothes
        </label>
      </div>

      <div className="products">
        <div className="product-list">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <div key={product.id} className="product" onClick={() => handleProductClick(product)}>
                <img src={product.imgSrc} alt={product.name} />
                <h3>{product.name}</h3>
                <p>₹ {product.price}</p>
                <div className="product-actions">
                  <button onClick={(e) => { e.stopPropagation(); addToCart(product); }}>Add to Cart</button>
                  <div className="wishlist-icon" onClick={(e) => { e.stopPropagation(); handleWishlistToggle(product); }}>
                    {wishlist.some(item => item.id === product.id) ? <FaHeart color="red" /> : <FaRegHeart />}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No products found</p>
          )}
        </div>
      </div>

      <Modal
        isOpen={!!selectedProduct}
        onClose={handleCloseProductCard}
        product={selectedProduct}
      />
    </div>
  );
};

export default Products;
