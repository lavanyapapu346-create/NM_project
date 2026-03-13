## Goal Management Backend (Node.js, Express, MongoDB)

This is a simple backend API for managing **user goals**.  
Users can **sign up, log in, and create/update/delete goals**.  
The project uses **Node.js, Express, MongoDB (via Mongoose), JWT for authentication, and Joi for validation**.

---

### 1. Technologies Used

- **Node.js** – JavaScript runtime
- **Express.js** – Web framework for building APIs
- **MongoDB** – NoSQL database
- **Mongoose** – ODM to work with MongoDB
- **JWT (jsonwebtoken)** – Authentication tokens
- **bcryptjs** – Password hashing
- **Joi** – Request body validation
- **dotenv** – Load environment variables
- **cors** – Enable CORS (for frontend access)

---

### 2. Project Structure (Backend folder)

- `Index.js`  
  Main entry file. Creates Express app, connects to MongoDB, registers routes and middleware, and starts the server.

- `Router/AuthRouter.js`  
  Routes for **user signup** and **login**. Handles:
  - Validating input with Joi
  - Checking if user exists
  - Hashing passwords with bcryptjs
  - Generating JWT token on successful signup/login

- `Router/GoalRouter.js`  
  Routes for **goal CRUD operations** (Create, Read, Update, Delete).  
  All routes are protected by JWT auth middleware.

- `Middlewares/authMiddleware.js`  
  Verifies JWT token from the `Authorization` header and attaches `req.user` (user id) to the request.

- `Middlewares/errormiddleware.js`  
  Central error handler. Sends a clean JSON response if an error is thrown or passed with `next(err)`.

- `Schema/User.js`  
  Mongoose schema for users: `name`, `email`, `password`.

- `Schema/GoalSchema.js`  
  Mongoose schema for goals: `title`, `completed`, `user` (reference to `User`).

- `Model/UserModel.js`  
  Mongoose model based on `User` schema, used to perform DB operations on users.

- `Model/GoalModel.js`  
  Mongoose model based on `Goal` schema, used to perform DB operations on goals.

- `validation/userValidation.js`  
  Joi validation schema for user signup data (name, email, password).

- `utills/genratetoken.js`  
  Helper to generate a JWT token for a user using `SECRET_KEY`.

- `package.json`  
  Project metadata, scripts, and npm dependencies.

---

### 3. Installation Steps

1. **Go to the Backend folder**

   ```bash
   cd Backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   A `.env` file is already set up with:

   ```env
   PORT=8000
   SECRET_KEY=mysecretkey123
   MONGO_URL="mongodb+srv://lavanyapapu346_db_user:Lavany%402006@cluster0.shuvufr.mongodb.net/goalsdb?retryWrites=true&w=majority&appName=Cluster0"
   ```

   > Do **not** commit `.env` to Git. It is ignored using `.gitignore`.

4. **Ensure MongoDB cluster is running and accessible**

---

### 4. Running the Server

From inside the `Backend` folder:

```bash
npm start
```

This runs:

```bash
node Index.js
```

The server will start on:

```text
http://localhost:8000
```

If MongoDB connects successfully, you should see:

```text
MongoDB Connected
Server running on port 8000
```

---

### 5. API Endpoints

All endpoints are relative to `http://localhost:8000`.

#### 5.1 Auth Routes

- **POST `/signup`** – Register a new user  
  **Body (JSON):**

  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "123456"
  }
  ```

  **Response (success):**

  ```json
  {
    "success": true,
    "message": "user is created",
    "token": "<jwt_token>",
    "data": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "password": "<hashed_password>"
    }
  }
  ```

- **POST `/login`** – Log in existing user  
  **Body (JSON):**

  ```json
  {
    "email": "john@example.com",
    "password": "123456"
  }
  ```

  **Response (success):**

  ```json
  {
    "success": true,
    "message": "login succesfully",
    "token": "<jwt_token>",
    "data": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
  ```

---

#### 5.2 Protected Goal Routes (require JWT)

For all the following routes, set the HTTP header:

```text
Authorization: Bearer <jwt_token>
```

You get `<jwt_token>` from the `/signup` or `/login` response.

- **POST `/create`** – Create a goal  
  **Headers:**
  - `Authorization: Bearer <jwt_token>`

  **Body (JSON):**

  ```json
  {
    "title": "Finish backend project"
  }
  ```

- **GET `/:id`** – Get a goal by ID  
  **Example URL:**

  ```text
  GET /64f123abc456def789012345
  ```

  **Headers:**
  - `Authorization: Bearer <jwt_token>`

- **PUT `/:id`** – Update goal completion status  
  **Example URL:**

  ```text
  PUT /64f123abc456def789012345
  ```

  **Headers:**
  - `Authorization: Bearer <jwt_token>`

  **Body (JSON):**

  ```json
  {
    "completed": true
  }
  ```

- **DELETE `/:id`** – Delete a goal by ID  
  **Example URL:**

  ```text
  DELETE /64f123abc456def789012345
  ```

  **Headers:**
  - `Authorization: Bearer <jwt_token>`

---

### 6. Testing with Thunder Client / Postman

1. **Signup**
   - Method: `POST`
   - URL: `http://localhost:8000/signup`
   - Body: raw JSON (see above)
   - Copy the `token` from the response.

2. **Login**
   - Method: `POST`
   - URL: `http://localhost:8000/login`
   - Body: raw JSON (see above)
   - Copy the `token` from the response.

3. **Create Goal**
   - Method: `POST`
   - URL: `http://localhost:8000/create`
   - Headers:
     - `Authorization: Bearer <jwt_token>`
   - Body: raw JSON (see above)

4. **Get Goal by ID**
   - Method: `GET`
   - URL: `http://localhost:8000/<goalId>`
   - Headers:
     - `Authorization: Bearer <jwt_token>`

5. **Update Goal**
   - Method: `PUT`
   - URL: `http://localhost:8000/<goalId>`
   - Headers:
     - `Authorization: Bearer <jwt_token>`
   - Body: raw JSON (see above)

6. **Delete Goal**
   - Method: `DELETE`
   - URL: `http://localhost:8000/<goalId>`
   - Headers:
     - `Authorization: Bearer <jwt_token>`

If the token is missing or invalid, the server responds with:

```json
{
  "message": "No token"
}
```

or

```json
{
  "message": "Invalid token"
}
```

---

### 7. JWT Auth Flow Summary (for presentation)

1. User **registers or logs in**.
2. Server **creates JWT token** containing `userId` using `SECRET_KEY`.
3. Client stores token and sends it in `Authorization: Bearer <jwt_token>` header.
4. `authMiddleware` verifies token and sets `req.user` to the decoded `userId`.
5. Protected goal routes use `req.user` to create/read/update/delete goals for that user.

This shows authentication and authorization in a clean, beginner-friendly way.

