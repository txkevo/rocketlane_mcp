# Rocketlane API Documentation
## For use with Rocketlane MCP Server

Base URL: `https://api.rocketlane.com/api/1.0`
Authentication: `api-key` header (generate in Rocketlane Settings → API)

---

## Cross-Cutting Concerns

### Authentication
All requests require the header:
```
api-key: YOUR_API_KEY
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `204` - Deleted (no response body)
- `400` - Bad Request (malformed payload)
- `401` - Unauthorized (missing/invalid api-key)
- `404` - Not Found
- `429` - Rate Limited (check `X-Retry-After` header)
- `500` - Internal Server Error

### Error Response Format
```json
{
  "errors": [
    {
      "errorCode": "BAD_REQUEST",
      "errorMessage": "Bad Request: ...",
      "field": "fieldName"
    }
  ]
}
```

### Pagination
All list endpoints support:
- `pageSize` (int, default 100) - Results per page
- `pageToken` (string) - Token for next page (valid 15 minutes)

Response includes:
```json
{
  "data": [...],
  "pagination": {
    "pageSize": 100,
    "hasMore": true,
    "totalRecordCount": 500,
    "nextPage": "https://...",
    "nextPageToken": "uuid"
  }
}
```

### Filtering
Format: `field.operator=value`
Operators: `eq`, `cn` (contains), `nc` (not contains), `gt`, `ge`, `lt`, `le`, `oneOf`, `noneOf`, `any`, `none`
Combine with `match=all` (AND) or `match=any` (OR)

### Rate Limiting
- Limits apply per minute and per hour
- On 429, check `X-Retry-After` header for wait time

---

## Resources

---

## 1. Tasks

### Endpoints
| Method | Path | Operation ID | Description |
|--------|------|-------------|-------------|
| GET | `/tasks` | `get-all-tasks` | List/search all tasks |
| POST | `/tasks` | `create-task` | Create a task |
| GET | `/tasks/{taskId}` | `get-task` | Get task by ID |
| PUT | `/tasks/{taskId}` | `update-task` | Update task by ID |
| DELETE | `/tasks/{taskId}` | `delete-task` | Delete task by ID |
| POST | `/tasks/{taskId}/assignees` | `add-task-assignees` | Add assignees |
| DELETE | `/tasks/{taskId}/assignees` | `remove-task-assignees` | Remove assignees |
| POST | `/tasks/{taskId}/followers` | `add-task-followers` | Add followers |
| DELETE | `/tasks/{taskId}/followers` | `remove-task-followers` | Remove followers |
| POST | `/tasks/{taskId}/dependencies` | `add-task-dependencies` | Add dependencies |
| DELETE | `/tasks/{taskId}/dependencies` | `remove-task-dependencies` | Remove dependencies |
| POST | `/tasks/{taskId}/move-to-phase` | `move-task-to-phase` | Move task to phase |

### Task Object Fields
- `taskId` (int64, readonly)
- `taskName` (string, required)
- `description` (string)
- `status` (string)
- `priority` (string) - `LOW`, `MEDIUM`, `HIGH`
- `startDate` (string, YYYY-MM-DD)
- `dueDate` (string, YYYY-MM-DD)
- `assignees` (array of user objects)
- `followers` (array of user objects)
- `phaseId` (int64)
- `projectId` (int64)
- `estimatedMinutes` (int32)
- `fields` (array of custom field objects)

### includeFields options
`description`, `assignees`, `followers`, `dependencies`, `fields`, `estimatedMinutes`

### Filters (get-all-tasks)
`taskName.eq/cn/nc`, `status.eq/oneOf/noneOf`, `priority.eq/oneOf/noneOf`,
`startDate.eq/gt/ge/lt/le`, `dueDate.eq/gt/ge/lt/le`,
`assignee.eq/any/none`, `projectId.eq/oneOf/noneOf`, `phaseId.eq/oneOf/noneOf`
sortBy: `taskName`, `startDate`, `dueDate`, `priority`, `status`

---

## 2. Projects

### Endpoints
| Method | Path | Operation ID | Description |
|--------|------|-------------|-------------|
| GET | `/projects` | `get-all-projects` | List/search all projects |
| POST | `/projects` | `create-project` | Create a project |
| GET | `/projects/{projectId}` | `get-project` | Get project by ID |
| PUT | `/projects/{projectId}` | `update-project` | Update project by ID |
| DELETE | `/projects/{projectId}` | `delete-project` | Delete project by ID |
| GET | `/projects/{projectId}/members` | `get-project-members` | Get project members |
| POST | `/projects/{projectId}/members` | `add-project-members` | Add project members |
| DELETE | `/projects/{projectId}/members` | `remove-project-members` | Remove project members |
| GET | `/projects/{projectId}/placeholders` | `get-project-placeholders` | Get placeholders |
| POST | `/projects/{projectId}/placeholders` | `add-project-placeholders` | Add placeholders |
| POST | `/projects/{projectId}/archive` | `archive-project` | Archive a project |
| POST | `/projects/{projectId}/import-template` | `import-template` | Import template into project |

### Project Object Fields
- `projectId` (int64, readonly)
- `projectName` (string, required)
- `description` (string)
- `status` (string)
- `startDate` (string, YYYY-MM-DD)
- `dueDate` (string, YYYY-MM-DD)
- `ownerId` (int64)
- `companyId` (int64)
- `members` (array of user objects)
- `fields` (array of custom field objects)

### includeFields options
`description`, `members`, `placeholders`, `fields`

### Filters (get-all-projects)
`projectName.eq/cn/nc`, `status.eq/oneOf/noneOf`,
`startDate.eq/gt/ge/lt/le`, `dueDate.eq/gt/ge/lt/le`,
`ownerId.eq/oneOf/noneOf`, `companyId.eq/oneOf/noneOf`,
`member.eq/any/none`
sortBy: `projectName`, `startDate`, `dueDate`, `status`, `createdAt`

---

## 3. Phases

### Endpoints
| Method | Path | Operation ID | Description |
|--------|------|-------------|-------------|
| GET | `/phases` | `get-all-phases` | List all phases |
| POST | `/phases` | `create-phase` | Create a phase |
| GET | `/phases/{phaseId}` | `get-phase` | Get phase by ID |
| PUT | `/phases/{phaseId}` | `update-phase` | Update phase by ID |
| DELETE | `/phases/{phaseId}` | `delete-phase` | Delete phase by ID |

### Phase Object Fields
- `phaseId` (int64, readonly)
- `phaseName` (string, required)
- `projectId` (int64, required)
- `startDate` (string, YYYY-MM-DD)
- `dueDate` (string, YYYY-MM-DD)
- `order` (int32)

### Filters (get-all-phases)
`projectId.eq` (required), `phaseName.eq/cn/nc`
sortBy: `phaseName`, `startDate`, `dueDate`

---

## 4. Fields (Custom Fields)

### Endpoints
| Method | Path | Operation ID | Description |
|--------|------|-------------|-------------|
| GET | `/fields` | `get-all-fields` | List all custom fields |
| POST | `/fields` | `create-field` | Create a custom field |
| GET | `/fields/{fieldId}` | `get-field` | Get field by ID |
| PUT | `/fields/{fieldId}` | `update-field` | Update field by ID |
| DELETE | `/fields/{fieldId}` | `delete-field` | Delete field by ID |
| POST | `/fields/{fieldId}/options` | `add-field-options` | Add options to field |
| DELETE | `/fields/{fieldId}/options` | `remove-field-options` | Remove options from field |

### Field Object Fields
- `fieldId` (int64, readonly)
- `fieldLabel` (string, required)
- `fieldType` (string) - `TEXT`, `NUMBER`, `DATE`, `DROPDOWN`, `MULTI_SELECT`, `CHECKBOX`, `URL`
- `entityType` (string) - `TASK`, `PROJECT`, `INVOICE`
- `options` (array) - for DROPDOWN/MULTI_SELECT types
- `required` (boolean)

---

## 5. Users

### Endpoints
| Method | Path | Operation ID | Description |
|--------|------|-------------|-------------|
| GET | `/users` | `get-all-users` | List all users |
| GET | `/users/{userId}` | `get-user` | Get user by ID |

### User Object Fields
- `userId` (int64, readonly)
- `emailId` (string)
- `firstName` (string)
- `lastName` (string)
- `role` (object) - roleId, roleName

---

## 6. Spaces

### Endpoints
| Method | Path | Operation ID | Description |
|--------|------|-------------|-------------|
| GET | `/spaces` | `get-all-spaces` | List all spaces |
| POST | `/spaces` | `create-space` | Create a space |
| GET | `/spaces/{spaceId}` | `get-space` | Get space by ID |
| PUT | `/spaces/{spaceId}` | `update-space` | Update space by ID |
| DELETE | `/spaces/{spaceId}` | `delete-space` | Delete space by ID |

### Space Object Fields
- `spaceId` (int64, readonly)
- `spaceName` (string, required)
- `projectId` (int64, required)
- `private` (boolean)
- `createdAt` (int64, epoch ms)
- `createdBy` (user object)
- `updatedAt` (int64, epoch ms)
- `updatedBy` (user object)

---

## 7. Time Tracking

### Endpoints
| Method | Path | Operation ID | Description |
|--------|------|-------------|-------------|
| GET | `/time-entries` | `get-all-time-entries` | List/search time entries |
| POST | `/time-entries` | `create-time-entry` | Create a time entry |
| GET | `/time-entries/{timeEntryId}` | `get-time-entry` | Get time entry by ID |
| PUT | `/time-entries/{timeEntryId}` | `update-time-entry` | Update time entry by ID |
| DELETE | `/time-entries/{timeEntryId}` | `delete-time-entry` | Delete time entry by ID |
| POST | `/time-entries/search` | `search-time-entries` | Advanced search |
| GET | `/time-entry-categories` | `get-time-entry-categories` | List time entry categories |

### Time Entry Object Fields
- `timeEntryId` (int64, readonly)
- `userId` (int64, required)
- `taskId` (int64)
- `projectId` (int64)
- `minutes` (int32, required) - Duration in minutes
- `date` (string, YYYY-MM-DD, required)
- `billable` (boolean)
- `categoryId` (int64)
- `notes` (string)

### includeFields options
`notes`, `category`

### Filters (get-all-time-entries)
`date.eq/gt/ge/lt/le`, `billable.eq`,
`userId.eq/oneOf/noneOf`, `projectId.eq/oneOf/noneOf`, `taskId.eq/oneOf/noneOf`,
`categoryId.eq/oneOf/noneOf`
sortBy: `date`, `minutes`

---

## 8. Time-Offs

### Endpoints
| Method | Path | Operation ID | Description |
|--------|------|-------------|-------------|
| GET | `/time-offs` | `get-all-timeoffs` | List/search all time-offs |
| POST | `/time-offs` | `create-timeoff` | Create a time-off |
| GET | `/time-offs/{timeOffId}` | `get-timeoff` | Get time-off by ID |
| DELETE | `/time-offs/{timeOffId}` | `delete-timeoff` | Delete time-off by ID |

### Time-Off Object Fields
- `timeOffId` (int64, readonly)
- `user` (object) - userId, emailId, firstName, lastName
- `startDate` (string, YYYY-MM-DD, required)
- `endDate` (string, YYYY-MM-DD, required) - must be >= startDate
- `type` (string, required) - `FULL_DAY`, `HALF_DAY`, `CUSTOM`
- `durationInMinutes` (int32) - per day duration
  - FULL_DAY: `CAPACITY_IN_MINUTES / WORKING_DAYS_OF_WEEK`
  - HALF_DAY: `(CAPACITY_IN_MINUTES / WORKING_DAYS_OF_WEEK) / 2`
- `note` (string)
- `notifyUsers` (object)
  - `projectOwners` (boolean)
  - `others` (array of user objects)
- `createdAt` (int64, epoch ms)
- `createdBy` (user object)

### includeFields options
`note`, `notifyUsers`

### Filters (get-all-timeoffs)
`startDate.eq/gt/ge/lt/le`, `endDate.eq/gt/ge/lt/le`,
`userId.eq/oneOf/noneOf`, `type.eq/oneOf/noneOf`
sortBy: `startDate`, `endDate`

---

## 9. Space Documents

### Endpoints
| Method | Path | Operation ID | Description |
|--------|------|-------------|-------------|
| GET | `/space-documents` | `get-all-space-documents` | List all space documents |
| POST | `/space-documents` | `create-space-document` | Create a space document |
| GET | `/space-documents/{spaceDocumentId}` | `get-space-document` | Get space document by ID |
| PUT | `/space-documents/{spaceDocumentId}` | `update-space-document` | Update space document |
| DELETE | `/space-documents/{spaceDocumentId}` | `delete-space-document` | Delete space document |

### Space Document Object Fields
- `spaceDocumentId` (int64, readonly)
- `spaceDocumentName` (string, default: "Untitled")
- `space` (object, required) - spaceId, spaceName
- `spaceDocumentType` (string, required) - `ROCKETLANE_DOCUMENT`, `EMBEDDED_DOCUMENT`
- `url` (string) - URL for EMBEDDED_DOCUMENT type
- `source` (object) - templateId, templateName (for template-based creation)
- `private` (boolean)
- `createdAt` (int64, epoch ms)
- `createdBy` (user object)
- `updatedAt` (int64, epoch ms)
- `updatedBy` (user object)

### Create Request Required Fields
- `space.spaceId` (required)
- `spaceDocumentType` (required)

### Update Request Fields (PUT)
- `spaceDocumentName` (string)
- `url` (string) - only for EMBEDDED_DOCUMENT

### Filters (get-all-space-documents)
`projectId` (required query param),
`spaceDocumentName.eq/cn/nc`,
`createdAt.eq/gt/ge/lt/le`, `updatedAt.eq/gt/ge/lt/le`,
`spaceId.eq`
sortBy: `spaceTabName`

---

## 10. Invoices

### Endpoints
| Method | Path | Operation ID | Description |
|--------|------|-------------|-------------|
| GET | `/invoices` | `search-invoices` | List/search all invoices |
| GET | `/invoices/{invoiceId}` | `get-invoice` | Get invoice by ID |
| GET | `/invoices/{invoiceId}/payments` | `get-invoice-payments` | Get payments for invoice |
| GET | `/invoices/{invoiceId}/lines` | `get-invoice-line-items` | Get line items for invoice |

### Invoice Object Fields
- `invoiceId` (int64, readonly)
- `invoiceNumber` (string)
- `dateOfIssue` (string, YYYY-MM-DD)
- `dueDate` (string, YYYY-MM-DD)
- `currency` (string) - ISO currency code (USD, EUR, GBP, INR, etc.)
- `status` (string) - e.g. `DRAFT`, `PAID`, `OVERDUE`
- `amount` (number) - total including tax
- `subTotal` (number) - total excluding tax
- `tax` (number)
- `amountOutstanding` (number)
- `amountPaid` (number)
- `amountWrittenOff` (number)
- `notes` (string)
- `company` (object) - companyId, companyName, companyUrl
- `projects` (array) - projectId, projectName
- `fields` (array) - custom invoice fields
- `attachments` (array) - attachmentId, attachmentName, location, thumbLocation, visibility
- `createdAt` (int64, epoch ms)
- `createdBy` (user object)
- `updatedAt` (int64, epoch ms)
- `updatedBy` (user object)

### includeFields options
`notes`, `attachments`

### Payment Record Fields
- `paymentId` (int64, readonly)
- `paymentRecordType` (string) - `PAID`, `WRITE_OFF`
- `currency` (string)
- `paymentDate` (string, YYYY-MM-DD)
- `amount` (number)
- `notes` (string)

### Line Item Fields
- `invoiceLineItemId` (int64, readonly)
- `description` (string)
- `quantity` (number)
- `unitPrice` (number)
- `amount` (number) - quantity * unitPrice
- `sourceId` (int64) - associated project ID
- `sourceType` (string) - `PROJECT`
- `taxCode` (object) - taxCodeId, taxCodeName, taxCodeRate, taxCodeAmount
- `taxComponents` (array) - taxComponentId, taxComponentName, taxComponentRate, taxComponentAmount, taxComponentType

### Filters (search-invoices)
`dateOfIssue.eq/gt/ge/lt/le`, `dueDate.eq/gt/ge/lt/le`,
`amount.eq/gt/ge/lt/le`, `amountOutstanding.eq/gt/ge/lt/le`,
`amountPaid.eq/gt/ge/lt/le`, `amountWrittenOff.eq/gt/ge/lt/le`,
`createdAt.eq/gt/ge/lt/le`,
`companyId.eq/oneOf/noneOf`,
`invoiceNumber.eq/cn/nc`,
`status.eq/oneOf/noneOf`
sortBy: `createdAt`, `invoiceNumber`

---

## 11. Resource Allocations

### Endpoints
| Method | Path | Operation ID | Description |
|--------|------|-------------|-------------|
| GET | `/resource-allocations` | `get-all-resource-allocations` | List/search all resource allocations |

### Resource Allocation Object Fields
- `startDate` (string, YYYY-MM-DD, readonly)
- `endDate` (string, YYYY-MM-DD, readonly)
- `secondsPerDay` (int32, readonly)
- `minutesPerDay` (int32, readonly)
- `hoursPerDay` (int32, readonly)
- `duration` (object, readonly)
  - `daysConsidered` (int32) - weekdays between startDate and endDate
  - `seconds` (int32) - total seconds for full period
  - `minutes` (int32) - total minutes for full period
  - `hours` (int32) - total hours for full period
- `allocationType` (string) - `SOFT`, `HARD` (default: HARD)
- `allocationFor` (string) - `TEAM_MEMBER`, `PLACEHOLDER`
- `project` (object) - projectId, projectName
- `tasks` (array) - taskId, taskName
- `member` (object) - userId, emailId, firstName, lastName, role
- `placeholder` (object) - placeholderId, placeholderName, role
- `createdAt` (int64, epoch ms)
- `createdBy` (user object)
- `updatedAt` (int64, epoch ms)
- `updatedBy` (user object)

### Required Parameters
- `startDate` (required) - filter allocations starting on or after this date
- `endDate` (required) - filter allocations ending on or before this date

### includeFields options
`member`, `task`, `placeholder`, `duration`

### Filters
`memberId.eq/oneOf/noneOf`,
`projectId.eq/oneOf/noneOf`,
`placeholderId.eq/oneOf/noneOf`
sortBy: `startDate`, `endDate`, `allocationType`, `allocationFor`

---

## Common Object Schemas

### User Object
```json
{
  "userId": 201,
  "emailId": "john.doe@rocketlane.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Role Object
```json
{
  "roleId": 101,
  "roleName": "Designer"
}
```

### Custom Field Object (Response)
```json
{
  "fieldId": 201,
  "fieldLabel": "MRR",
  "fieldValue": 1000,
  "fieldValueLabel": "1000"
}
```

### Pagination Object
```json
{
  "pageSize": 100,
  "hasMore": true,
  "totalRecordCount": 10398,
  "nextPage": "https://api.rocketlane.com/api/1.0/...",
  "nextPageToken": "e4a3dd8e-e338-11ed-b5ea-0242ac120002"
}
```
