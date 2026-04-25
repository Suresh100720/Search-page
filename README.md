# 🔍 Candidate Search & Management Application

## 📌 Overview

This project is a **Search Page and Candidate Management System** built using **React (Vite)** with a **Node.js backend**. It provides a powerful and responsive interface to search, filter, and manage candidates with real-time results and optimized performance.

---

## 🚀 Features

### 🔍 Search & Filtering

* Search candidates using **Ant Design `Input.Search`**
* **Debounced search input** for real-time results
* **Facet filters** using checkboxes and tag filters
* Combined search + filters for dynamic results

---

### 🎯 UI & Data Handling

* Highlight matched search text in results
* Display candidates in:

  * **Card View**
  * **Table View (AG Grid)**
* Responsive UI using **Bootstrap**

---

### 📊 Candidate Management

* Add new candidates
* Fetch all candidates
* Update candidate details
* Delete candidate records
* Bulk delete support

---

### ⚡ Performance & Optimization

* **Debounced API calls** to reduce unnecessary requests
* **MongoDB indexing** for faster queries
* **Query tuning using `.explain()`**
* Efficient filtering using indexed fields (role, location, status)
* Optimized rendering to reduce re-renders

---

## 🛠️ Tech Stack

### 🔹 Frontend

* React (Vite)
* Ant Design
* Bootstrap
* AG Grid

### 🔹 Backend

* Node.js
* Express
* MongoDB (Mongoose)
* Elasticsearch (for search support)

---

## 📁 Project Structure

```
ui/
│
├── client/
│   ├── node_modules/
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   │
│   ├── src/
│   │   ├── assets/
│   │   │
│   │   ├── components/
│   │   │   ├── AgGridTable.jsx
│   │   │   ├── CandidateCard.jsx
│   │   │   ├── CandidateCardsView.jsx
│   │   │   ├── CandidateForm.jsx
│   │   │   ├── CandidateGrid.jsx
│   │   │   ├── FacetFilters.jsx
│   │   │   ├── HighlightText.jsx
│   │   │   └── SearchHeader.jsx
│   │   │
│   │   ├── hooks/
│   │   │   └── useCandidates.js
│   │   │
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── constants.js
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   │   └── elasticsearch.js
│   │
│   ├── controllers/
│   │   └── candidateController.js
│   │
│   ├── data/
│   │   └── mockCandidates.js
│   │
│   ├── models/
│   │   └── Candidate.js
│   │
│   ├── routes/
│   │   └── candidateRoutes.js
│   │
│   ├── tests/
│   │   └── api.test.js
│   │
│   ├── node_modules/
│   ├── .env
│   ├── index-candidates.js
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
├── eslint.config.js
├── package.json
└── README.md
```

---

## ⚙️ Installation & Setup

### 🔹 Clone Repository

```bash
git clone https://github.com/Suresh100720/Search-page.git
cd UI
```

### 🔹 Run Backend

```bash
cd server
npm install
npm run dev
```

### 🔹 Run Frontend

```bash
cd client
npm install
npm run dev
```

---

## 🔄 How It Works

1. User enters search query
2. Debounced input triggers API call
3. Backend processes filters and search
4. MongoDB/Elasticsearch returns optimized results
5. UI updates instantly

---

## 🧠 Performance Review

* Used **MongoDB indexing** to avoid full collection scans (COLLSCAN → IXSCAN)
* Verified query performance using:

  ```js
  db.candidates.find({ role: "Developer" }).explain("executionStats")
  ```
* Implemented **text index** for full-text search
* Reduced API calls using debounce (500ms)
* Optimized query filters using indexed fields

---

## 🧪 Unit Testing (Jest)

* Used **Jest + Supertest** for API testing
* Mocked MongoDB and Elasticsearch
* Tested routes:

  * GET candidates
  * POST candidate
  * Search API
  * Health API

### Run Tests

```bash
cd server
npm test
```

---

## 📡 API Endpoints (with curl)

### 🔹 Get Candidates

```bash
curl http://localhost:5000/api/candidates
```

---

### 🔹 Search Candidates

```bash
curl -X POST http://localhost:5000/api/candidates/search \
-H "Content-Type: application/json" \
-d '{"query":"developer"}'
```

---

### 🔹 Get Facets

```bash
curl http://localhost:5000/api/candidates/facets
```

---

### 🔹 Create Candidate

```bash
curl -X POST http://localhost:5000/api/candidates \
-H "Content-Type: application/json" \
-d '{
  "name": "Ram",
  "email": "ram@gmail.com",
  "role": "Developer",
  "skills": ["React"],
  "location": "Hyderabad",
  "status": "Applied"
}'
```

---

### 🔹 Update Candidate

```bash
curl -X PUT http://localhost:5000/api/candidates/:id \
-H "Content-Type: application/json" \
-d '{"role":"Senior Developer"}'
```

---

### 🔹 Delete Candidate

```bash
curl -X DELETE http://localhost:5000/api/candidates/:id
```

---

### 🔹 Bulk Delete

```bash
curl -X POST http://localhost:5000/api/candidates/bulk-delete \
-H "Content-Type: application/json" \
-d '{"ids":["id1","id2"]}'
```

---

## 🧠 Key Concepts Implemented

* Full-stack development (React + Node.js + MongoDB)
* Debounced search optimization
* Faceted filtering system
* REST API design
* Component-based architecture
* Data handling with AG Grid
* Indexing and query optimization

---

## ⚠️ Important Notes

* Do not commit `.env` file
* Ignore `node_modules`
* Keep API keys secure

---

## 👨‍💻 Author

**Suresh**


