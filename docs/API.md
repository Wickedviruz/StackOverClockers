# API Documentation

This document provides an overview of the backend API endpoints.

---

## Base URL

The backend server runs at:
http://localhost:5000/api

---

## Authentication

### **POST /login**
Authenticate a user and generate a JWT token.

- **Request Body**:
```json
  {
    "username": "example_user",
    "password": "example_password"
  }
```
- **Response**:
```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
```
---

## Protected Endpoints

### **GET /protected**
Access a protected resource using a valid JWT token.

- **Headers**:
```json
  {
    "Authorization": "Bearer <access_token>"
  }
  ```

- **Response**:
```json
  {
    "message": "Welcome, authenticated user!"
  }
```
---

## Example Error Responses

- **Invalid credentials**:
```json
  {
    "error": "Invalid username or password"
  }
```

- **Missing or invalid token**:
```json
  {
    "error": "Authorization token is missing or invalid"
  }
```
---

For detailed examples and advanced usage, refer to the `tests` directory or open an issue if something is unclear.
