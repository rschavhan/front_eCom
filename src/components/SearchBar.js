import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import api from '../services/api';
import debounce from 'lodash.debounce';

const SearchBar = () => {
  const { searchQuery, updateSearchQuery } = useContext(AppContext);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Fetch products matching the search query
  const fetchSearchResults = async (query) => {
    if (query.length === 0) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await api.get(`/products/search`, {
        params: { query },
        withCredentials: true,
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce the fetchSearchResults function to limit API calls
  const debouncedFetchSearchResults = debounce(fetchSearchResults, 300);

  // Update search results as searchQuery changes
  useEffect(() => {
    debouncedFetchSearchResults(searchQuery);
    return () => debouncedFetchSearchResults.cancel();
  }, [searchQuery]);

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search for products..."
        value={searchQuery}
        onChange={(e) => updateSearchQuery(e.target.value)}
        className="search-input"
      />
      {isSearching && <div className="search-loading">Searching...</div>}
      {searchResults.length > 0 && (
        <ul className="search-results">
          {searchResults.map((product) => (
            <li key={product.id} className="search-result-item">
              {product.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
