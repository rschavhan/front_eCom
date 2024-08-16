import React, { createContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]); 
  const [userName, setUserName] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState([]);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [totalAmount, setTotalAmount] = useState(0); // State for total amount
  const navigate = useNavigate();
  // Function to calculate the total amount in the cart
  const calculateTotalAmount = () => {
    const amount = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    setTotalAmount(amount);
  };

  // Call calculateTotalAmount whenever the cart updates
  useEffect(() => {
    calculateTotalAmount();
  }, [cart]);

  // Function to fetch the cart data from the API
  const fetchCart = useCallback(async () => {
    if (!userId) return;

    try {
      console.log('Fetching cart for user ID:', userId);
      const response = await api.get(`/cart/${userId}`, { withCredentials: true });
      console.log('Cart data:', response.data);
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Error fetching cart');
    }
  }, [userId]);

  // Effect to retrieve user data from local storage on initial load
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedUserRole = localStorage.getItem('userRole');
    const storedUserName = localStorage.getItem('userName');

    if (storedUserId) {
      setUserId(storedUserId);
    }

    if (storedUserRole) {
      try {
        setUserRole(JSON.parse(storedUserRole));
      } catch (error) {
        console.error('Error parsing userRole from localStorage:', error);
        setUserRole([]); // Default to empty array if parsing fails
      }
    }

    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  // Effect to fetch the cart data whenever userId changes
  useEffect(() => {
    if (userId) {
      fetchCart();
    }
  }, [userId, fetchCart]);

  const addToCart = async (item) => {
    console.log("Adding item to cart:", item);
    if (!userId) {
        toast.error('Please log in to add items to the cart.');
        return;
    }
    try {
        // Check if the item already exists in the cart
        const existingItem = cart.find(cartItem => cartItem.product.id === item.id);

        if (existingItem) {
            // If item exists, update the quantity by 1
            const newQuantity = existingItem.quantity + 1;
            console.log(`Item already in cart. Updating quantity to ${newQuantity}`);

            // Update the quantity on the server
            const response = await api.post(`/cart/add`, null, {
                params: { userId, productId: item.id, quantity: newQuantity },
                withCredentials: true
            });

            console.log('Server response:', response.data);

            // Update local cart state
            setCart(prevCart =>
                prevCart.map(cartItem =>
                    cartItem.product.id === item.id ? { ...cartItem, quantity: newQuantity } : cartItem
                )
            );
        } else {
            // If item does not exist, add it to the cart
            console.log('Item not in cart. Adding item.');

            const response = await api.post(`/cart/add`, null, {
                params: { userId, productId: item.id, quantity: 1 },
                withCredentials: true
            });

            console.log('Server response:', response.data);

            // Add new item to local cart state
            setCart(prevCart => [...prevCart, { product: item, quantity: 1 }]);
        }

        toast.success('Product added successfully to cart!');
    } catch (error) {
        console.error('Error adding product to cart:', error);
        //toast.error('Error adding product to cart.');
    }
};


  // Function to handle quantity change in the cart
  const handleQuantityChange = async (cartId, quantity) => {
    try {
      await api.put(`/cart/${cartId}?quantity=${quantity}`, {}, { withCredentials: true });
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === cartId ? { ...item, quantity } : item
        )
      );
      calculateTotalAmount(); // Recalculate total amount
      toast.success('Quantity updated successfully!');
    } catch (error) {
      console.error('Error updating quantity:', error);
      //toast.error('Error updating quantity.');
    }
  };

 
const removeFromCart = async (id) => {
  try {
      await api.delete(`/cart/${id}`, { withCredentials: true });

      // Use a callback to ensure you get the latest cart state
      setCart((prevCart) => prevCart.filter(item => item.product.id !== id));
      //toast.success('Item removed successfully!');

      // Optionally, re-fetch the cart to ensure consistency
      fetchCart();
  } catch (error) {
      //console.error('Error removing item:', error);
      //toast.error('Error removing item');
  }
};


  // Function to handle user login
  const login = (userName, userId, roleName) => {
    setUserId(userId);
    setUserRole(roleName);
    setUserName(userName);
    localStorage.setItem('userId', userId);
    localStorage.setItem('userRole', JSON.stringify(roleName));
    localStorage.setItem('userName', userName);

    fetchCart();
    toast.success('Login successful!');
  };

  const fetchWishlist = useCallback(async () => {
    if (!userId) return;
  
    try {
      const response = await api.get(`/wishlist/${userId}`, { withCredentials: true });
      setWishlist(response.data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Error fetching wishlist');
    }
  }, [userId]);
  
  // The rest of the AppContext code remains unchanged...
  



// Function to add an item to the wishlist
const addToWishlist = async (item) => {
  if (!userId) {
    toast.error('Please log in to add items to the wishlist.');
    return;
  }

  try {
    await api.post('/wishlist/add', {
      userId,
      productId: item.id
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });

    setWishlist(prevWishlist => [...prevWishlist, item]);
    toast.success('Product added to wishlist!');
  } catch (error) {
    toast.error('Error adding product to wishlist');
    console.error('Error:', error);
  }
};

// Function to remove an item from the wishlist
const removeFromWishlist = async (productId) => {
  if (!userId) {
    toast.error('Please log in to remove items from the wishlist.');
    return;
  }


   // Log the values to the console
   console.log('Removing item from wishlist:');
   console.log('Product ID:', productId);
   console.log('User ID:', userId);
  try {
    await api.delete(`/wishlist/${userId}/${productId}`, { withCredentials: true });

    setWishlist(prevWishlist => prevWishlist.filter(item => item.id !== productId));
    toast.success('Item removed from wishlist!');
  } catch (error) {
    
  }
};








  // Function to handle user logout
  const logout = async () => {
    setIsLoggingOut(true);
    setLogoutMessage('');
    try {
      await api.post('/auth/logout', {}, { withCredentials: true });
      setUserId(null);
      setUserRole([]);
      setCart([]);
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
      navigate('/login');
      setLogoutMessage('Logged out successfully!');
      toast.success('Logged out successfully!');

    } catch (error) {
      console.error('Error logging out:', error.response ? error.response.data : error.message);
      setLogoutMessage('Error logging out. Please try again.');
      toast.error('Error logging out');
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Function to update the search query state
  const updateSearchQuery = (query) => {
    setSearchQuery(query);
  };

  const clearCart = async () => {
    try {
        // Send a request to clear the cart on the backend
        await api.delete(`/cart/user/${userId}`, { withCredentials: true });
        
        // Update the cart state to reflect the cleared cart
        setCart([]);
        
        toast.success('Cart cleared successfully!');
    } catch (error) {
        console.error('Error clearing cart:', error);
        toast.error('Error clearing cart');
    }
  }



    const changeUserRole = async (userId, newRoleId) => {
      try {
        await api.put('/admin/users/update-role', { userId, newRoleId });
        // Fetch user data again to update state
        fetchCart(); 
        toast.success('User role updated successfully!');
      } catch (error) {
        console.error('Error updating user role:', error);
        toast.error('Error updating user role');
      }
    };

  return (
    <AppContext.Provider value={{ totalAmount, cart, addToCart, removeFromCart, wishlist,
      addToWishlist,fetchWishlist,handleQuantityChange,
      removeFromWishlist, userName, userId, userRole, login, isLoggingOut, logout, logoutMessage, searchQuery, updateSearchQuery, fetchCart,clearCart , changeUserRole}}>
      {children}
    </AppContext.Provider>
  );
};
