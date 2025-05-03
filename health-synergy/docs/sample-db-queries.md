# Sample Database Queries

Below are 10 example queries for the database layer, using both MongoDB and SQL/SQLite formats where relevant.

---

## 1. Fetch All Supplies
**MongoDB:**
```js
db.supplies.find({})
```
**SQL/SQLite:**
```sql
SELECT * FROM supplies;
```

---

## 2. Fetch Supplies Below Reorder Level
**MongoDB:**
```js
db.supplies.find({ $expr: { $lte: ["$stockQuantity", "$reorderLevel"] } })
```
**SQL/SQLite:**
```sql
SELECT * FROM supplies WHERE stockQuantity <= reorderLevel;
```

---

## 3. Add a New Supply
**MongoDB:**
```js
db.supplies.insertOne({
  name: "Gloves",
  category: "PPE",
  stockQuantity: 100,
  reorderLevel: 20
})
```
**SQL/SQLite:**
```sql
INSERT INTO supplies (name, category, stockQuantity, reorderLevel)
VALUES ('Gloves', 'PPE', 100, 20);
```

---

## 4. Update a Supply's Stock
**MongoDB:**
```js
db.supplies.updateOne(
  { _id: ObjectId("64a1b2c3d4e5f6a7b8c9d0e1") },
  { $set: { stockQuantity: 50, reorderLevel: 10 } }
)
```
**SQL/SQLite:**
```sql
UPDATE supplies SET stockQuantity = 50, reorderLevel = 10 WHERE id = '64a1b2c3d4e5f6a7b8c9d0e1';
```

---

## 5. Delete a Supply
**MongoDB:**
```js
db.supplies.deleteOne({ _id: ObjectId("64a1b2c3d4e5f6a7b8c9d0e1") })
```
**SQL/SQLite:**
```sql
DELETE FROM supplies WHERE id = '64a1b2c3d4e5f6a7b8c9d0e1';
```

---

## 6. Fetch All Usage Records
**MongoDB:**
```js
db.usageRecords.find({})
```
**SQL/SQLite:**
```sql
SELECT * FROM usageRecords;
```

---

## 7. Fetch Usage Records from Last 7 Days
**MongoDB:**
```js
db.usageRecords.find({
  date: { $gte: new Date(Date.now() - 7*24*60*60*1000) }
})
```
**SQL/SQLite:**
```sql
SELECT * FROM usageRecords WHERE date >= DATE('now', '-7 days');
```

---

## 8. Total Items Used Per User (Aggregation)
**MongoDB:**
```js
db.usageRecords.aggregate([
  { $group: { _id: "$user_id", totalItems: { $sum: "$quantity" } } }
])
```
**SQL/SQLite:**
```sql
SELECT user_id, SUM(quantity) as totalItems FROM usageRecords GROUP BY user_id;
```

---

## 9. Fetch All Users
**MongoDB:**
```js
db.users.find({})
```
**SQL/SQLite:**
```sql
SELECT * FROM users;
```

---

## 10. Add a New User
**MongoDB:**
```js
db.users.insertOne({
  name: "Jane Doe",
  email: "jane@example.com",
  role: "admin"
})
```
**SQL/SQLite:**
```sql
INSERT INTO users (name, email, role) VALUES ('Jane Doe', 'jane@example.com', 'admin');
``` 