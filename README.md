# Luminous Studio

Luminous Studio is a full-stack event decoration and booking platform where customers can explore event services, view portfolio images, add services to cart, make bookings with online payment, and receive confirmation emails. Admins can manage services and portfolio items directly from the website.

## Features

### User Features

* User sign up and sign in
* View service catalog
* Filter services by category
* Add services to cart
* User-specific cart system
* Submit booking inquiry
* Razorpay payment gateway integration
* Email confirmation after successful payment
* Submit issue form after login

### Admin Features

* Admin sign up with official email domain only
* Admin sign in
* Add, edit, and delete services
* Add, edit, and delete portfolio images
* View and manage service listings
* Receive booking notification by email
* Receive customer issue notification by email

### Website Features

* Responsive design for mobile, tablet, and desktop
* Portfolio gallery with category filtering
* Service catalog with pricing and customization options
* Shopping cart system
* Booking form with payment
* Issue submission form
* Home page with 24×7 support and footer section

## Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* React Router
* Axios

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Nodemailer
* Razorpay Payment Gateway

### Database

* MongoDB Atlas

## Project Structure

```txt
luminous-studio
├── backend
│   ├── config
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── frontend
│   ├── src
│   │   ├── api
│   │   ├── components
│   │   ├── pages
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/luminous-studio.git
cd luminous-studio
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key

EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
ADMIN_EMAIL=admin_email@gmail.com

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Start backend server:

```bash
npm run dev
```

Backend will run on:

```txt
http://localhost:5000
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on:

```txt
http://localhost:5173
```

## Environment Variables

| Variable              | Description                           |
| --------------------- | ------------------------------------- |
| `PORT`                | Backend server port                   |
| `MONGO_URI`           | MongoDB Atlas connection URL          |
| `JWT_SECRET`          | Secret key for JWT authentication     |
| `EMAIL_USER`          | Gmail address used for sending emails |
| `EMAIL_PASS`          | Gmail app password                    |
| `ADMIN_EMAIL`         | Admin email for notifications         |
| `RAZORPAY_KEY_ID`     | Razorpay test/live key ID             |
| `RAZORPAY_KEY_SECRET` | Razorpay test/live key secret         |

## Important Note

Do not push your `.env` file to GitHub. It contains sensitive credentials such as MongoDB URL, Razorpay keys, and Gmail app password.

Add this to `.gitignore`:

```gitignore
node_modules
.env
dist
build
npm-debug.log
```

## User Flow

```txt
User Sign Up / Sign In
↓
View Services
↓
Add Service to Cart
↓
Proceed to Booking
↓
Make Payment using Razorpay
↓
Booking Saved in MongoDB
↓
Confirmation Email Sent
```

## Admin Flow

```txt
Admin Sign Up
↓
Admin Sign In
↓
Manage Services
↓
Manage Portfolio
↓
Receive Booking and Issue Notifications
```

## Payment Testing

This project uses Razorpay Test Mode for development.

Test card example:

```txt
Card Number: 4100 2800 0000 1007
Expiry: 12/30
CVV: 123
OTP: 1234
```

In test mode, no real money is deducted.

## Email Notification

After successful payment:

* Customer receives booking confirmation email.
* Admin receives booking notification email.

When user submits an issue:

* Admin receives issue notification email.

## Admin Email Rule

Admin signup is allowed only for emails ending with:

```txt
@luminous.co.in
```

Example:

```txt
manager@luminous.co.in
```

## Future Enhancements

* Real SMS OTP verification
* Admin booking dashboard
* Payment invoice download
* Image upload using Cloudinary
* Role-based protected routes
* Order history for users
* Deployment on Render and Vercel

## Author

Developed by Priyanshu Raj

