import React, { useState, useEffect } from 'react';

const ColorSearch = () => {
  const [colors, setColors] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/NishantChandla/color-test-resources/main/xkcd-colors.json')
      .then((response) => response.json())
      .then((data) => {
        setColors(data.colors);
        setSearchResults(data.colors); 
      })
      .catch((error) => console.error('Error fetching colors:', error));
  }, []);

  const handleSearch = () => {
    const searchTerm = searchInput.toLowerCase();

    const results = colors.filter((color) =>
      color.color.toLowerCase().includes(searchTerm)
    );

    if (results.length > 0) {
      setSearchResults(results);
    } else {
      setSearchResults([]);
      alert('No matching colors found.');
    }
  };

  const handleInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  return (
    <div>
      <h1>Color Search Tool</h1>
      <input
        type="text"
        placeholder="Enter color name"
        value={searchInput}
        onChange={handleInputChange}
        onKeyPress={(event) => {
          if (event.key === 'Enter') {
            handleSearch();
          }
        }}
      />
      <button onClick={handleSearch}>Search</button>
      {searchResults.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Hex</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.map((color, index) => (
              <tr key={index}>
                <td>{color.color}</td>
                <td>{color.hex}</td>
                <td>{color.rgb}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No matching colors found.</p>
      )}
    </div>
  );
};

export default ColorSearch;
