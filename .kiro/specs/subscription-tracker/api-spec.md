# API Specification

## Overview

This document outlines the API endpoints, request/response formats, and authentication flows for the Subscription Tracker application. The API is built using Next.js API routes and integrates with Supabase for database operations and authentication.

## Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://subscription-tracker.example.com/api`

## API Versioning

API routes are versioned using URL path prefixes:

- Current version: `/api/v1/`

## Authentication

### Authentication Flow

The application uses Supabase Auth for authentication, specifically:

1. Google OAuth authentication (exclusive authentication method)

### API Authentication

- All API endpoints (except public endpoints) require authentication
- Authentication is handled via JWT tokens
- Tokens are passed in the `Authorization` header as `Bearer {token}`

### Middleware

- Authentication middleware validates the JWT token
- Plan-based access control middleware checks if the user's plan allows access to the requested endpoint

## Error Handling

All API errors follow a consistent format:

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": {}
  }
}
```

### Common Error Codes

- `401`: Unauthorized - Authentication required
- `403`: Forbidden - Insufficient permissions
- `404`: Not Found - Resource doesn't exist
- `422`: Unprocessable Entity - Validation error
- `429`: Too Many Requests - Rate limit exceeded
- `500`: Internal Server Error - Server-side error

## Rate Limiting

- Basic Plan: 60 requests per minute
- Pro Plan: 120 requests per minute
- Team Plan: 300 requests per minute

## Endpoints

### Authentication

#### `GET /api/v1/auth/google/url`

Get the Google OAuth URL for authentication.

**Response (200 OK):**
```json
{
  "url": "string"
}
```

#### `POST /api/v1/auth/google/callback`

Handle the Google OAuth callback and create a user session.

**Request Body:**
```json
{
  "code": "string",
  "plan": "basic|pro|team"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "plan": "string",
    "created_at": "string"
  },
  "session": {
    "access_token": "string",
    "refresh_token": "string",
    "expires_at": "number"
  },
  "isNewUser": "boolean"
}
```

#### `POST /api/v1/auth/logout`

End the current user session.

**Response (200 OK):**
```json
{
  "success": true
}
```

### Subscriptions

#### `GET /api/v1/subscriptions`

Get all subscriptions for the authenticated user.

**Query Parameters:**
- `limit`: number (default: 20)
- `offset`: number (default: 0)
- `sort`: string (default: "next_renewal_date")
- `order`: "asc" | "desc" (default: "asc")
- `tag`: string
- `search`: string

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "string",
      "user_id": "string",
      "name": "string",
      "amount": "number",
      "currency": "string",
      "billing_cycle": "monthly|quarterly|annual|custom",
      "start_date": "string",
      "next_renewal_date": "string",
      "provider": "string",
      "auto_renewal": "boolean",
      "tags": ["string"],
      "created_at": "string",
      "updated_at": "string"
    }
  ],
  "meta": {
    "total": "number",
    "limit": "number",
    "offset": "number"
  }
}
```

#### `POST /api/v1/subscriptions`

Create a new subscription.

**Request Body:**
```json
{
  "name": "string",
  "amount": "number",
  "currency": "string",
  "billing_cycle": "monthly|quarterly|annual|custom",
  "start_date": "string",
  "next_renewal_date": "string",
  "provider": "string",
  "auto_renewal": "boolean",
  "tags": ["string"]
}
```

**Response (201 Created):**
```json
{
  "id": "string",
  "user_id": "string",
  "name": "string",
  "amount": "number",
  "currency": "string",
  "billing_cycle": "monthly|quarterly|annual|custom",
  "start_date": "string",
  "next_renewal_date": "string",
  "provider": "string",
  "auto_renewal": "boolean",
  "tags": ["string"],
  "created_at": "string",
  "updated_at": "string"
}
```

#### `GET /api/v1/subscriptions/:id`

Get a specific subscription by ID.

**Response (200 OK):**
```json
{
  "id": "string",
  "user_id": "string",
  "name": "string",
  "amount": "number",
  "currency": "string",
  "billing_cycle": "monthly|quarterly|annual|custom",
  "start_date": "string",
  "next_renewal_date": "string",
  "provider": "string",
  "auto_renewal": "boolean",
  "tags": ["string"],
  "created_at": "string",
  "updated_at": "string"
}
```

#### `PUT /api/v1/subscriptions/:id`

Update a specific subscription.

**Request Body:**
```json
{
  "name": "string",
  "amount": "number",
  "currency": "string",
  "billing_cycle": "monthly|quarterly|annual|custom",
  "start_date": "string",
  "next_renewal_date": "string",
  "provider": "string",
  "auto_renewal": "boolean",
  "tags": ["string"]
}
```

**Response (200 OK):**
```json
{
  "id": "string",
  "user_id": "string",
  "name": "string",
  "amount": "number",
  "currency": "string",
  "billing_cycle": "monthly|quarterly|annual|custom",
  "start_date": "string",
  "next_renewal_date": "string",
  "provider": "string",
  "auto_renewal": "boolean",
  "tags": ["string"],
  "created_at": "string",
  "updated_at": "string"
}
```

#### `DELETE /api/v1/subscriptions/:id`

Delete a specific subscription.

**Response (200 OK):**
```json
{
  "success": true
}
```

### Analytics (Pro & Team Plans)

#### `GET /api/v1/analytics/summary`

Get summary analytics for the authenticated user.

**Query Parameters:**
- `period`: "month" | "quarter" | "year" (default: "month")

**Response (200 OK):**
```json
{
  "total_mrr": "number",
  "total_yrr": "number",
  "subscription_count": "number",
  "upcoming_renewals": "number",
  "category_breakdown": [
    {
      "category": "string",
      "amount": "number",
      "percentage": "number"
    }
  ],
  "trend": [
    {
      "date": "string",
      "amount": "number"
    }
  ]
}
```

#### `GET /api/v1/analytics/forecast`

Get expense forecasting data.

**Query Parameters:**
- `months`: number (default: 12)

**Response (200 OK):**
```json
{
  "forecast": [
    {
      "date": "string",
      "amount": "number",
      "subscriptions": [
        {
          "id": "string",
          "name": "string",
          "amount": "number",
          "renewal_date": "string"
        }
      ]
    }
  ],
  "total_forecast": "number"
}
```

### Invoices (Pro & Team Plans)

#### `GET /api/v1/subscriptions/:id/invoices`

Get all invoices for a specific subscription.

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "string",
      "subscription_id": "string",
      "file_path": "string",
      "issue_date": "string",
      "amount": "number",
      "created_at": "string"
    }
  ]
}
```

#### `POST /api/v1/subscriptions/:id/invoices`

Upload a new invoice for a subscription.

**Request Body (multipart/form-data):**
- `file`: File (PDF/Image)
- `issue_date`: string
- `amount`: number

**Response (201 Created):**
```json
{
  "id": "string",
  "subscription_id": "string",
  "file_path": "string",
  "issue_date": "string",
  "amount": "number",
  "created_at": "string"
}
```

#### `DELETE /api/v1/invoices/:id`

Delete a specific invoice.

**Response (200 OK):**
```json
{
  "success": true
}
```

### Reminders (Pro & Team Plans)

#### `GET /api/v1/subscriptions/:id/reminders`

Get all reminders for a specific subscription.

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "string",
      "subscription_id": "string",
      "days_before": "number",
      "notification_type": "email|slack|discord",
      "created_at": "string"
    }
  ]
}
```

#### `POST /api/v1/subscriptions/:id/reminders`

Create a new reminder for a subscription.

**Request Body:**
```json
{
  "days_before": "number",
  "notification_type": "email|slack|discord"
}
```

**Response (201 Created):**
```json
{
  "id": "string",
  "subscription_id": "string",
  "days_before": "number",
  "notification_type": "email|slack|discord",
  "created_at": "string"
}
```

#### `DELETE /api/v1/reminders/:id`

Delete a specific reminder.

**Response (200 OK):**
```json
{
  "success": true
}
```

### Team Management (Team Plan)

#### `GET /api/v1/teams`

Get all teams for the authenticated user.

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "owner_id": "string",
      "created_at": "string",
      "updated_at": "string"
    }
  ]
}
```

#### `POST /api/v1/teams`

Create a new team.

**Request Body:**
```json
{
  "name": "string"
}
```

**Response (201 Created):**
```json
{
  "id": "string",
  "name": "string",
  "owner_id": "string",
  "created_at": "string",
  "updated_at": "string"
}
```

#### `GET /api/v1/teams/:id/members`

Get all members of a specific team.

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "string",
      "team_id": "string",
      "user_id": "string",
      "role": "admin|viewer",
      "user": {
        "id": "string",
        "email": "string",
        "name": "string"
      },
      "created_at": "string"
    }
  ]
}
```

#### `POST /api/v1/teams/:id/members`

Add a new member to a team.

**Request Body:**
```json
{
  "email": "string",
  "role": "admin|viewer"
}
```

**Response (201 Created):**
```json
{
  "id": "string",
  "team_id": "string",
  "user_id": "string",
  "role": "admin|viewer",
  "created_at": "string"
}
```

#### `PUT /api/v1/teams/:teamId/members/:memberId`

Update a team member's role.

**Request Body:**
```json
{
  "role": "admin|viewer"
}
```

**Response (200 OK):**
```json
{
  "id": "string",
  "team_id": "string",
  "user_id": "string",
  "role": "admin|viewer",
  "created_at": "string",
  "updated_at": "string"
}
```

#### `DELETE /api/v1/teams/:teamId/members/:memberId`

Remove a member from a team.

**Response (200 OK):**
```json
{
  "success": true
}
```

### Comments (Team Plan)

#### `GET /api/v1/subscriptions/:id/comments`

Get all comments for a specific subscription.

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "string",
      "subscription_id": "string",
      "user_id": "string",
      "content": "string",
      "user": {
        "id": "string",
        "name": "string"
      },
      "created_at": "string"
    }
  ]
}
```

#### `POST /api/v1/subscriptions/:id/comments`

Add a new comment to a subscription.

**Request Body:**
```json
{
  "content": "string"
}
```

**Response (201 Created):**
```json
{
  "id": "string",
  "subscription_id": "string",
  "user_id": "string",
  "content": "string",
  "created_at": "string"
}
```

#### `DELETE /api/v1/comments/:id`

Delete a specific comment.

**Response (200 OK):**
```json
{
  "success": true
}
```

### Integrations (Team Plan)

#### `GET /api/v1/integrations`

Get all integrations for the authenticated user's team.

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "string",
      "team_id": "string",
      "service_type": "slack|discord",
      "config_json": {},
      "created_at": "string",
      "updated_at": "string"
    }
  ]
}
```

#### `POST /api/v1/integrations`

Create a new integration.

**Request Body:**
```json
{
  "service_type": "slack|discord",
  "config_json": {}
}
```

**Response (201 Created):**
```json
{
  "id": "string",
  "team_id": "string",
  "service_type": "slack|discord",
  "config_json": {},
  "created_at": "string"
}
```

#### `DELETE /api/v1/integrations/:id`

Delete a specific integration.

**Response (200 OK):**
```json
{
  "success": true
}
```

### Import/Export

#### `POST /api/v1/import`

Import subscriptions from a CSV file.

**Request Body (multipart/form-data):**
- `file`: File (CSV)

**Response (200 OK):**
```json
{
  "imported": "number",
  "errors": [
    {
      "row": "number",
      "message": "string"
    }
  ]
}
```

#### `GET /api/v1/export`

Export subscriptions to a CSV file.

**Query Parameters:**
- `format`: "csv" | "json" | "pdf" (default: "csv")

**Response (200 OK):**
- File download

## Webhook Support

For integrations with external services, the API provides webhook endpoints:

### `POST /api/v1/webhooks/:integrationId`

Receive webhook events from integrated services.

**Request Body:**
- Varies by integration

**Response (200 OK):**
```json
{
  "received": true
}
```

## API Client Implementation

The frontend application uses Axios for API requests. Example implementation:

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized (redirect to login)
    }
    return Promise.reject(error);
  }
);

export default api;
```

## Security Considerations

- All API endpoints use HTTPS
- Authentication tokens have a limited lifespan
- Rate limiting prevents abuse
- Input validation on all endpoints
- CORS policies restrict access to approved domains
- API keys for third-party integrations are encrypted in the database

---

*Note: This API specification is subject to change as the application evolves.*