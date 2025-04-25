import { useState, useEffect } from 'react';

function WeeklyOffers() {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/products/weekly-offers')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Hiba a heti ajánlatok lekérdezésekor');
        }
        return response.json();
      })
      .then((data) => setOffers(data))
      .catch((error) => console.error(error));
  }, []);

  const handleAddToCart = (productId) => {
    // Kosárhoz adás logika
    fetch('http://localhost:3000/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Hiba a termék kosárhoz adásakor');
        }
        return response.json();
      })
      .then(() => {
        alert('Termék sikeresen hozzáadva a kosárhoz!');
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="weekly-offers">
      <h2>Heti ajánlatok</h2>
      <div className="offers-grid">
        {offers.map((offer) => (
          <div className="offer-card" key={offer.id}>
            <img src={offer.image} alt={offer.name} className="offer-image" />
            <h3>{offer.name}</h3>
            <p>{offer.description}</p>
            <p><strong>{offer.price} Ft</strong></p>
            <button onClick={() => handleAddToCart(offer.id)}>Kosárba</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeeklyOffers;