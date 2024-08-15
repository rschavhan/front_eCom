import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/ProductManager.css';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    imgSrc: '',
    category: '',
    storage: '',
    color: '',
    brand: '',
  });
  const [editProduct, setEditProduct] = useState(null); // State to manage editing
  const [showForm, setShowForm] = useState(false); // State to manage form visibility
  const [showEditForm, setShowEditForm] = useState(false); // State to manage edit form visibility

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addProduct = async () => {
    try {
      const response = await api.post('/products/add', newProduct);
      setProducts([...products, response.data]);
      setNewProduct({
        name: '',
        price: '',
        imgSrc: '',
        category: '',
        storage: '',
        color: '',
        brand: '',
      }); // Reset form after adding product
      setShowForm(false); // Hide the form after adding the product
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter(product => product.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const startEditProduct = (product) => {
    setEditProduct(product);
    setShowEditForm(true);
  };

  const handleEditProductChange = (e) => {
    setEditProduct({
      ...editProduct,
      [e.target.name]: e.target.value,
    });
  };

  const updateProduct = async () => {
    try {
      const response = await api.put(`/products/${editProduct.id}`, editProduct);
      setProducts(products.map(product => 
        product.id === editProduct.id ? response.data : product
      ));
      setEditProduct(null);
      setShowEditForm(false);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleChange = (e) => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleCategoryChange = (e) => {
    setNewProduct({
      ...newProduct,
      category: e.target.value,
    });
  };

  return (
    <div className="product-manager">
      <h2>Product Manager</h2>

      {/* Button to Show Add Product Form */}
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Hide Add Product Form' : 'Show Add Product Form'}
      </button>

      {/* Conditional Rendering of Add Product Form */}
      {showForm && (
        <div className="add-product-form">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={handleChange}
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={newProduct.price}
            onChange={handleChange}
          />
          <input
            type="text"
            name="imgSrc"
            placeholder="Image Source"
            value={newProduct.imgSrc}
            onChange={handleChange}
          />
          <select
            name="category"
            value={newProduct.category}
            onChange={handleCategoryChange}
          >
            <option value="">Select Category</option>
            <option value="Phone">Phone</option>
            <option value="Footwear">Footwear</option>
            <option value="Clothes">Clothes</option>
          </select>
          <input
            type="text"
            name="storage"
            placeholder="Storage"
            value={newProduct.storage}
            onChange={handleChange}
          />
          <input
            type="text"
            name="color"
            placeholder="Color"
            value={newProduct.color}
            onChange={handleChange}
          />
          <input
            type="text"
            name="brand"
            placeholder="Brand"
            value={newProduct.brand}
            onChange={handleChange}
          />
          <button onClick={addProduct}>Add Product</button>
        </div>
      )}

      {/* Conditional Rendering of Edit Product Form */}
      {showEditForm && editProduct && (
        <div className="edit-product-form">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={editProduct.name}
            onChange={handleEditProductChange}
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={editProduct.price}
            onChange={handleEditProductChange}
          />
          <input
            type="text"
            name="imgSrc"
            placeholder="Image Source"
            value={editProduct.imgSrc}
            onChange={handleEditProductChange}
          />
          <select
            name="category"
            value={editProduct.category}
            onChange={handleEditProductChange}
          >
            <option value="">Select Category</option>
            <option value="Phone">Phone</option>
            <option value="Footwear">Footwear</option>
            <option value="Clothes">Clothes</option>
          </select>
          <input
            type="text"
            name="storage"
            placeholder="Storage"
            value={editProduct.storage}
            onChange={handleEditProductChange}
          />
          <input
            type="text"
            name="color"
            placeholder="Color"
            value={editProduct.color}
            onChange={handleEditProductChange}
          />
          <input
            type="text"
            name="brand"
            placeholder="Brand"
            value={editProduct.brand}
            onChange={handleEditProductChange}
          />
          <button onClick={updateProduct}>Update Product</button>
          <button onClick={() => setShowEditForm(false)}>Cancel</button>
        </div>
      )}

      {/* Product List */}
      <ul className="product-list">
        {products.map(product => (
          <li key={product.id}>
            <img src={product.imgSrc} alt={product.name} className="product-image" />
            <div className="product-details">
              <h3>{product.name}</h3>
              <p>₹{product.price}</p>
              <button onClick={() => startEditProduct(product)}>Edit</button>
              <button onClick={() => deleteProduct(product.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductManager;
