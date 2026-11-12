const express = require('express');
const createRequest = require('../handlers/createRequest');
const getRequests = require('../handlers/getRequests');
const updateRequestStatus = require('../handlers/updateRequestStatus');
const router = express.Router();

// The router maps URLs to the handlers that do the actual work.
router.post('/', createRequest);
router.get('/', getRequests);
router.patch('/:id/status', updateRequestStatus);

module.exports = router;
