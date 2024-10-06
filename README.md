# SnackaBlitz 🍽  
A full-featured food takeaway app built with *React.js, **Firebase, **Node.js, **Express.js, and **Razorpay*, designed to provide a seamless experience for users, restaurant owners, and super admins.

## Features

### 1. User Side 👤
- *Browse and Order Food*: Users can browse menus, view food items, and place orders conveniently.
- *Secure Payment: Payments are processed securely using **Razorpay. Users pay the **super admin*, who then transfers the funds to the respective restaurant.
- *Login and Signup: Users can sign in with **Google authentication* or standard email/password credentials for enhanced security.
- *Order Tracking*: Once an order is placed, users can track the status updated by the restaurant.
- *OTP Verification*: For every order, a unique OTP is generated and shared only between the user and the restaurant owner for secure order verification upon delivery.

### 2. Restaurant Owner Side 🍽
- *Manage Menu*: Restaurant owners can add, update, or remove menu items, including pictures, descriptions, and pricing.
- *Order Management*: View and manage incoming orders. Restaurants can update the order status to reflect preparation and delivery.
- *Availability Control*: Restaurants can choose to mark themselves as temporarily unavailable, making it easier to manage operating hours or handle downtime.
- *Order OTP*: The restaurant can verify the order using the unique OTP provided to the user.

### 3. Super Admin Side 👑
- *Handle Payments: Super admins receive payments from users and transfer the payments to the respective restaurant owner using **Razorpay*.
- *Manage Discount Coupons*: Super admins can dynamically create, update, and remove discount coupons for users, providing flexible promotional options.
- *Monitor Platform*: Super admins oversee both users and restaurants, managing the entire platform efficiently.

## Tech Stack 💻
- *Frontend*: 
  - *React.js*: Responsive and interactive user interface.
  - *Firebase*: Secure authentication with Google and email/password credentials.
  
- *Backend*:
  - *Node.js* and *Express.js*: Server-side logic and API handling.
  - *Razorpay*: Secure payment gateway integration for handling transactions between users, super admins, and restaurant owners.
  
- *Database*: 
  - *Firebase Firestore*: Real-time database for storing user data, restaurant menus, and orders.

## Installation ⚙

1. Clone the repository:

   bash
   git clone https://github.com/yourusername/snackablitz.git
   cd snackablitz
   

2. Install dependencies for both the frontend and backend:

   - For the *frontend*:

     bash
     cd client
     npm install
     

   - For the *backend*:

     bash
     cd server
     npm install
     

3. Set up *Firebase*:

   - Create a Firebase project.
   - Enable *Firebase Authentication* (Google and email/password sign-in methods).
   - Set up *Firebase Firestore* to manage data.

4. Set up *Razorpay*:

   - Create a Razorpay account and get your *API Key* and *Secret*.
   - Configure these in your backend environment variables.

5. Run the app:

   - Frontend:

     bash
     cd client
     npm start
     

   - Backend:

     bash
     cd server
     npm start
     

6. The app will run at:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## How it Works 🛠

### User Flow:
1. Users browse restaurants and order food.
2. Upon checkout, users make payments via *Razorpay, which are sent to the **super admin*.
3. After placing the order, the restaurant is notified, and the restaurant updates the status as the order is prepared.
4. A unique *OTP* is generated for each order, ensuring the correct user receives the order.

### Restaurant Owner Flow:
1. The restaurant owner can manage the menu by adding or removing food items with prices and pictures.
2. The restaurant receives order details and can update the order status (e.g., preparing, out for delivery).
3. Owners receive payments from the *super admin* after the user's transaction is complete.
4. Owners can set their availability status if they wish to be temporarily unavailable.

### Super Admin Flow:
1. The super admin acts as a middleman in handling payments.
2. Super admins can dynamically add, update, or remove discount coupons for users.
3. The super admin transfers the payments to restaurant owners via *Razorpay*.

## Security 🔒
- *Google and Email/Password Authentication* using Firebase ensures a secure login process.
- *OTP Verification* for each order guarantees a secure handoff between restaurants and users.
- *Secure Payments* are handled by *Razorpay*, ensuring the safety of financial transactions.

## Future Enhancements 🚀
- *Push Notifications*: Notify users and restaurants about order updates in real-time.
- *Order History*: Users can view their past orders.
- *Advanced Analytics*: Provide restaurants and super admins with insights into sales and customer preferences.
  
## Contributions 🤝
Feel free to contribute! If you'd like to report a bug, request a feature, or submit a pull request, please follow these steps:
1. Fork the repository.
2. Create a new branch (git checkout -b feature-branch).
3. Commit your changes (git commit -am 'Add new feature').
4. Push to the branch (git push origin feature-branch).
5. Open a pull request.

---

Enjoy the fast, secure, and efficient food ordering experience with SnackaBlitz! 🚀

backend server link - https://github.com/akshat-bhansali/zomato-clone-backend
