import { useState, useEffect } from 'react';

function StorePage() {
  const [parts, setParts] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/parts')
      .then(res => res.json())
      .then(data => setParts(data))
      .catch(err => console.error(err));
  }, []);

  const filtered = parts.filter(part =>
    part.nev.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Keresés alkatrészre..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <div>
        {filtered.map(part => (
          <div key={part.id}>
            {part.nev} - {part.ar} Ft
          </div>
        ))}
      </div>
    </div>
  );
}

export default StorePage;