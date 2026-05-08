# 🌱 EcoAlert – Pollution Reporting & Community Awareness Platform

EcoAlert is a full-stack MERN application designed to help citizens report pollution-related issues in real time and connect communities, authorities, and NGOs for environmental awareness and action. The platform enables users to create pollution reports with images and geolocation, interact through community posts, and support clean-up initiatives through crowdfunding campaigns.

The project focuses on bridging the communication gap between citizens and authorities by providing a centralized digital platform for reporting and monitoring environmental problems.

---

# 🚀 Features

## 👤 User Authentication & Authorization
- Secure user registration and login using JWT authentication
- Protected routes for authenticated users
- Role-based access support for users and authorities/admins

## 📝 Community Posts & Pollution Reporting
- Create pollution reports with:
  - Images/videos
  - Descriptions
  - Geolocation tagging
- Edit and delete posts
- Community interaction and awareness sharing

## 🗺️ Interactive Pollution Map
- Display pollution reports on an interactive map
- Visualize pollution hotspots using geolocation
- View detailed information about reported incidents

## 💰 Crowdfunding Campaigns
- Create campaigns for environmental initiatives
- Authority approval workflow for campaigns
- Community-driven funding support for clean-up drives

## ☁️ Media Upload Support
- Upload and manage images/videos using Cloudinary
- Cloud-based storage for media files

## 📊 Dashboard & Management
- User profile management
- Authority dashboard for monitoring reports
- Campaign and post management features

## ⚡ Additional Features
- Real-time environmental awareness platform
- Responsive UI for desktop and mobile devices
- Error handling and API validation
- RESTful API architecture

---

# 🛠️ Tech Stack

## Frontend
- React.js
- React Router
- Axios
- Tailwind CSS
- Leaflet / Map Integration

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

## Authentication
- JSON Web Tokens (JWT)
- bcrypt.js

## Cloud & Storage
- Cloudinary
- MongoDB Atlas

## Development Tools
- Visual Studio Code
- Thunder Client / Postman

---

# 📦 Installation & Setup

## 1️⃣ Clone the Repository

```bash
git clone <repository-url>
cd ecoalert
```

---

## 2️⃣ Install Backend Dependencies

```bash
cd backend
npm install
```

---

## 3️⃣ Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## 4️⃣ Create Environment Variables

Create a `.env` file inside the `backend` folder and add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 5️⃣ Start the Backend Server

```bash
cd backend
npm start
```

---

## 6️⃣ Start the Frontend Application

```bash
cd frontend
npm run dev
```

---

# 💻 Usage

1. Register or log in to the platform
2. Create pollution reports with media and location
3. Explore pollution reports on the interactive map
4. Participate in community discussions
5. Create or support crowdfunding campaigns
6. Authorities can monitor and manage reports

---

# 📂 Project Structure

```plaintext
ecoalert/
│
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   ├── cloudinaryConfig.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Post.js
│   │   ├── Campaign.js
│   │   ├── Report.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── posts.js
│   │   ├── campaigns.js
│   │   ├── reports.js
│   │   ├── users.js
│   │
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │
│   └── package.json
│
├── .env
├── package.json
└── README.md
```

---

# 🌍 Project Objectives

- Enable citizens to report environmental issues easily
- Improve communication between citizens and authorities
- Promote environmental awareness and sustainable practices
- Support community-driven environmental initiatives
- Provide real-time pollution monitoring and visualization

---

# 🧪 Testing

The application can be tested using:
- Thunder Client
- Postman
- Manual frontend testing

Testing includes:
- Authentication APIs
- CRUD operations
- Media uploads
- Protected routes
- Campaign approval workflow

---

# 🤝 Contributing

Contributions are welcome.

## Steps to Contribute

1. Fork the repository

2. Create a new branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Added new feature"
```

4. Push to GitHub

```bash
git push origin feature-name
```

5. Create a Pull Request

---

# 👨‍💻 Author

Developed by Priyanshu Sharma

---

EcoAlert is a technology-driven initiative focused on creating a cleaner and healthier environment through community collaboration and digital innovation.
