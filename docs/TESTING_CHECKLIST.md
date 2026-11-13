# Testing Checklist

Use fictional details. Record actual results during your Postman and live-demo rehearsal.

## Setup and API

- [ ] npm install succeeds; npm start prints the server URL.
- [ ] MySQL connects and schema.sql imports.
- [ ] A fresh database has zero requests; the Registrar shows No document requests available.
- [ ] Valid POST returns 201 with an ID and Pending.
- [ ] Missing student number, invalid email/document and blank reason return 400.
- [ ] A student-supplied status is rejected.
- [ ] GET all returns 200 and a requests array.
- [ ] Student search finds only matching records, including lowercase searches.
- [ ] An unknown student returns an empty array.
- [ ] Empty student tracking shows No requests found.
- [ ] Valid PATCH returns 200 and the saved status.
- [ ] Invalid status returns 400; an unknown positive ID returns 404.
- [ ] Errors contain useful JSON without passwords or stack traces.

## Frontend and database

- [ ] Both pages load through Express with no JavaScript console errors.
- [ ] Student submission shows success or a useful error.
- [ ] Tracking shows saved document, reason, ID, date and status.
- [ ] Registrar refresh loads new requests and status updates work.
- [ ] Statuses remain plain gold/blue/green/red words with no filled labels.
- [ ] Forms fit a narrow screen; the Registrar table scrolls sideways.
- [ ] SELECT confirms submitted rows and status changes in MySQL.
- [ ] Refreshing the page or restarting Express preserves the data.

## Postman and presentation

- [ ] Collection imports and baseUrl matches the running server.
- [ ] Run all eight requests in order; expected valid/invalid tests pass.
- [ ] MySQL, Express, both pages and Postman are ready.
- [ ] A fictional student number and request reason are prepared.
- [ ] All members know the presentation order and their short explanation.
- [ ] Show only real GitHub commits, branches and pull requests.
