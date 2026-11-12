const tableBody = document.querySelector('#registrar-requests');
const tableWrapper = document.querySelector('#requests-table-wrapper');
const message = document.querySelector('#registrar-message');
const refreshButton = document.querySelector('#refresh-requests');
const emptyMessage = document.querySelector('#empty-requests');
const statuses = ['Pending', 'Under Review', 'Ready', 'Rejected'];
let requests = [];

function showMessage(text, type) {
  message.textContent = text;
  message.className = `message ${type}`;
  message.hidden = false;
}

async function readResponse(response) {
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'The request could not be completed.');
  return data;
}

function errorText(error) {
  return error instanceof TypeError ? 'Cannot reach the server. Check your connection and try again.' : error.message;
}

function setStatusText(element, status) {
  element.className = `status-text status-${status.toLowerCase().replaceAll(' ', '-')}`;
  element.textContent = status;
}

function addCell(row, value, className = '') {
  const cell = document.createElement('td');
  cell.textContent = value;
  cell.className = className;
  row.append(cell);
  return cell;
}

// Each row gets its own selector and save button. User values use textContent.
function renderRequests() {
  tableBody.replaceChildren();
  for (const request of requests) {
    const row = document.createElement('tr');
    addCell(row, `#${request.id}`);
    addCell(row, request.studentNumber);
    addCell(row, request.studentName);
    addCell(row, request.email);
    addCell(row, request.documentType);
    addCell(row, request.reason, 'reason-cell');
    const statusCell = addCell(row, '');
    const statusText = document.createElement('span');
    setStatusText(statusText, request.status);
    statusCell.append(statusText);
    addCell(row, new Date(request.dateRequested).toLocaleString());
    const controls = document.createElement('div');
    controls.className = 'status-editor';
    const select = document.createElement('select');
    select.setAttribute('aria-label', `Status for request ${request.id}`);
    for (const status of statuses) {
      const option = document.createElement('option');
      option.value = status;
      option.textContent = status;
      option.className = `status-${status.toLowerCase().replaceAll(' ', '-')}`;
      select.append(option);
    }
    select.value = request.status;
    function updateSelectColor() {
      select.className = `status-text status-${select.value.toLowerCase().replaceAll(' ', '-')}`;
    }
    updateSelectColor();
    select.addEventListener('change', updateSelectColor);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'button primary';
    button.textContent = 'Update Status';
    button.setAttribute('aria-label', `Update status for request ${request.id}`);
    button.addEventListener('click', async () => {
      // Prevent a refresh from replacing rows while a save is in progress.
      refreshButton.disabled = true;
      button.disabled = true;
      select.disabled = true;
      button.textContent = 'Saving…';
      try {
        const response = await fetch(`/api/requests/${request.id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: select.value })
        });
        const data = await readResponse(response);
        request.status = data.request.status;
        setStatusText(statusText, request.status);
        showMessage(`Status for request #${request.id} updated successfully.`, 'success');
      } catch (error) {
        select.value = request.status;
        updateSelectColor();
        showMessage(errorText(error), 'error');
      } finally {
        button.disabled = false;
        select.disabled = false;
        button.textContent = 'Update Status';
        refreshButton.disabled = Boolean(tableBody.querySelector('button:disabled'));
      }
    });
    controls.append(select, button);
    addCell(row, '').append(controls);
    tableBody.append(row);
  }
}

async function loadRequests() {
  refreshButton.disabled = true;
  tableWrapper.hidden = true;
  emptyMessage.hidden = true;
  tableWrapper.setAttribute('aria-busy', 'true');
  showMessage('Loading document requests…', 'info');
  try {
    const data = await readResponse(await fetch('/api/requests'));
    requests = data.requests;
    renderRequests();
    tableWrapper.hidden = requests.length === 0;
    emptyMessage.hidden = requests.length !== 0;
    if (requests.length) {
      showMessage(`${requests.length} request(s) loaded.`, 'info');
    } else {
      message.hidden = true;
    }
  } catch (error) {
    showMessage(errorText(error), 'error');
  } finally {
    refreshButton.disabled = false;
    tableWrapper.setAttribute('aria-busy', 'false');
  }
}

refreshButton.addEventListener('click', loadRequests);
loadRequests();
