# API Documentation

## Base URL

All endpoints are relative to: `http://localhost:3000`

## Authentication Routes

### Signup

**URL:** `/api/auth/signup`

**Method:** `POST`

**Description:** Registers a new user.

**Request Body:**

```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
