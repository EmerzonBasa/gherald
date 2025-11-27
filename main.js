// CRL Filing System - Main JavaScript Functions

// Initialize tooltips and animations
document.addEventListener('DOMContentLoaded', function() {
    const selectAllCheckbox = document.getElementById('select_all');

    selectAllCheckbox.addEventListener('change', function() {   
        document.querySelectorAll('.doc-checkbox').forEach(cb => {
            cb.checked = selectAllCheckbox.checked;
        });
    });
    checkboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            if (!cb.checked && selectAll.checked) {
                selectAll.checked = false;
            }
            // If all are checked, set selectAll to true
            else if ([...checkboxes].every(c => c.checked)) {
                selectAll.checked = true;
              }
             });
        });
    });

    // =======================
// REPORTS FILTER HANDLER
// =======================
const companyFilter = document.getElementById("companyFilter");
const reportTable = document.getElementById("reportTable");

if (companyFilter && reportTable) {
    companyFilter.addEventListener("change", function () {
        const selected = this.value.toLowerCase();
        const rows = reportTable.querySelectorAll("tbody tr");

        rows.forEach(row => {
            const company = row.querySelector("td:nth-child(4)").textContent.trim().toLowerCase();
            row.style.display = (selected === "" || company === selected) ? "" : "none";
        });
    });
}

    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    // Auto-hide alerts after 5 seconds
    setTimeout(() => {
        const alerts = document.querySelectorAll('.alert');
        alerts.forEach(alert => {
            alert.style.transition = 'opacity 0.5s ease';
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 500);
        });
    }, 5000);

    // Edit button click
    document.querySelectorAll('.btn-icon.edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const user = {
                userId: this.dataset.userId,
                fullName: this.dataset.fullName,
                role: this.dataset.role,
                canView: this.dataset.canView === 'True' || this.dataset.canView === 'true' ? 1 : 0,
                canEdit: this.dataset.canEdit === 'True' || this.dataset.canEdit === 'true' ? 1 : 0,
                canUpload: this.dataset.canUpload === 'True' || this.dataset.canUpload === 'true' ? 1 : 0,
                canDelete: this.dataset.canDelete === 'True' || this.dataset.canDelete === 'true' ? 1 : 0,
                canPrint: this.dataset.canPrint === 'True' || this.dataset.canPrint === 'true' ? 1 : 0
            };
            editUser(user);
        });
    });

// Add loading state to forms
const forms = document.querySelectorAll('form');
forms.forEach(form => {
    form.addEventListener('submit', function() {
        const submitBtn = this.querySelector('button[type="submit"]');
        if (submitBtn && !submitBtn.disabled) {
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        }
    });
});

// Highlight current page in sidebar
const currentPage = window.location.pathname.split("/").pop();
const menuItems = document.querySelectorAll(".sidebar-menu a");
menuItems.forEach(item => {
    const href = item.getAttribute("href");
    if (href === currentPage) {
        item.classList.add("active");
        const parentLi = item.closest("li.has-submenu");
        if (parentLi) parentLi.classList.add("open");
    } else {
        item.classList.remove("active");
    }
});

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('en-US', options);
}

// Confirm delete action
async function deleteDocument(documentId) {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
        const response = await fetch(`/document/${documentId}/delete`, {
            method: 'POST'
        });

        if (response.ok) {
            showToast('Document deleted successfully', 'success');
            // Remove the row from the table
            const row = document.querySelector(`.btn-delete[data-id='${documentId}']`).closest('tr');
            if (row) row.remove();
        } else {
            showToast('Failed to delete document', 'error');
        }
    } catch (error) {
        console.error(error);
        showToast('Error deleting document', 'error');
    }
}
// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `alert alert-${type}`;
    toast.style.position = 'fixed';
    toast.style.top = '20px';
    toast.style.right = '20px';
    toast.style.zIndex = '9999';
    toast.style.minWidth = '300px';
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        ${message}
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(400px)';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!', 'success');
    }).catch(err => {
        showToast('Failed to copy', 'error');
    });
}

// Print document
function printDocument(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Print</title>');
        printWindow.document.write('<link rel="stylesheet" href="/static/css/style.css">');
        printWindow.document.write('</head><body>');
        printWindow.document.write(element.innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    }
}

// Export table to CSV
function exportReport() {
    const table = document.getElementById('reportTable');
    if (!table) return;

    let csv = [];

    // Get headers
    const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());
    csv.push(headers.join(','));

    // Get only visible rows
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
        if (row.style.display !== 'none') {
            const cells = Array.from(row.querySelectorAll('td')).map(td => {
                let text = td.textContent.trim();
                if (text.includes('"')) text = text.replace(/"/g, '""'); // escape quotes
                if (text.includes(',') || text.includes('"')) text = `"${text}"`; // wrap in quotes
                return text;
            });
            csv.push(cells.join(','));
        }
    });

    // Download CSV
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'CRL_Document_Report_' + new Date().toISOString().split('T')[0] + '.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}

// Validate file upload
function validateFile(file, allowedTypes = ['application/pdf'], maxSize = 50 * 1024 * 1024) {
    if (!allowedTypes.includes(file.type)) {
        showToast(`Invalid file type. Only ${allowedTypes.join(', ')} allowed.`, 'error');
        return false;
    }

    if (file.size > maxSize) {
        showToast(`File too large. Maximum size is ${formatFileSize(maxSize)}.`, 'error');
        return false;
    }

    return true;
}

// Search table rows
function searchTable(inputId, tableId) {
    const input = document.getElementById(inputId);
    const table = document.getElementById(tableId);
    const filter = input.value.toLowerCase();
    const rows = table.querySelectorAll('tbody tr');

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(filter) ? '' : 'none';
    });
}

// Sort table
function sortTable(tableId, columnIndex, ascending = true) {
    const table = document.getElementById(tableId);
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.sort((a, b) => {
        const aText = a.querySelectorAll('td')[columnIndex].textContent.trim();
        const bText = b.querySelectorAll('td')[columnIndex].textContent.trim();

        return ascending
            ? aText.localeCompare(bText, undefined, { numeric: true })
            : bText.localeCompare(aText, undefined, { numeric: true });
    });

    rows.forEach(row => tbody.appendChild(row));
}

// Mobile menu toggle
function toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) sidebar.classList.toggle('active');
}

// Submenu toggle
document.querySelectorAll(".submenu-toggle").forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        const parent = btn.closest("li");
        parent.classList.toggle("open");
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchBar = document.querySelector('.search-bar');
        if (searchBar) searchBar.focus();
    }
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(modal => {
            modal.classList.remove('active');
        });
    }
});

// Auto-resize textarea
function autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}
document.querySelectorAll('textarea').forEach(textarea => {
    textarea.addEventListener('input', function() {
        autoResizeTextarea(this);
    });
});

// Loading overlay
function showLoading(message = 'Loading...') {
    const overlay = document.createElement('div');
    overlay.id = 'loadingOverlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(26, 26, 46, 0.9);
        backdrop-filter: blur(5px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    `;
    overlay.innerHTML = `
        <div style="text-align: center; color: var(--text-primary);">
            <div class="loading" style="width: 60px; height: 60px; border-width: 5px; margin: 0 auto 20px;"></div>
            <h3>${message}</h3>
        </div>
    `;
    document.body.appendChild(overlay);
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.remove();
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

// Apply debounce to search inputs
document.querySelectorAll('.search-bar').forEach(input => {
    input.addEventListener('input', debounce(function() {
        // Trigger search functionality here if needed
    }, 300));
});

// Animate statistics counters
function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = Math.ceil(target);
            clearInterval(timer);
        } else {
            element.textContent = Math.ceil(current);
        }
    }, 16);
}
window.addEventListener('load', function() {
    document.querySelectorAll('.stat-value').forEach(stat => {
        const value = parseInt(stat.textContent);
        if (!isNaN(value)) animateCounter(stat, value);
    });
});

// Corrected editUser function
function editUser(user) {
    document.getElementById('editUserId').value = user.userId;
    document.getElementById('editUserName').textContent = user.fullName;
    document.getElementById('editRole').value = user.role;

    document.getElementById('editCanView').checked = user.canView == 1;
    document.getElementById('editCanEdit').checked = user.canEdit == 1;
    document.getElementById('editCanUpload').checked = user.canUpload == 1;
    document.getElementById('editCanDelete').checked = user.canDelete == 1;
    document.getElementById('editCanPrint').checked = user.canPrint == 1;

    document.getElementById('editUserModal').classList.add('active');
}

// Submit handler for editUserForm
document.getElementById('editUserForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const userId = document.getElementById('editUserId').value;
    const data = {
        role: document.getElementById('editRole').value,
        can_view: document.getElementById('editCanView').checked ? 1 : 0,
        can_edit: document.getElementById('editCanEdit').checked ? 1 : 0,
        can_upload: document.getElementById('editCanUpload').checked ? 1 : 0,
        can_delete: document.getElementById('editCanDelete').checked ? 1 : 0,
        can_print: document.getElementById('editCanPrint').checked ? 1 : 0
    };

    showLoading('Updating permissions...');
    try {
        const response = await fetch(`/settings/users/${userId}/update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        hideLoading();

        if (result.success) {
            showToast(result.message, 'success');
            closeModal('editUserModal');

            // Update table row using data-user-id
            const row = document.querySelector(`.btn-icon.edit[data-user-id='${userId}']`).closest('tr');

            // Update role badge
            const roleCell = row.querySelector('td:nth-child(3) .badge');
            roleCell.textContent = data.role.toUpperCase();
            roleCell.className = `badge badge-${data.role === 'admin' ? 'primary' : data.role === 'manager' ? 'success' : 'info'}`;

            // Update permission badges
            const permCell = row.querySelector('td:nth-child(4)');
            let permHTML = '';
            if (data.can_view) permHTML += '<span class="badge badge-info" style="font-size: 10px;">View</span>';
            if (data.can_edit) permHTML += '<span class="badge badge-warning" style="font-size: 10px;">Edit</span>';
            if (data.can_upload) permHTML += '<span class="badge badge-success" style="font-size: 10px;">Upload</span>';
            if (data.can_delete) permHTML += '<span class="badge badge-primary" style="font-size: 10px;">Delete</span>';
            if (data.can_print) permHTML += '<span class="badge badge-info" style="font-size: 10px;">Print</span>';
            permCell.innerHTML = permHTML;

        } else {
            showToast(result.message || 'Failed to update user permissions.', 'error');
        }
    } catch (error) {
        hideLoading();
        console.error(error);
        showToast('Error updating user permissions.', 'error');
    }
});

function applyFilter() {
    const filterValue = document.getElementById('companyFilter').value.toLowerCase();
    const rows = document.querySelectorAll('#reportTable tbody tr');

    rows.forEach(row => {
        const companyCell = row.cells[3].textContent.toLowerCase();
        row.style.display = companyCell.includes(filterValue) || filterValue === "" ? '' : 'none';
    });
}

// Console info
console.log('%c CRL Filing System ', 'background: linear-gradient(135deg, #e94560, #533483); color: white; padding: 10px; font-size: 20px; font-weight: bold;');
console.log('%c Version 1.0.0 | © 2024 CRL ', 'color: #a3b9cc; font-size: 12px;');
