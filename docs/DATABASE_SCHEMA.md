# Database Schema Documentation

This document describes the database schema for the Workflow Configuration Platform.

## Entity Relationship Diagram

```
┌─────────┐
│  User   │
└─────────┘
     │
     │
┌─────────┐      ┌──────────────┐
│ Client  │──────│  Workflow    │
└─────────┘      └──────────────┘
     │                  │
     │                  ├─── WorkflowStep
     │                  │
     │                  └─── WorkflowTransition
     │
     │
┌─────────────────┐
│WorkflowExecution│
└─────────────────┘
     │
     ├─── ExecutionLog
     │
     └─── WorkflowReport
```

## Tables

### users

Stores user accounts for authentication.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| email | VARCHAR | UNIQUE, NOT NULL | User email address |
| password | VARCHAR | NOT NULL | Hashed password |
| name | VARCHAR | NOT NULL | User full name |
| role | ENUM | DEFAULT 'USER' | User role (ADMIN, USER) |
| createdAt | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updatedAt | TIMESTAMP | AUTO UPDATE | Last update timestamp |

### clients

Stores client information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| name | VARCHAR | NOT NULL | Client name |
| email | VARCHAR | NULL | Client email |
| phone | VARCHAR | NULL | Client phone number |
| address | TEXT | NULL | Client address |
| company | VARCHAR | NULL | Company name |
| notes | TEXT | NULL | Additional notes |
| isActive | BOOLEAN | DEFAULT TRUE | Active status |
| createdAt | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updatedAt | TIMESTAMP | AUTO UPDATE | Last update timestamp |

**Relationships:**
- One-to-many with `workflows`
- One-to-many with `workflow_executions`

### workflows

Stores workflow definitions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| name | VARCHAR | NOT NULL | Workflow name |
| description | TEXT | NULL | Workflow description |
| clientId | UUID | FOREIGN KEY → clients.id | Associated client |
| status | ENUM | DEFAULT 'DRAFT' | Status (DRAFT, ACTIVE, INACTIVE, ARCHIVED) |
| version | INTEGER | DEFAULT 1 | Version number |
| createdBy | UUID | NULL | User who created |
| createdAt | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updatedAt | TIMESTAMP | AUTO UPDATE | Last update timestamp |

**Relationships:**
- Many-to-one with `clients`
- One-to-many with `workflow_steps`
- One-to-many with `workflow_transitions`
- One-to-many with `workflow_executions`
- One-to-many with `workflow_reports`

**Indexes:**
- `clientId`
- `status`

### workflow_steps

Stores individual steps within workflows.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| workflowId | UUID | FOREIGN KEY → workflows.id | Parent workflow |
| name | VARCHAR | NOT NULL | Step name |
| description | TEXT | NULL | Step description |
| stepType | VARCHAR | NOT NULL | Step type (approval, notification, etc.) |
| order | INTEGER | NOT NULL | Order in workflow |
| config | JSONB | NULL | Step configuration |
| isRequired | BOOLEAN | DEFAULT TRUE | Required flag |
| createdAt | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updatedAt | TIMESTAMP | AUTO UPDATE | Last update timestamp |

**Relationships:**
- Many-to-one with `workflows`
- One-to-many with `workflow_transitions` (as fromStep)
- One-to-many with `workflow_transitions` (as toStep)
- One-to-many with `execution_logs`

**Indexes:**
- `workflowId`
- `(workflowId, order)`

### workflow_transitions

Stores transitions between workflow steps.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| workflowId | UUID | FOREIGN KEY → workflows.id | Parent workflow |
| fromStepId | UUID | FOREIGN KEY → workflow_steps.id | Source step |
| toStepId | UUID | FOREIGN KEY → workflow_steps.id | Target step |
| condition | JSONB | NULL | Conditional rules |
| isDefault | BOOLEAN | DEFAULT FALSE | Default transition flag |
| createdAt | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updatedAt | TIMESTAMP | AUTO UPDATE | Last update timestamp |

**Relationships:**
- Many-to-one with `workflows`
- Many-to-one with `workflow_steps` (fromStep)
- Many-to-one with `workflow_steps` (toStep)

**Indexes:**
- `workflowId`
- `fromStepId`
- `toStepId`

### workflow_executions

Stores workflow execution instances.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| workflowId | UUID | FOREIGN KEY → workflows.id | Executed workflow |
| clientId | UUID | FOREIGN KEY → clients.id | Associated client |
| status | ENUM | DEFAULT 'PENDING' | Status (PENDING, RUNNING, COMPLETED, FAILED, CANCELLED) |
| startedAt | TIMESTAMP | DEFAULT NOW() | Start timestamp |
| completedAt | TIMESTAMP | NULL | Completion timestamp |
| metadata | JSONB | NULL | Execution metadata |
| createdAt | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updatedAt | TIMESTAMP | AUTO UPDATE | Last update timestamp |

**Relationships:**
- Many-to-one with `workflows`
- Many-to-one with `clients`
- One-to-many with `execution_logs`
- One-to-many with `workflow_reports`

**Indexes:**
- `workflowId`
- `clientId`
- `status`
- `startedAt`

### execution_logs

Stores detailed logs for workflow executions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| executionId | UUID | FOREIGN KEY → workflow_executions.id | Parent execution |
| stepId | UUID | FOREIGN KEY → workflow_steps.id | Related step (nullable) |
| status | ENUM | DEFAULT 'PENDING' | Status (PENDING, RUNNING, COMPLETED, FAILED, SKIPPED) |
| message | TEXT | NULL | Log message |
| data | JSONB | NULL | Log data |
| error | TEXT | NULL | Error message |
| startedAt | TIMESTAMP | DEFAULT NOW() | Start timestamp |
| completedAt | TIMESTAMP | NULL | Completion timestamp |

**Relationships:**
- Many-to-one with `workflow_executions`
- Many-to-one with `workflow_steps` (nullable)

**Indexes:**
- `executionId`
- `stepId`
- `status`

### workflow_reports

Stores aggregated workflow reports.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| workflowId | UUID | FOREIGN KEY → workflows.id | Related workflow |
| executionId | UUID | FOREIGN KEY → workflow_executions.id | Related execution (nullable) |
| reportType | VARCHAR | NOT NULL | Report type (daily, weekly, monthly, execution) |
| metrics | JSONB | NOT NULL | Report metrics |
| periodStart | TIMESTAMP | NOT NULL | Period start |
| periodEnd | TIMESTAMP | NULL | Period end |
| createdAt | TIMESTAMP | DEFAULT NOW() | Creation timestamp |

**Relationships:**
- Many-to-one with `workflows`
- Many-to-one with `workflow_executions` (nullable)

**Indexes:**
- `workflowId`
- `executionId`
- `reportType`
- `periodStart`

## Enums

### UserRole
- `ADMIN` - Administrator
- `USER` - Regular user

### WorkflowStatus
- `DRAFT` - Draft workflow
- `ACTIVE` - Active workflow
- `INACTIVE` - Inactive workflow
- `ARCHIVED` - Archived workflow

### ExecutionStatus
- `PENDING` - Execution pending
- `RUNNING` - Execution running
- `COMPLETED` - Execution completed
- `FAILED` - Execution failed
- `CANCELLED` - Execution cancelled

### StepStatus
- `PENDING` - Step pending
- `RUNNING` - Step running
- `COMPLETED` - Step completed
- `FAILED` - Step failed
- `SKIPPED` - Step skipped

## JSONB Fields

### workflow_steps.config
Example structure:
```json
{
  "notificationType": "email",
  "template": "welcome_email",
  "recipients": ["user@example.com"]
}
```

### workflow_transitions.condition
Example structure:
```json
{
  "field": "approved",
  "operator": "equals",
  "value": true
}
```

### workflow_executions.metadata
Example structure:
```json
{
  "simulation": true,
  "inputData": {
    "userId": "123",
    "documentId": "456"
  }
}
```

### execution_logs.data
Example structure:
```json
{
  "approved": true,
  "approver": "john@example.com",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### workflow_reports.metrics
Example structure:
```json
{
  "totalExecutions": 100,
  "completedExecutions": 85,
  "failedExecutions": 10,
  "averageExecutionTime": 5000
}
```

## Migration Strategy

1. **Initial Migration**: Creates all tables and indexes
2. **Version Control**: Use Prisma migrations for schema changes
3. **Backward Compatibility**: Maintain compatibility for at least 2 versions
4. **Data Migration**: Use separate migration scripts for data transformations

## Performance Considerations

1. **Indexes**: All foreign keys and frequently queried fields are indexed
2. **JSONB**: Used for flexible configuration storage with PostgreSQL JSONB indexing
3. **Pagination**: All list endpoints support pagination
4. **Cascading Deletes**: Configured appropriately to maintain data integrity
