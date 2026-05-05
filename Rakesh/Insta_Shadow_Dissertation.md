---
title: "Insta-Shadow: A Full-Stack Social Media Application with Real-Time Facial Expression Detection"
author: "Final Year Project Dissertation"
date: "2026"
geometry: margin=2cm
---

# 1. Introduction
In the modern digital era, social media platforms are pivotal for communication and socialization. "Insta-Shadow" is a comprehensive, full-stack MERN (MongoDB, Express.js, React, Node.js) application tailored to provide users with a secure and engaging social networking experience. Beyond the traditional capabilities of image sharing and user interactions, Insta-Shadow integrates advanced machine learning models via MediaPipe to offer real-time facial expression analysis, adding an innovative dimension to user experience. 

# 2. Objectives
- To develop a scalable social networking platform using the MERN stack.
- To implement robust and secure user authentication using JSON Web Tokens (JWT) and HTTP-only cookies.
- To ensure reliable frontend and backend performance across different cross-origin domains.
- To demonstrate the integration of client-side Artificial Intelligence for real-time facial expression detection.
- To deploy the application in a production environment using modern cloud hosting platforms (Vercel and Render).

# 3. System Architecture
Insta-Shadow follows a modern three-tier client-server architecture:
1. **Presentation Layer (Frontend)**: Built with React.js and Vite, providing a highly responsive Single Page Application (SPA). The frontend communicates with the backend via RESTful APIs.
2. **Business Logic Layer (Backend)**: Developed using Node.js and Express.js. It facilitates user authentication, handles media upload validations (restricted to JPG/PNG formats), and manages application logic.
3. **Data Access Layer (Database & Cache)**: Uses MongoDB (via Mongoose) as the primary NoSQL database for flexible data schemas, storing user profiles and posts. Redis (via ioredis) is employed to manage fast-access session caching and performance optimization.

# 4. Technologies Used
- **Frontend**: React (v19), Vite, CSS (Responsive Design), MediaPipe Tasks Vision (`@mediapipe/tasks-vision`) for AI features.
- **Backend**: Node.js, Express.js, Mongoose (MongoDB).
- **Authentication & Security**: `bcryptjs` for password hashing, `jsonwebtoken` for secure authorization tokens, `cookie-parser` for handling HTTP-only cookies securely across domains.
- **Caching**: Redis integration using `ioredis`.
- **Deployment**: Vercel (Frontend Hosting), Render (Backend Hosting).

# 5. Key Features and Implementation
## 5.1 Real-Time Facial Expressions (MediaPipe)
To distinguish itself from conventional social networks, Insta-Shadow incorporates the MediaPipe Face Landmarker API. This allows the application to detect and track key facial features in real-time natively in the web browser. The logic, encapsulated in the `FaceExpression.jsx` component, accesses the user's webcam (with permission) and overlays expression data without sending raw image feeds to the server, preserving user privacy.

## 5.2 Advanced Image Upload Validation
Security and optimized storage are paramount for user-generated content. Insta-Shadow features a rigid media validation strategy. On both the client and server sides, uploads are strictly verified for accepted MIME types (`image/jpeg`, `image/png`), preventing the upload of potentially malicious scripts masquerading as image files.

## 5.3 Secure Cross-Origin Authentication
The application relies on stateless JWT-based authentication. The tokens are generated on the Node.js server and stored securely in HTTP-only cookies on the client side. Special care was taken to configure Cross-Origin Resource Sharing (CORS) properly to allow seamless communication with credentials between the Vercel-hosted React frontend and the Render-hosted Express backend.

# 6. Challenges and Solutions
- **Authentication White-Space Bugs**: Cross-device login issues caused by trailing whitespaces in user inputs were resolved by strictly sanitizing and trimming identifiers before database queries.
- **CORS and Production Deployments**: Transitioning from `localhost` to production domains resulted in cookie-sharing rejections. This was solved by configuring strict dynamic origin checks and explicitly setting `SameSite=None` and `Secure` attributes for the JWT session cookies.
- **Client-Side AI Integration**: Initializing the MediaPipe Face Landmarker required precise synchronization between the asset path resolution and React's lifecycle hooks. The issues were mitigated by managing asynchronous models via robust `useEffect` and `.then()` promises.

# 7. Conclusion and Future Scope
The development of Insta-Shadow successfully demonstrates the robust capabilities of the MERN stack while showcasing how easily Artificial Intelligence models can be integrated to create an interactive web application. The rigorous attention to security, CORS handling, and media validation marks this application as production-ready.

Future enhancements for Insta-Shadow could include:
- Implementing WebSockets (e.g., Socket.io) for real-time messaging and notifications.
- Advanced cloud storage usage (such as AWS S3 or Cloudinary) for optimized scaling of image assets.
- Expanding MediaPipe integrations for interactive face filters and Augmented Reality (AR).

# 8. References
1. React Documentation. URL: https://react.dev/
2. Express Node.js framework. URL: https://expressjs.com/
3. MongoDB and Mongoose. URL: https://mongoosejs.com/
4. Google for Developers: MediaPipe Vision Tasks. URL: https://developers.google.com/mediapipe/solutions/vision/face_landmarker
