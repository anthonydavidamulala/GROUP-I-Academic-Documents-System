const requestForm = document.querySelector('#request-form');
const trackingForm = document.querySelector('#tracking-form');
const requestMessage = document.querySelector('#request-message');
const trackingMessage = document.querySelector('#tracking-message');
const results = document.querySelector('#student-requests');
const trackingNumber = document.querySelector('#tracking-number');

function showMessage(element, message, type) {
  element.textContent = message;
  element.className = `message ${type}`;
  element.hidden = false;
}

async function readResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'The request could not be completed.');
  }
  return data;
}

function errorText(error) {
  return error instanceof TypeError ? 'Cannot reach the server. Check your connection and try again.' : error.message;
}

// textContent displays submitted text safely rather than interpreting it as HTML.
function renderRequests(requests) {
  results.replaceChildren();
  for (const request of requests) {
    const card = document.createElement('article');
    card.className = 'request-result';
    const heading = document.createElement('div');
    heading.className = 'result-heading';
    const title = document.createElement('h3');
    title.textContent = `Request #${request.id}`;
    const statusText = document.createElement('span');
    statusText.className = `status-text status-${request.status.toLowerCase().replaceAll(' ', '-')}`;
    statusText.textContent = request.status;
    heading.append(title, statusText);
    const details = document.createElement('dl');
    const fields = [
      ['Document Type', request.documentType],
      ['Reason', request.reason],
      ['Date Requested', new Date(request.dateRequested).toLocaleString()]
    ];
    for (const [label, value] of fields) {
      const term = document.createElement('dt');
      term.textContent = label;
      const description = document.createElement('dd');
      description.textContent = value;
      details.append(term, description);
    }
    card.append(heading, details);
    results.append(card);
  }
}

async function loadRequests(studentNumber) {
  const button = document.querySelector('#check-requests');
  button.disabled = true;
  results.setAttribute('aria-busy', 'true');
  results.replaceChildren();
  showMessage(trackingMessage, 'Checking your requests…', 'info');
  try {
    const response = await fetch(`/api/requests?studentNumber=${encodeURIComponent(studentNumber)}`);
    const data = await readResponse(response);
    renderRequests(data.requests);
    showMessage(trackingMessage, data.requests.length ? `${data.requests.length} request(s) found for ${studentNumber}.` : 'No requests found.', 'info');
  } catch (error) {
    showMessage(trackingMessage, errorText(error), 'error');
  } finally {
    button.disabled = false;
    results.setAttribute('aria-busy', 'false');
  }
}

// Send the form to Express as JSON. Do not send a status from the student page.
requestForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = document.querySelector('#submit-request');
  const request = {
    studentNumber: requestForm.elements.studentNumber.value.trim(),
    studentName: requestForm.elements.studentName.value.trim(),
    email: requestForm.elements.email.value.trim(),
    documentType: requestForm.elements.documentType.value,
    reason: requestForm.elements.reason.value.trim()
  };
  button.disabled = true;
  button.textContent = 'Submitting…';
  requestMessage.hidden = true;
  try {
    const response = await fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });
    const data = await readResponse(response);
    showMessage(requestMessage, `${data.message}. Your request ID is #${data.request.id}.`, 'success');
    requestForm.reset();
    trackingNumber.value = request.studentNumber;
    await loadRequests(request.studentNumber);
  } catch (error) {
    showMessage(requestMessage, errorText(error), 'error');
  } finally {
    button.disabled = false;
    button.textContent = 'Submit Request →';
  }
});

trackingForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const studentNumber = trackingNumber.value.trim();
  if (!studentNumber) {
    results.replaceChildren();
    showMessage(trackingMessage, 'Enter your student number.', 'error');
    return;
  }
  await loadRequests(studentNumber);
});
