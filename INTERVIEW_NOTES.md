# Technical Interview Prep - Product Browser

This document explains the technical designs, optimization choices, and theoretical concepts behind the **Product Browser** application.

---

## 1. Project Architecture (MERN + MVC)
The project utilizes a clean Model-View-Controller (MVC) directory structure on the backend to separate concerns:
- **Models (`/src/02-models`)**: Defines the Mongoose schemas and indexes.
- **Controllers (`/src/03-controllers`)**: Handles incoming requests, pagination calculations, and database calls.
- **Routes (`/src/04-routes`)**: Maps the endpoint definitions to controller hooks.
- **Middlewares (`/src/05-middlewares`)**: Centralized error logging and standard HTTP responses.

The frontend uses **React Query** (TanStack Query) to manage remote server state. It eliminates the need for Redux by caching data, handling page merges, tracking loading states, and automatically triggering refetches when filters change.

---

## 2. Why MongoDB?
MongoDB was chosen for the following reasons:
- **JSON Compatibility**: Fits naturally with Node.js and React (single language type safety representation).
- **Flexible Schema**: Products can have varying fields depending on category in the future.
- **Compound Indexes**: B-Tree indices in MongoDB natively support multi-key sorting (`updatedAt` + `_id`) and category prefixes.
- **Horizontal Scaling**: Supports sharding, allowing the system to scale to millions of records.

---

## 3. Why Cursor Pagination vs. Skip/Offset?

### The Problem with `skip()` and `limit()`
When using offset-based pagination:
```javascript
Product.find().sort({ updatedAt: -1 }).skip(150000).limit(20)
```
MongoDB does not jump directly to record `150000`. It must:
1. Scan the index or collection.
2. Read the first 150,000 documents into memory.
3. Throw them away.
4. Return the next 20 documents.

As the offset increases, performance deteriorates linearly ($O(N)$ time complexity).

### The Solution: Cursor Pagination
Cursor pagination passes a marker (the "cursor") representing the last item returned. The next query starts *exactly* after that marker:
```javascript
Product.find({ updatedAt: { $lt: cursorDate } }).sort({ updatedAt: -1 }).limit(20)
```
Using B-Tree indexes, MongoDB jumps directly to the cursor boundary in $O(\log N)$ time complexity and returns 20 documents, regardless of whether the user is on page 1 or page 5,000.

---

## 4. How Duplicates and Missing Items Are Avoided

### Avoid Duplicate Views (Page Drift)
Imagine a user is viewing page 1. A new product is inserted at the top of the collection.
- **With Skip/Limit**: Page 2 is defined as `.skip(20)`. Because a new product was inserted, all existing products shift down by 1. The last product on page 1 is now pushed to position 21 (first item of page 2). The user sees a duplicate.
- **With Cursor**: Page 2 is defined as "items older than `cursorDate`". The newly inserted product is newer than the cursor date, so it is ignored. The user never sees duplicates.

### Avoid Missing Items
Similarly, if a product is updated or deleted, it might jump to a different position. Cursor pagination utilizes static bookmarks, preventing item skip/drift.

---

## 5. Why the Cursor Must Use `_id + updatedAt`
If we sort and paginate by `updatedAt` alone, we encounter a collision problem.
Many products can have the exact same `updatedAt` timestamp (especially when bulk importing or seeding).

If the cursor was only `updatedAt`:
1. Page 1 returns items with `updatedAt = 2026-06-25T12:00:00Z`.
2. There are 50 products sharing this exact timestamp.
3. The query for page 2 checks `{ updatedAt: { $lt: '2026-06-25T12:00:00Z' } }`.
4. It skips the remaining 30 products on that exact millisecond, causing the user to **miss products**.

Adding `_id` breaks ties. The compound query looks like:
- Items older than the cursor: `updatedAt < cursorUpdatedAt`
- OR items on the same millisecond but with a smaller ID: `updatedAt == cursorUpdatedAt AND _id < cursorId`

This guarantees that every single document is fetched in order and no records are skipped.

---

## 6. Index Analysis
To prevent collection scans, three indexes are established:

### Index 1: `{ updatedAt: -1, _id: -1 }`
- **Use Case**: Global product list sorted by date.
- **Performance**: High. Serves queries with `$or` conditions on `updatedAt` and `_id` directly from the index.

### Index 2: `{ category: 1 }`
- **Use Case**: Simple category listings.

### Index 3: `{ category: 1, updatedAt: -1, _id: -1 }`
- **Use Case**: Category-filtered listings sorted by date.
- **Performance**: Exceptional. Operates on the "Equality, Sort, Range" (ESR) rule. The index filters by category (Equality), sorts by date and ID (Sort), and supports the boundary cursor lookup (Range).

---

## 7. Time and Space Complexity
- **Time Complexity (Read)**: $O(\log N)$ where $N$ is the number of products. The B-Tree indexes search boundaries in logarithmic time.
- **Space Complexity (Index)**: $O(K)$ where $K$ is the unique index keys.
- **Memory Footprint**: By fetching exactly `limit + 1` elements, the backend uses minimal RAM, allowing it to support thousands of concurrent requests.

---

## 8. Scaling Strategy
To scale this codebase to 10+ million products:
1. **Database Sharding**: Shard the MongoDB cluster using `category` as the shard key, distributing read/write loads across separate database instances.
2. **CDN Caching**: Cache the API responses at the CDN edge (e.g. Cloudflare) with a short TTL, since cursor pages are immutable once fetched.
3. **Optimized Seeding**: Seed scripts can use raw database connections (e.g., MongoDB bulkWrite bypassing Mongoose validations) to seed 1 million products in seconds.
