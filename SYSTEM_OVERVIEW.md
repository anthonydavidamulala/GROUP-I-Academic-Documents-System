# System Overview

Students submit academic document requests. Registrar staff update the saved status, and students search their student number to see progress.

```text
Student / Registrar
        ↓
HTML + CSS
        ↓
JavaScript fetch()
        ↓
Express API
        ↓
MySQL
```

MySQL returns rows to Express, Express sends JSON, and JavaScript displays the result.

| Term | Meaning in this project |
| --- | --- |
| Frontend | The two public HTML pages, styles and browser JavaScript |
| fetch() | Sends requests from the browser to our Express server |
| API / endpoint | The agreed methods and URLs, such as POST /api/requests |
| Express | Receives requests, serves public files and runs handlers |
| Backend | server.js, routes, handlers, database connection and error handler |
| GET | Reads all requests or filters by studentNumber |
| POST | Validates input and creates a Pending request |
| PATCH | Updates one request's allowed status using its ID |
| MySQL | Stores records in document_requests after pages/server restart |
| Postman | Tests successful and invalid API requests without the frontend |
| JSON | The data format used for request bodies and responses |
| HTTP status | 200 success, 201 created, 400 invalid, 404 absent, 500 server/database failure |

The router maps URLs to the three handlers. req.body contains submitted JSON, req.query.studentNumber contains the search filter, and req.params.id contains the update ID. res.json sends the response.

The handlers trim and validate input and use SQL placeholders so submitted values stay separate from SQL commands. SELECT aliases map student_number to studentNumber and date_requested to dateRequested. The shared pool reads connection settings from .env; only .env.example is distributed.

Four documents are supported: Academic Transcript, Result Slip, Completion Letter and Academic Verification Letter. Statuses are Pending, Under Review, Ready and Rejected. POST always starts at Pending; PATCH accepts any of those four. The interface shows plain coloured status text. No authentication is included in this class prototype.

A new database contains zero requests. The schema and server do not seed data. Only a submitted student form or a manually sent API POST creates a row. Postman bodies are examples for manual testing.
