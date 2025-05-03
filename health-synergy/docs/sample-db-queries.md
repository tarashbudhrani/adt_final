# Actual Database Queries Used in This Application

Below are database queries (MongoDB style) that directly reflect the actual logic and data operations used in this application, based on the backend code (routes and models):

---

## 1. Fetch All Supplies
**MongoDB:**
```js
db.supplies.find({})
```
*(Used in: GET /api/supplies)*

---

## 2. Fetch Supplies Below Reorder Level
**MongoDB:**
```js
db.supplies.find({ $expr: { $lte: ["$stockQuantity", "$reorderLevel"] } })
```
*(Used in: GET /api/supplies/reorder-alert)*

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
*(Used in: POST /api/supplies)*

---

## 4. Update a Supply
**MongoDB:**
```js
db.supplies.updateOne(
  { _id: ObjectId("SUPPLY_ID") },
  { $set: { stockQuantity: 50, reorderLevel: 10 } }
)
```
*(Used in: PUT /api/supplies/:id)*

---

## 5. Delete a Supply
**MongoDB:**
```js
db.supplies.deleteOne({ _id: ObjectId("SUPPLY_ID") })
```
*(Used in: DELETE /api/supplies/:id)*

---

## 6. Fetch All Usage Records (with population)
**MongoDB:**
```js
db.usageRecords.find({}) // .populate('supply_id').populate('user_id') in Mongoose
```
*(Used in: GET /api/usageRecords)*

---

## 7. Fetch Usage Records from Last 7 Days
**MongoDB:**
```js
db.usageRecords.find({
  date: { $gte: new Date(Date.now() - 7*24*60*60*1000) }
})
```
*(Used in: GET /api/usageRecords/recent)*

---

## 8. Add a Usage Record and Decrement Supply
**MongoDB:**
```js
// Check supply and decrement
const supply = db.supplies.findOne({ _id: ObjectId("SUPPLY_ID") });
if (supply.stockQuantity >= 5) {
  db.supplies.updateOne(
    { _id: ObjectId("SUPPLY_ID") },
    { $inc: { stockQuantity: -5 } }
  );
  db.usageRecords.insertOne({
    supply_id: ObjectId("SUPPLY_ID"),
    user_id: ObjectId("USER_ID"),
    quantity: 5,
    reason: "Daily use",
    date: new Date()
  });
}
```
*(Used in: POST /api/usageRecords)*

---

## 9. Total Items Used Per User (Aggregation)
**MongoDB:**
```js
db.usageRecords.aggregate([
  { $group: { _id: "$user_id", totalItems: { $sum: "$quantity" } } },
  { $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "_id",
      as: "user"
    }
  },
  { $unwind: "$user" }
])
```
*(Used in: GET /api/usageRecords/user-totals)*

---

## 10. Fetch All Users
**MongoDB:**
```js
db.users.find({})
```
*(Used in: GET /api/users)* 