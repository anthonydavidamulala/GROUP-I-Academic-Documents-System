# Academic Document Request and Tracking System

## Group I

Mbarara University of Science and Technology (MUST).

## Short Description

A class prototype for requesting academic documents and checking their progress. Students submit requests; Academic Registrar staff update their statuses. The MUST-inspired design is not an official university service.

## Main Users

Student and Academic Registrar Staff.

## Main Features

- Request an Academic Transcript, Result Slip, Completion Letter or Academic Verification Letter.
- Create each request as Pending and track it by student number.
- View all requests and set Pending, Under Review, Ready or Rejected.
- Validate input, save records in MySQL and display useful responses.
- Show statuses as plain gold, blue, green or red words.

## Technologies Used

HTML, CSS, vanilla JavaScript, fetch(), Node.js, Express, MySQL, mysql2, dotenv and Postman.

## Project Structure

```text
server.js                 Express setup
package.json              Dependencies and start command
.env.example              Database setting names
public/                   Two pages, styles and browser JavaScript
db/database.js            MySQL connection pool
routes/requests.js        Endpoint mappings
handlers/                 Create, read and update logic
middleware/errorHandler.js
database/schema.sql       Empty database schema
postman/                  Importable API collection
docs/                     Overview, presentation, GitHub plan and checklist
```

## Requirements

Node.js 20 or later, MySQL Server 8.0 or later, Postman, a browser and Git/GitHub. MySQL Workbench is optional; it still needs a running MySQL Server.

## Installation

1. Extract or clone the project and open a terminal in its folder.
2. Install/start MySQL Server. In its command-line client, run:

```sql
SOURCE database/schema.sql;
```

Run this from the project folder, or open/execute schema.sql in Workbench. A new installation starts with zero requests. Re-importing schema.sql preserves existing requests; it does not clear them.

3. Copy `.env.example` to `.env` (`Copy-Item .env.example .env` in PowerShell; `cp .env.example .env` on macOS/Linux).
4. Enter your own MySQL connection settings. Never commit or share the actual `.env`.

```dotenv
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=academic_document_system
PORT=3000
```

## How to Run

After configuring .env and importing the schema:

```text
npm install
npm start
```

Keep the terminal open. Stop Express with Ctrl+C. Restart it after changing .env. If PowerShell blocks npm.ps1, use npm.cmd. A database failure message means you should check MySQL, the imported schema and .env settings.

## Pages

- Student: [http://localhost:3000](http://localhost:3000)
- Registrar: [http://localhost:3000/registrar.html](http://localhost:3000/registrar.html)

Open the pages through Express rather than opening HTML files directly.

## API Endpoints

| Operation | Purpose | Success |
| --- | --- | --- |
| POST /api/requests | Create from studentNumber, studentName, email, documentType and reason; server sets Pending | 201 |
| GET /api/requests | List all requests | 200 |
| GET /api/requests?studentNumber=2025%2FBSE%2F001 | Filter by student number, ignoring letter case | 200 |
| PATCH /api/requests/:id/status | Update using JSON such as { "status": "Ready" } | 200 |

The student-number URL is an example only, not a preloaded request.

Send JSON bodies with Content-Type: application/json. POST/PATCH return a message and request object; GET returns a requests array. Errors use an error field: 400 for invalid data, 404 for an absent record/route and 500 for unexpected failures. Do not send status in POST.

## Postman

Import [the collection](postman/Group-I-Academic-Document-API.postman_collection.json). Keep baseUrl as http://localhost:3000. Its sample JSON bodies are testing examples only; they create records only when you manually send a POST. Nothing is seeded at startup or by the schema. Run the eight requests in order: the first valid POST saves requestId for PATCH. Inspect responses and Test Results. Expected codes are 201, 400, 400, 200, 200, 200, 400 and 404.

## Group Responsibilities

| Member | Responsibility |
| --- | --- |
| Amulala David Anthony | Team coordination, Express setup and final integration |
| Mutalya Janice Nandobya | Student request page HTML |
| Beinomugasho Vmilia Esther | Registrar dashboard HTML |
| Mubiru Elton Felix | Frontend JavaScript and fetch communication |
| Kayabula Oldrine Allan | MySQL database and connection |
| Kasande Oliver | CSS and interface styling |
| Tusiime Daniella | README and project documentation |
| Wasswa Victor Ssali | GET endpoints and student search |
| Masanga Jesse Wanda | POST API and input validation |
| Ofamba James | Error handling, system testing and demo preparation |
| Ngono Martin | Postman collection and API testing |
| Mpiima Rodney Ezra | PATCH request-status endpoint |

Use the [presentation guide](docs/PRESENTATION_GUIDE.md), [GitHub plan](docs/GITHUB_CONTRIBUTION_PLAN.md), [checklist](docs/TESTING_CHECKLIST.md) and [overview](docs/SYSTEM_OVERVIEW.md). The separate Group-I-Member-Contribution-Packs.zip is for private study, not the source repository. README-CONTRIBUTION.md is study material and must not be pushed. Open the current source in your clone, make a genuine improvement, test it, and commit only the project files you changed. Do not overwrite newer source with packaged copies. Every member must create their own real commit and pull request; packages do not prove authorship.

## Limitations

No login or access control: anyone with access can view/update requests. Use fictional data locally. The prototype tracks requests; it does not generate documents, accept payments or send notifications.
