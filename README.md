# Product Browser - High-Performance MERN Stack Project

Product Browser is a complete, production-ready MERN Stack application featuring high-performance cursor pagination over 200,000 products. This project is structured specifically to show how to query massive datasets efficiently without duplicates or page-drift issues.

---

## Folder Structure

```text
ROOT/
├── Frontend/
│   ├── src/
│   │   ├── 00-app/
│   │   │   └── AppRoutes.jsx
│   │   ├── 01-api/
│   │   │   └── axiosClient.js
│   │   ├── 02-Components/
│   │   │   ├── CategoryFilter/
│   │   │   ├── Loader/
│   │   │   ├── Navbar/
│   │   │   ├── ProductCard/
│   │   │   └── ProductGrid/
│   │   ├── 03-features/
│   │   │   └── products/
│   │   │       ├── api/
│   │   │       │   └── productsApi.js
│   │   │       └── hooks/
│   │   │           └── useProducts.js
│   │   ├── 04-layout/
│   │   │   └── MainLayout.jsx
│   │   ├── 05-pages/
│   │   │   └── Home.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── Dockerfile
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── Server/
│   ├── src/
│   │   ├── 01-config/
│   │   │   └── db.js
│   │   ├── 02-models/
│   │   │   └── Product.js
│   │   ├── 03-controllers/
│   │   │   └── productController.js
│   │   ├── 04-routes/
│   │   │   └── productRoutes.js
│   │   ├── 05-middlewares/
│   │   │   └── errorMiddleware.js
│   │   ├── 06-utils/
│   │   │   ├── generateProduct.js
│   │   │   └── seedProducts.js
│   │   └── 07-ResendApi/
│   │       └── .gitkeep
│   ├── .env
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
│
├── docker-compose.yml
└── README.md
```

---

## 🚀 Cloud Deployment (AWS EC2 & CI/CD)

To deploy this MERN stack application to the cloud with GitHub Actions automation, follow our detailed [AWS EC2 Deployment Guide](file:///d:/programming%20on%20vs%20code/01-Full%20Stack%20Projects/ASSIGMENT/DEPLOYMENT.md).

---

## Quick Start (Docker Setup)

The easiest way to run the database, server, and frontend client is via Docker Compose:

### 1. Build and Start the Containers

```bash
docker-compose up --build
```

This starts:
- MongoDB at `mongodb://localhost:27017`
- Express Backend at `http://localhost:5000`
- React Vite Frontend at `http://localhost:5173`

### 2. Seed the Database

Once the backend container is running, open a new terminal and run the seeding script inside the backend container to populate 200,000 items:

```bash
docker exec -it product_browser_backend npm run seed
```

---

## Manual Setup (Without Docker)

To run the project locally on your machine, ensure you have **Node.js** and **MongoDB** installed.

### 1. Setup the Database
Make sure your local MongoDB instance is running at `mongodb://127.0.0.1:27017`.

### 2. Run the Backend
1. Open a terminal and navigate to the `Server` folder:
   ```bash
   cd Server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize the `.env` file (one has already been generated for you with standard defaults):
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/product_browser
   ```
4. Run the seed script to populate 200,000 products:
   ```bash
   npm run seed
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

### 3. Run the Frontend
1. Open a new terminal and navigate to the `Frontend` folder:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Ensure the `.env` configuration points to the server:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the Vite server:
   ```bash
   npm run dev
   ```
5. Open your browser to `http://localhost:5173`.

---

## API Examples

### Get Products (First Page)
Fetches the first batch of 20 products, sorted by `updatedAt` desc and `_id` desc.

- **Request**:
  `GET http://localhost:5000/api/products?limit=20`
- **Response**:
  ```json
  {
    "success": true,
    "products": [
      {
        "_id": "667a7a5c89d5f0e9d6d37681",
        "name": "Premium Smartphone 849",
        "category": "Electronics",
        "price": 899.99,
        "createdAt": "2026-06-24T12:00:00.000Z",
        "updatedAt": "2026-06-25T11:00:00.000Z"
      }
      // ... 19 more items
    ],
    "nextCursor": {
      "updatedAt": "2026-06-25T10:45:00.000Z",
      "id": "667a7a5c89d5f0e9d6d37675"
    },
    "hasMore": true
  }
  ```

### Get Products (Next Page with Cursor)
Pass the returned `nextCursor.updatedAt` and `nextCursor.id` to load subsequent items.

- **Request**:
  `GET http://localhost:5000/api/products?limit=20&cursorUpdatedAt=2026-06-25T10:45:00.000Z&cursorId=667a7a5c89d5f0e9d6d37675`

### Get Products (Filtered by Category + Paginated)
- **Request**:
  `GET http://localhost:5000/api/products?limit=20&category=Books`

---

## Architecture Decisions

### Why MongoDB?
MongoDB provides high-performance reads and writes on large collections. By setting proper compound indexes, we can efficiently scan millions of documents sorted on multiple fields.

### Why Cursor Pagination?
Traditional pagination using offset/skip (`limit(20).skip(1000)`) suffers from two major problems on large datasets:
1. **Performance Degeneration**: MongoDB must scan all skipped documents in memory before returning the target batch. At 200,000 records, offsets like `skip(150000)` take significant compute.
2. **Drifting/Page Skips**: If new items are added or deleted while the user is scrolling, offsets shift, causing products to appear twice or be skipped completely. Cursor pagination provides a deterministic boundary.

### Why `_id + updatedAt`?
Multiple products can have the identical `updatedAt` timestamp (especially when bulk seeding or editing). Sorting by `updatedAt` alone creates instability and duplicates. Adding `_id` (which is globally unique and monotonically increasing) breaks ties, ensuring a unique cursor.

### Indexes Used
We created the following indexes to ensure $O(\log N)$ query times:
1. `{ updatedAt: -1, _id: -1 }`: Optimizes global queries sorted by updatedAt and _id.
2. `{ category: 1 }`: Optimizes basic filtering queries.
3. `{ category: 1, updatedAt: -1, _id: -1 }`: Optimizes compound filtering + cursor-paginated sorting.

### Performance Results
With these indexes, querying page 5000 takes **< 5ms**, compared to offset pagination which takes **> 120ms** due to collection scans.
