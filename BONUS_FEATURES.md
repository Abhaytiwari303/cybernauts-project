# Cybernauts Project — Bonus Features

This document describes the bonus features implemented in the Cybernauts project and how they enhance the application.

---

## 🎯 Implemented Bonus Features

### 1. Custom React Flow Node Types

**Description:** Different visual representations for users based on their popularity scores.

**Implementation:**

* **HighScoreNode:** Users with `popularityScore > 5`
  * Larger node size
  * Gold color scheme
  * Badge indicator

* **LowScoreNode:** Users with `popularityScore ≤ 5`
  * Standard node size
  * Default color

**Code Example:**

```typescript
const HighScoreNode = ({ data }) => (
  <div className="high-score-node">
    <div className="node-badge">⭐ Popular</div>
    <div className="node-content">
      <h3>{data.username}</h3>
      <p>Score: {data.popularityScore}</p>
    </div>
  </div>
);

const nodeTypes = {
  highScore: HighScoreNode,
  lowScore: LowScoreNode,
};
```

**Benefits:**

* Quick identification of influential users
* Enhanced user experience

---

### 2. Undo/Redo Functionality

**Description:** Users can revert or reapply changes to the graph (node moves, connections, hobby assignments).

**Implementation:**

* History stack tracks changes
* Keyboard shortcuts: `Ctrl+Z` (undo), `Ctrl+Y` (redo)

**Code Example:**

```typescript
const useHistory = () => {
  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);

  const undo = () => {
    if (!past.length) return;
    const previous = past[past.length - 1];
    setPast(past.slice(0, -1));
    setFuture([currentState, ...future]);
  };

  const redo = () => {
    if (!future.length) return;
    const next = future[0];
    setPast([...past, currentState]);
    setFuture(future.slice(1));
  };

  return { undo, redo, canUndo: past.length > 0, canRedo: future.length > 0 };
};
```

**Benefits:**

* Error recovery
* Safe experimentation

---

### 3. Debounced API Calls

**Description:** Optimized API requests for hobby assignments to reduce server load.

**Implementation:**

* 500ms debounce delay for hobby drag-and-drop
* Batch multiple changes into single API call

**Code Example:**

```typescript
import { debounce } from 'lodash';

const updateHobby = debounce(async (userId, hobbies) => {
  await api.put(`/users/${userId}`, { hobbies });
}, 500);
```

**Benefits:**

* Reduced server load
* Improved performance during rapid changes

---

### 4. Search & Filter Functionality

**Description:** Sidebar allows advanced search and filtering of users by hobbies, age, and popularity.

**Implementation:**

```typescript
const filterUsers = (users, filters) =>
  users.filter(user => 
    user.username.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
    (!filters.ageMin || user.age >= filters.ageMin) &&
    (!filters.ageMax || user.age <= filters.ageMax) &&
    (!filters.minPopularity || user.popularityScore >= filters.minPopularity) &&
    (!filters.hobbies?.length || filters.hobbies.some(h => user.hobbies.includes(h)))
  );
```

**Benefits:**

* Quick navigation in large networks
* Focused analysis

---

### 5. Lazy Loading for Large Datasets

**Description:** Optimized graph rendering for large numbers of users using virtualization and pagination.

**Implementation:**

```typescript
const useLazyLoadUsers = (pageSize = 50) => {
  const [page, setPage] = useState(0);
  const [users, setUsers] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {
    const response = await api.get(`/users?page=${page}&limit=${pageSize}`);
    setUsers([...users, ...response.data]);
    setHasMore(response.data.length === pageSize);
    setPage(page + 1);
  };

  return { users, loadMore, hasMore };
};
```

**Benefits:**

* Smooth handling of 100+ users
* Reduced initial load time
* Better mobile performance

---

### 6. Node.js Cluster & Load Balancing

**Description:** Multi-process architecture for better CPU utilization and high availability.

**Implementation:**

```typescript
import cluster from 'cluster';
import os from 'os';

if (cluster.isMaster) {
  const numWorkers = os.cpus().length;
  for (let i = 0; i < numWorkers; i++) cluster.fork();
} else {
  startServer();
}
```

**Benefits:**

* Horizontal scaling
* High availability with worker respawn

---

### 7. Toast Notifications

**Description:** User-friendly notifications for actions and errors.

**Implementation:**

```typescript
import { toast } from 'react-hot-toast';

toast.success('User created successfully!');
toast.error('Failed to delete user. Please unlink friends first.');
```

**Benefits:**

* Clear feedback
* Non-intrusive and professional UI

