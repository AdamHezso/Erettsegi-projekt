import { useState } from 'react';

function CheckoutPage() {
  const [form, setForm] = useState({
    name: '', address: '', payment: ''
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    // Itt küldd el a rendelést a szervernek
    alert('Rendelés leadva!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Fizetés és szállítás</h2>
      <input name="name" placeholder="Név" value={form.name} onChange={handleChange} required /><br />
      <input name="address" placeholder="Cím" value={form.address} onChange={handleChange} required /><br />
      <input name="payment" placeholder="Fizetési mód" value={form.payment} onChange={handleChange} required /><br />
      <button type="submit">Fizetés</button>
    </form>
  );
}

export default CheckoutPage;