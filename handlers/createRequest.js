const pool = require('../db/database');

const documentTypes = [
  'Academic Transcript',
  'Result Slip',
  'Completion Letter',
  'Academic Verification Letter'
];

// SQL aliases give the API the same camelCase names used by the forms.
const selectRequests = `SELECT id, student_number AS studentNumber,
  student_name AS studentName, email, document_type AS documentType,
  reason, status, date_requested AS dateRequested FROM document_requests`;

// Create a new request. The server alone sets its initial status.
async function createRequest(req, res, next) {
  try {
    const body = req.body;
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return res.status(400).json({ error: 'A JSON object is required' });
    }
    const fields = [
      ['studentNumber', 'Student number', 50],
      ['studentName', 'Student name', 100],
      ['email', 'Email', 254],
      ['documentType', 'Document type', 50],
      ['reason', 'Reason', 2000]
    ];
    const values = {};
    for (const [field, label, maxLength] of fields) {
      if (typeof body[field] !== 'string' || !body[field].trim()) {
        return res.status(400).json({ error: `${label} is required and must be text` });
      }
      values[field] = body[field].trim();
      if (values[field].length > maxLength) {
        return res.status(400).json({ error: `${label} must be ${maxLength} characters or fewer` });
      }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      return res.status(400).json({ error: 'Enter a valid email address' });
    }
    if (!documentTypes.includes(values.documentType)) {
      return res.status(400).json({ error: 'Invalid document type' });
    }
    if (Object.prototype.hasOwnProperty.call(body, 'status')) {
      return res.status(400).json({ error: 'Do not supply status. New requests start as Pending.' });
    }

    // ? placeholders keep submitted data separate from SQL commands.
    const [result] = await pool.execute(
      `INSERT INTO document_requests
       (student_number, student_name, email, document_type, reason, status)
       VALUES (?, ?, ?, ?, ?, 'Pending')`,
      [values.studentNumber, values.studentName, values.email, values.documentType, values.reason]
    );
    const [rows] = await pool.execute(`${selectRequests} WHERE id = ?`, [result.insertId]);
    res.status(201).json({ message: 'Document request submitted successfully', request: rows[0] });
  } catch (error) {
    next(error);
  }
}

module.exports = createRequest;
