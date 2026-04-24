Candidate Search & Management Application
📌 Overview
This project is a Search Page and Candidate Management System built using React (Vite) with a Node.js backend. It provides a powerful and responsive interface to search, filter, and manage candidates with real-time results and advanced UI components.
🚀 Features
🔍 Search & Filtering
Search candidates using Ant Design Input.Search
Debounced search input for real-time results
Facet filters using checkboxes and tag filters
Dynamic filtering with live updates
🎯 UI & Data Handling
Highlight matched search text in result cards
Display candidates in:
Card View
Table View (AG Grid)
Responsive UI using Bootstrap
📊 Candidate Management
Add new candidates using form
View all candidate details
Update candidate information
Delete candidates
⚡ Performance & UX
Smooth and fast search experience
Optimized rendering with debouncing
Clean and user-friendly interface
🛠️ Tech Stack
🔹 Frontend
React (Vite)
Ant Design (Search, Select, UI components)
Bootstrap (Responsive design)
AG Grid (Advanced data table)
🔹 Backend
Node.js
Express
MongoDB (Mongoose)
📁 Project Structure
UI/
│
├── client/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── AgGridTable.jsx
│   │   │   ├── CandidateCard.jsx
│   │   │   ├── CandidateCardsView.jsx
│   │   │   ├── CandidateForm.jsx
│   │   │   ├── CandidateGrid.jsx
│   │   │   ├── FacetFilters.jsx
│   │   │   ├── HighlightText.jsx
│   │   │   ├── SearchHeader.jsx
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
│   ├── models/
│   │   └── Candidate.js
│   │
│   ├── node_modules/
│   ├── .env
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
│
├── node_modules/
├── .gitignore
├── eslint.config.js
├── package.json
└── README.md
⚙️ Installation & Setup
🔹 1. Clone Repository
git clone https://github.com/Suresh100720/Search-page.git
cd UI
🔹 2. Run Backend
cd server
npm install
npm run dev
🔹 3. Run Frontend
cd client
npm install
npm run dev
🔄 How It Works
User enters search query
Debounced input triggers API call
Backend fetches filtered data
UI updates instantly with:
Highlighted results
Updated filters
Grid & card views
🧠 Key Concepts Used
Debouncing (optimized search)
React Hooks & Custom Hooks
API Integration (Axios)
Component-based architecture
Data filtering & faceting
Responsive UI design
⚠️ Important Notes
Do not commit .env file
Ignore node_modules
Keep sensitive data secure
👨‍💻 Author
Suresh
 
