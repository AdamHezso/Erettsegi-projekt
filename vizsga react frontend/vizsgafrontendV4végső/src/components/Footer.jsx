import React from 'react';

function getRandomPhone() {
  const nums = [
    '+36 20', '+36 30', '+36 70', '+36 1'
  ];
  const prefix = nums[Math.floor(Math.random() * nums.length)];
  const number = Math.floor(1000000 + Math.random() * 9000000);
  return `${prefix} ${number}`;
}

function getRandomEmail() {
  const names = ['info', 'kapcsolat', 'ugyfelszolgalat', 'support', 'hello'];
  const domains = ['gmail.com', 'freemail.hu', 'yahoo.com', 'protonmail.com'];
  const name = names[Math.floor(Math.random() * names.length)];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${name}${Math.floor(Math.random()*100)}@${domain}`;
}

function getRandomInsta() {
  const base = ['autoshop', 'alkatreszbolt', 'carparts', 'autobolt', 'alkatreszshop'];
  return `@${base[Math.floor(Math.random()*base.length)]}${Math.floor(Math.random()*1000)}`;
}

const Footer = ({ phone, email, insta }) => {
  return (
    <footer style={{ background: '#222', color: '#fff', padding: '1.5rem 0', marginTop: 40, textAlign: 'center' }}>
      <div>Phone Number: {phone}</div>
      <div>Email: {email}</div>
      <div>Instagram: {insta}</div>
    </footer>
  );
};

export default Footer;
