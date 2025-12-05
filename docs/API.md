# API Documentation

## Base URL

```
Development: http://localhost:5000/api
Production: https://api.ekonzims.com/api
```

## Authentification

Utilisez JWT Bearer Token dans les headers:

```
Authorization: Bearer <your_jwt_token>
```

## Status Codes

- `200 OK` - Requête réussie
- `201 Created` - Ressource créée
- `400 Bad Request` - Erreur de validation
- `401 Unauthorized` - Authentification requise
- `403 Forbidden` - Accès refusé
- `404 Not Found` - Ressource non trouvée
- `500 Server Error` - Erreur serveur

## Endpoints

### Authentification

#### Register
```http
POST /users/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "firstName": "John",
  "lastName": "Doe"
}

Response: 201 Created
{
  "id": "60d5ec49f1b2c72d8c8e4a0a",
  "email": "user@example.com",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Login
```http
POST /users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123"
}

Response: 200 OK
{
  "id": "60d5ec49f1b2c72d8c8e4a0a",
  "email": "user@example.com",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Produits

#### Lister les produits
```http
GET /products?category=savons&limit=10&page=1

Response: 200 OK
{
  "total": 50,
  "page": 1,
  "limit": 10,
  "products": [
    {
      "id": "60d5ec49f1b2c72d8c8e4a0a",
      "name": "Savon Écologique",
      "price": 9.99,
      "category": "savons",
      "stock": 100
    }
  ]
}
```

#### Détails produit
```http
GET /products/60d5ec49f1b2c72d8c8e4a0a

Response: 200 OK
{
  "id": "60d5ec49f1b2c72d8c8e4a0a",
  "name": "Savon Écologique",
  "description": "Savon naturel fait à la main...",
  "price": 9.99,
  "category": "savons",
  "stock": 100,
  "eco_certified": true,
  "images": ["url1", "url2"],
  "rating": 4.5
}
```

#### Créer produit (Admin)
```http
POST /products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Nouveau Savon",
  "description": "...",
  "price": 12.99,
  "category": "savons",
  "stock": 50,
  "sku": "SOAP001"
}

Response: 201 Created
```

### Commandes

#### Créer une commande
```http
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "productId": "60d5ec49f1b2c72d8c8e4a0a",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "street": "123 Rue de la Paix",
    "city": "Paris",
    "postalCode": "75001"
  },
  "paymentMethod": "stripe"
}

Response: 201 Created
{
  "id": "60d5ec49f1b2c72d8c8e4a0b",
  "status": "pending",
  "totalAmount": 25.98,
  "items": [...]
}
```

#### Mes commandes
```http
GET /orders
Authorization: Bearer <token>

Response: 200 OK
{
  "orders": [...]
}
```

#### Détails commande
```http
GET /orders/60d5ec49f1b2c72d8c8e4a0b
Authorization: Bearer <token>

Response: 200 OK
{
  "id": "60d5ec49f1b2c72d8c8e4a0b",
  "status": "confirmed",
  "items": [...],
  "totalAmount": 25.98
}
```

### Services

#### Lister les services
```http
GET /services

Response: 200 OK
{
  "services": [
    {
      "id": "60d5ec49f1b2c72d8c8e4a0c",
      "name": "Nettoyage Appartement",
      "basePrice": 50,
      "duration": 120,
      "rating": 4.8
    }
  ]
}
```

#### Réserver un service
```http
POST /services/booking
Authorization: Bearer <token>
Content-Type: application/json

{
  "serviceId": "60d5ec49f1b2c72d8c8e4a0c",
  "scheduledDate": "2025-12-10T14:00:00Z",
  "address": {
    "street": "123 Rue de la Paix",
    "city": "Paris"
  },
  "notes": "Priorité cuisine"
}

Response: 201 Created
{
  "id": "60d5ec49f1b2c72d8c8e4a0d",
  "status": "pending",
  "scheduledDate": "2025-12-10T14:00:00Z"
}
```

#### Disponibilités
```http
GET /services/60d5ec49f1b2c72d8c8e4a0c/availability?date=2025-12-10

Response: 200 OK
{
  "availableDates": [
    "2025-12-10T10:00:00Z",
    "2025-12-10T14:00:00Z",
    "2025-12-10T18:00:00Z"
  ]
}
```

### Paiement

#### Créer une intention de paiement
```http
POST /payments/create-intent
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 2598,
  "currency": "eur",
  "orderId": "60d5ec49f1b2c72d8c8e4a0b"
}

Response: 200 OK
{
  "clientSecret": "pi_1234_secret_5678",
  "publishableKey": "pk_test_..."
}
```

## Rate Limiting

- 100 requêtes par minute par IP
- 1000 requêtes par heure par utilisateur authentifié

## Erreurs

```javascript
{
  "error": {
    "message": "Email already exists",
    "code": "DUPLICATE_EMAIL",
    "statusCode": 400
  }
}
```

## Support

Pour les questions sur l'API, consultez la documentation ou contactez support@ekonzims.com
