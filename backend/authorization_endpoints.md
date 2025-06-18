#  Auth API Documentation

##  POST `/api/auth/register`
Registers a new user (Student, TA, Teacher, Admin)

### Request Body
```json
{
  "name": "Alice",
  "email": "alice@mail.com",
  "password": "pass123",
  "role": "student" // or "ta", "teacher", "admin"
}
```

### Response (201 - Success)
```json
{
  "message": "User registered successfully"
}
```

### Possible Errors
- `400 Bad Request`: User already exists
- `500 Internal Server Error`: Registration failed

---

##  POST `/api/auth/login`
Logs in a user and returns a JWT token

### Request Body
```json
{
  "email": "alice@mail.com",
  "password": "pass123"
}
```

### Response (200 - Success)
```json
{
  "token": "<JWT_TOKEN>",
  "user": {
    "id": "<USER_ID>",
    "name": "Alice",
    "email": "alice@mail.com",
    "role": "student"
  }
}
```

### Possible Errors
- `401 Unauthorized`: Invalid email or password
- `500 Internal Server Error`: Login failed