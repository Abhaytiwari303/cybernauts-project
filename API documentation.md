# Cybernauts Project — API Documentation

## **Base URL**

```
http://localhost:5000/api
```

---

## **1️⃣ Create User**

**Endpoint:** `POST /users`

**Description:** Create a new user with username, age, and hobbies.

**Request Body (JSON):**

```json
{
  "username": "Abhay",
  "age": 22,
  "hobbies": ["coding", "music"]
}
```

**Response (201 Created):**

```json
{
  "_id": "64f9e0b1...",
  "username": "Abhay",
  "age": 22,
  "hobbies": ["coding", "music"],
  "friends": [],
  "createdAt": "2025-11-08T05:54:00.000Z",
  "popularityScore": 0
}
```

**Notes:**

* Create at least 2–3 users (Abhay, Rishik, Meera) for linking friendships.

---

## **2️⃣ Get All Users**

**Endpoint:** `GET /users`

**Description:** Fetch all users with their details.

**Response (200 OK):**

```json
[
  {
    "_id": "64f9e0b1...",
    "username": "Abhay",
    "age": 22,
    "hobbies": ["coding", "music"],
    "friends": []
  },
  {
    "_id": "64f9e0b2...",
    "username": "Rishik",
    "age": 21,
    "hobbies": ["gaming", "coding"],
    "friends": []
  }
]
```

---

## **3️⃣ Update User**

**Endpoint:** `PUT /users/:id`

**Description:** Update user details such as age or hobbies.

**Request Body (JSON):**

```json
{
  "age": 23,
  "hobbies": ["coding", "music", "reading"]
}
```

**Response (200 OK):**

```json
{
  "_id": "64f9e0b1...",
  "username": "Abhay",
  "age": 23,
  "hobbies": ["coding", "music", "reading"]
}
```

---

## **4️⃣ Link Friends**

**Endpoint:** `POST /users/:id/link`

**Description:** Create a friendship between two users.

**Request Body (JSON):**

```json
{
  "friendId": "64f9e0b2"
}
```

**Response (200 OK):**

```json
{
  "message": "Friendship linked"
}
```

**Notes:**

* Friendships are mutual.
* Popularity scores are updated dynamically.

---

## **5️⃣ Unlink Friend**

**Endpoint:** `DELETE /users/:id/unlink`

**Description:** Remove a friendship between two users.

**Request Body (JSON):**

```json
{
  "friendId": "64f9e0b2"
}
```

**Response (200 OK):**

```json
{
  "message": "Friendship removed"
}
```

---

## **6️⃣ Delete User**

**Endpoint:** `DELETE /users/:id`

**Description:** Delete a user if they have no friends.

**Responses:**

* **409 Conflict** — User still has friends:

```json
{
  "error": "Unlink all friends before deleting user"
}
```

* **200 OK** — User deleted successfully:

```json
{
  "message": "User deleted successfully"
}
```

---

## **7️⃣ Fetch Graph Data**

**Endpoint:** `GET /users/graph`

**Description:** Return graph data for frontend visualization. Includes nodes (users) and edges (friendships).

**Response (200 OK):**

```json
{
  "nodes": [
    {
      "id": "64f9e0b1...",
      "data": { "username": "Abhay", "age": 23, "popularityScore": 3 },
      "position": { "x": 241.5, "y": 181.3 }
    },
    {
      "id": "64f9e0b2...",
      "data": { "username": "Rishik", "age": 21, "popularityScore": 2.5 },
      "position": { "x": 340.1, "y": 79.8 }
    }
  ],
  "edges": [
    { "id": "edge-64f9e0b1-64f9e0b2", "source": "64f9e0b1", "target": "64f9e0b2" }
  ]
}
```

**Notes:**

* Nodes show username, age, and popularityScore.
* Edges represent friendships.

---

## **8️⃣ Popularity Score Logic**

```
popularityScore = number of unique friends + (total hobbies shared with friends × 0.5)
```

**Rules:**

* Deletion not allowed while still connected.
* Circular friendships are prevented (A→B treated as mutual).

---

## **9️⃣ Error Codes**

| Status | Meaning                                     |
| ------ | ------------------------------------------- |
| 400    | Validation errors                           |
| 404    | User not found                              |
| 409    | Conflict (e.g., delete while friends exist) |
| 500    | Internal server error                       |

---

## **10️⃣ Environment Variables**

Use a `.env` file for configuration:

```
PORT=5000
DB_URL=<your-database-url>
```

