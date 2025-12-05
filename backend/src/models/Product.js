const crypto = require('crypto');

const products = [
  { id: '1', name: 'Savon Écologique', price: 9.99, category: 'savons', stock: 100 },
  { id: '2', name: 'Nettoyant Multi-Surface', price: 12.99, category: 'nettoyants', stock: 150 },
  { id: '3', name: 'Détergent Bio', price: 14.99, category: 'detergents', stock: 80 },
  { id: '4', name: 'Spray Désinfectant', price: 10.99, category: 'nettoyants', stock: 120 },
];

class Product {
  static getAll() {
    return products;
  }

  static getById(id) {
    return products.find(p => p.id === id);
  }

  static create(name, price, category, stock) {
    const product = {
      id: crypto.randomUUID(),
      name,
      price,
      category,
      stock,
    };
    products.push(product);
    return product;
  }
}

module.exports = Product;
