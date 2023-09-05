import React, { useState, useEffect } from 'react';

const CodeSearch = () => {
  const [colors, setColors] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/NishantChandla/color-test-resources/main/xkcd-colors.json')
      .then((response) => response.json())
      .then((data) => {
        setColors(data.colors);
      })
      .catch((error) => console.error('Error fetching colors:', error));
  }, []);

  const calculateColorDistance = (color1, color2) => {
    const r1 = color1.rgb ? parseInt(color1.rgb.slice(4, -1).split(',')[0]) : 0;
    const g1 = color1.rgb ? parseInt(color1.rgb.slice(4, -1).split(',')[1]) : 0;
    const b1 = color1.rgb ? parseInt(color1.rgb.slice(4, -1).split(',')[2]) : 0;

    const r2 = parseInt(color2.rgb.slice(4, -1).split(',')[0]);
    const g2 = parseInt(color2.rgb.slice(4, -1).split(',')[1]);
    const b2 = parseInt(color2.rgb.slice(4, -1).split(',')[2]);

    return Math.sqrt((r2 - r1) ** 2 + (g2 - g1) ** 2 + (b2 - b1) ** 2);
  };

  const handleSearch = () => {
    const searchTerm = searchInput.replace('#', '').toLowerCase();
    let updatedColors = [...colors];

    if (/^[0-9A-Fa-f]{6}$/i.test(searchTerm)) {
      const matchIndex = updatedColors.findIndex((color) => color.hex.slice(1).toLowerCase() === searchTerm);

      if (matchIndex !== -1) {
        const matchedColor = updatedColors.splice(matchIndex, 1);
        updatedColors = [matchedColor[0], ...updatedColors];
      }

      updatedColors.sort((color1, color2) => calculateColorDistance(color1, { rgb: `#${searchTerm}` }) - calculateColorDistance(color2, { rgb: `#${searchTerm}` }));

      setSearchResults(updatedColors);
    } else {
      setSearchResults([]);
      alert('Invalid color code. Please enter a valid CSS color code in hex format (e.g., "#FF0000" or "FF0000").');
    }
  };

  return (
    <div>
      <h1>Color_Code Search Tool</h1>
      <input
        type="text"
        placeholder="Enter CSS color code (e.g., #FF0000 or FF0000)"
        value={searchInput}
        onChange={(event) => setSearchInput(event.target.value)}
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

export default CodeSearch;
