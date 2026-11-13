const pool = require('../db/database');

// SQL aliases give the API the same camelCase names used by the forms.
const selectRequests = `SELECT id, student_number AS studentNumber,
  student_name AS studentName, email, document_type AS documentType,
  reason, status, date_requested AS dateRequested FROM document_requests`;

// Staff see all records; students supply their student number to filter.
async function getRequests(req, res, next) {
  try {
    let sql = selectRequests;
    const parameters = [];
    if (req.query.studentNumber !== undefined) {
      const studentNumber = req.query.studentNumber;
      if (typeof studentNumber !== 'string' || !studentNumber.trim() || studentNumber.trim().length > 50) {
        return res.status(400).json({ error: 'Student number must be text between 1 and 50 characters' });
      }
      sql += ' WHERE LOWER(student_number) = LOWER(?)';
      parameters.push(studentNumber.trim());
    }
    sql += ' ORDER BY date_requested DESC, id DESC';
    const [rows] = await pool.execute(sql, parameters);
    res.json({ requests: rows });
  } catch (error) {
    next(error);
  }
}

module.exports = getRequests;
