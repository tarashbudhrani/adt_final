# Example API Queries

Below are some example queries you can use with the backend API:

---

## 1. Fetch All Supplies
**Endpoint:** `GET /api/supplies`

**Example (curl):**
```bash
curl http://localhost:5000/api/supplies
```

---

## 2. Update a Supply
**Endpoint:** `PUT /api/supplies/:id`

**Example (curl):**
```bash
curl -X PUT http://localhost:5000/api/supplies/64a1b2c3d4e5f6a7b8c9d0e1 \
  -H "Content-Type: application/json" \
  -d '{"stockQuantity": 50, "reorderLevel": 10}'
```

---

## 3. MongoDB Aggregation: Total Items Used Per User
**Endpoint:** `GET /api/usageRecords/user-totals`

**Example (curl):**
```bash
curl http://localhost:5000/api/usageRecords/user-totals
```

**Sample Response:**
```json
[
  {
    "_id": "64a1b2c3d4e5f6a7b8c9d0e2",
    "totalItems": 25,
    "user": {
      "_id": "64a1b2c3d4e5f6a7b8c9d0e2",
      "name": "John Doe",
      ...
    }
  },
  ...
]
``` 