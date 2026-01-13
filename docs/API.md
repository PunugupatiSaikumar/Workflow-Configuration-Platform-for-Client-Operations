# API Documentation

Complete API reference for the Workflow Configuration Platform.

Base URL: `http://localhost:5000/api`

## Authentication

All endpoints except `/auth/login` and `/auth/register` require authentication via Bearer token.

### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "USER" // optional, defaults to USER
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER"
  },
  "token": "jwt-token"
}
```

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER"
  },
  "token": "jwt-token"
}
```

### Get Current User

```http
GET /api/auth/me
Authorization: Bearer {token}
```

## Clients

### List Clients

```http
GET /api/clients?page=1&limit=10&isActive=true
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `isActive` (optional): Filter by active status (true/false)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Acme Corp",
      "email": "contact@acme.com",
      "phone": "+1-555-0100",
      "address": "123 Business St",
      "company": "Acme Corporation",
      "notes": "Major client",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### Get Client

```http
GET /api/clients/{id}
Authorization: Bearer {token}
```

### Create Client

```http
POST /api/clients
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "New Client",
  "email": "client@example.com",
  "phone": "+1-555-0100",
  "address": "123 Main St",
  "company": "Company Name",
  "notes": "Notes",
  "isActive": true
}
```

### Update Client

```http
PUT /api/clients/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "newemail@example.com"
}
```

### Delete Client

```http
DELETE /api/clients/{id}
Authorization: Bearer {token}
```

## Workflows

### List Workflows

```http
GET /api/workflows?page=1&limit=10&clientId={id}&status=ACTIVE
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `clientId` (optional): Filter by client
- `status` (optional): Filter by status (DRAFT, ACTIVE, INACTIVE, ARCHIVED)

### Get Workflow

```http
GET /api/workflows/{id}
Authorization: Bearer {token}
```

**Response includes:**
- Workflow details
- Steps (ordered by `order`)
- Transitions
- Client information

### Create Workflow

```http
POST /api/workflows
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "New Workflow",
  "description": "Workflow description",
  "clientId": "client-uuid",
  "status": "DRAFT"
}
```

### Update Workflow

```http
PUT /api/workflows/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Name",
  "status": "ACTIVE"
}
```

### Delete Workflow

```http
DELETE /api/workflows/{id}
Authorization: Bearer {token}
```

### Add Step to Workflow

```http
POST /api/workflows/{id}/steps
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Approval Step",
  "description": "Requires approval",
  "stepType": "approval",
  "order": 0,
  "config": {
    "approverRole": "manager"
  },
  "isRequired": true
}
```

**Step Types:**
- `approval` - Requires approval
- `notification` - Sends notification
- `data_entry` - Data entry step
- `custom` - Custom step

### Update Step

```http
PUT /api/workflows/{id}/steps/{stepId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Step Name",
  "order": 1
}
```

### Delete Step

```http
DELETE /api/workflows/{id}/steps/{stepId}
Authorization: Bearer {token}
```

### Add Transition

```http
POST /api/workflows/{id}/transitions
Authorization: Bearer {token}
Content-Type: application/json

{
  "fromStepId": "step-uuid-1",
  "toStepId": "step-uuid-2",
  "condition": {
    "field": "approved",
    "operator": "equals",
    "value": true
  },
  "isDefault": false
}
```

**Condition Operators:**
- `equals`
- `notEquals`
- `greaterThan`
- `lessThan`
- `contains`

### Delete Transition

```http
DELETE /api/workflows/{id}/transitions/{transitionId}
Authorization: Bearer {token}
```

### Simulate Workflow

```http
POST /api/workflows/{id}/simulate
Authorization: Bearer {token}
Content-Type: application/json

{
  "clientId": "client-uuid",
  "inputData": {
    "userId": "123",
    "documentId": "456"
  }
}
```

**Response:** Returns execution object with logs

## Executions

### List Executions

```http
GET /api/executions?page=1&limit=10&workflowId={id}&clientId={id}&status=COMPLETED
Authorization: Bearer {token}
```

### Get Execution

```http
GET /api/executions/{id}
Authorization: Bearer {token}
```

**Response includes:**
- Execution details
- Workflow information
- Client information
- All execution logs

### Get Execution Logs

```http
GET /api/executions/{id}/logs
Authorization: Bearer {token}
```

### Create Execution

```http
POST /api/executions
Authorization: Bearer {token}
Content-Type: application/json

{
  "workflowId": "workflow-uuid",
  "clientId": "client-uuid",
  "metadata": {
    "custom": "data"
  }
}
```

## Reports

### Get Reports

```http
GET /api/reports?workflowId={id}&clientId={id}&startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer {token}
```

**Response:**
```json
{
  "period": {
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-12-31T23:59:59Z"
  },
  "summary": {
    "totalExecutions": 100,
    "completedExecutions": 85,
    "failedExecutions": 10,
    "runningExecutions": 5,
    "successRate": 85.0,
    "averageExecutionTimeMs": 5000
  },
  "byWorkflow": [...],
  "byClient": [...],
  "byStep": [...]
}
```

### Get Workflow Report

```http
GET /api/reports/{workflowId}
Authorization: Bearer {token}
```

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `204` - No Content (delete success)
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting for production.

## Pagination

All list endpoints support pagination:
- Default page size: 10
- Maximum page size: 100
- Page numbers start at 1

## Filtering

Many endpoints support filtering via query parameters. See individual endpoint documentation above.

## Sorting

Currently, results are sorted by creation date (newest first). Custom sorting may be added in future versions.
