import React, { useEffect, useState } from "react";
import "./ShopPage.css";

// Shop page: displays all parts, search, and add to cart functionality
const ShopPage = ({ onAddToCart }) => {
  const [parts, setParts] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/parts")
      .then((res) => res.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : [];
        setParts(arr);
        setFiltered(arr);
      });
  }, []);

  useEffect(() => {
    setFiltered(
      parts.filter((part) =>
        typeof part.name === "string" &&
        part.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, parts]);

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">Shop</h2>
      <form
        style={{ marginBottom: "20px" }}
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>
      <div className="row g-3">
        {filtered.map((part) => (
          <div key={part.id} className="col-12 col-sm-6 col-lg-3">
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{part.name}</h5>
                <p className="card-text">
                  Price: {part.price ? part.price + " Ft" : "N/A"}
                </p>
                <p className="card-text">
                  Stock: {part.stock !== undefined ? part.stock : "N/A"}
                </p>
                <button
                  className="btn btn-success mt-auto w-100"
                  onClick={() => onAddToCart(part)}
                >
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopPage;