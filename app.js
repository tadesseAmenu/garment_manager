// ============================================
// Garment Worker Management System
// Version 3.2.4 - OPTIMIZED & FIXED
// ============================================

// Application State
const AppState = {
    employees: [],
    nextId: 1,
    currentSection: 'form',
    currentPage: { weekly: 1, monthly: 1 },
    itemsPerPage: 10,
    sortConfig: { weekly: { key: 'date', direction: 'desc' }, monthly: { key: 'date', direction: 'desc' } },
    isDarkMode: false,
    editingId: null,
    dailyEntries: {},
    selectedDate: null,
    editingDailyId: null,
    lastSaveTime: null
};

let DOM = {};
let dailyInputChanges = new Map();
let lastFocusedElement = null;
let confirmationCallback = null;
let confirmationElement = null;

// ============================================
// Core Initialization
// ============================================

function init() {
    console.log('Initializing Garment Management System v3.2.4');
    initDOM();
    initTheme();
    setupNavigation();
    setupEventListeners();
    loadData();
    updateForm();
    initDailyEntry();
    createSaveIndicator();
    createModals();
    
    const hash = window.location.hash.substring(1);
    if (hash && ['form', 'daily', 'weekly', 'monthly', 'export', 'settings'].includes(hash)) {
        setTimeout(() => showSection(hash), 100);
    } else {
        showSection('form');
    }
    
    setTimeout(() => {
        showToast('Garment Management System v3.2.4 loaded', 'success', 3000);
    }, 1000);
}

// ============================================
// DOM Initialization
// ============================================

function initDOM() {
    const get = id => document.getElementById(id);
    DOM = {
        // Theme
        mobileThemeToggle: get('mobileThemeToggle'),
        navThemeToggle: get('navThemeToggle'),
        desktopThemeToggle: get('desktopThemeToggle'),
        
        // Mobile
        menuToggle: get('menuToggle'),
        mobileNav: get('mobileNav'),
        closeNav: get('closeNav'),
        mobileTotal: get('mobileTotal'),
        
        // Form
        employeeForm: get('employeeForm'),
        clearForm: get('clearForm'),
        cancelEdit: get('cancelEdit'),
        employeeName: get('employeeName'),
        employeeType: document.querySelectorAll('input[name="employeeType"]'),
        dailyClothes: get('dailyClothes'),
        workDate: get('workDate'),
        startTime: get('startTime'),
        breakTime: get('breakTime'),
        endTime: get('endTime'),
        notes: get('notes'),
        submitForm: get('submitForm'),
        updateForm: get('updateForm'),
        editId: get('editId'),
        
        // Daily
        dailyDate: get('dailyDate'),
        todayDate: get('todayDate'),
        totalEmployees: get('totalEmployees'),
        dailyActive: get('dailyActive'),
        dailyGarments: get('dailyGarments'),
        dailyHours: get('dailyHours'),
        dailyAvg: get('dailyAvg'),
        addAllToday: get('addAllToday'),
        saveDailyEntries: get('saveDailyEntries'),
        dailyTableBody: get('dailyTableBody'),
        dailyEmpty: get('dailyEmpty'),
        dailyExportButton: get('dailyExportButton'),
        dailyExportMenu: get('dailyExportMenu'),
        
        // Tables
        weeklyTableBody: get('weeklyTableBody'),
        monthlyTableBody: get('monthlyTableBody'),
        weeklyEmpty: get('weeklyEmpty'),
        monthlyEmpty: get('monthlyEmpty'),
        
        // Stats
        weeklyCount: get('weeklyCount'),
        weeklyGarments: get('weeklyGarments'),
        weeklyHours: get('weeklyHours'),
        weeklyAvg: get('weeklyAvg'),
        monthlyCount: get('monthlyCount'),
        monthlyGarments: get('monthlyGarments'),
        monthlyHours: get('monthlyHours'),
        monthlyAvg: get('monthlyAvg'),
        desktopTotal: get('desktopTotal'),
        desktopGarments: get('desktopGarments'),
        desktopHours: get('desktopHours'),
        desktopEfficiency: get('desktopEfficiency'),
        footerTotal: get('footerTotal'),
        footerGarments: get('footerGarments'),
        footerEfficiency: get('footerEfficiency'),
        
        // Preview
        previewWeekly: get('previewWeekly'),
        previewWeeklyGarments: get('previewWeeklyGarments'),
        previewMonthly: get('previewMonthly'),
        previewMonthlyGarments: get('previewMonthlyGarments'),
        previewToday: get('previewToday'),
        previewTodayGarments: get('previewTodayGarments'),
        previewTotal: get('previewTotal'),
        previewHours: get('previewHours'),
        
        // Settings
        settingsTotal: get('settingsTotal'),
        settingsStorage: get('settingsStorage'),
        settingsBackup: get('settingsBackup'),
        settingsWeekly: get('settingsWeekly'),
        settingsMonthly: get('settingsMonthly'),
        
        // Pagination
        prevWeekly: get('prevWeekly'),
        nextWeekly: get('nextWeekly'),
        prevMonthly: get('prevMonthly'),
        nextMonthly: get('nextMonthly'),
        weeklyShowing: get('weeklyShowing'),
        weeklyTotal: get('weeklyTotal'),
        monthlyShowing: get('monthlyShowing'),
        monthlyTotal: get('monthlyTotal'),
        weeklyPageInfo: document.querySelector('#weekly .page-info'),
        monthlyPageInfo: document.querySelector('#monthly .page-info'),
        
        // Time calculation
        totalHours: get('totalHours'),
        netHours: get('netHours'),
        breakDuration: get('breakDuration'),
        
        // Navigation
        desktopNavLinks: document.querySelectorAll('.desktop-nav-link')
    };
}

// ============================================
// Theme Management
// ============================================

function initTheme() {
    const savedTheme = localStorage.getItem('garmentTheme');
    AppState.isDarkMode = savedTheme === 'dark';
    
    document.body.classList.toggle('dark-theme', AppState.isDarkMode);
    document.body.classList.toggle('light-theme', !AppState.isDarkMode);
    updateThemeButtons();
}

function toggleTheme() {
    AppState.isDarkMode = !AppState.isDarkMode;
    
    document.body.classList.toggle('dark-theme', AppState.isDarkMode);
    document.body.classList.toggle('light-theme', !AppState.isDarkMode);
    
    localStorage.setItem('garmentTheme', AppState.isDarkMode ? 'dark' : 'light');
    updateThemeButtons();
}

function updateThemeButtons() {
    const themeButtons = [DOM.mobileThemeToggle, DOM.navThemeToggle, DOM.desktopThemeToggle];
    themeButtons.forEach(button => {
        if (button) {
            const icon = button.querySelector('i');
            const label = button.querySelector('.theme-label');
            if (icon) icon.className = AppState.isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
            if (label) label.textContent = AppState.isDarkMode ? 'Light Mode' : 'Dark Mode';
        }
    });
}

// ============================================
// Utility Functions
// ============================================

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatDateTime(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatTime(timeString) {
    if (!timeString) return 'N/A';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

function calculateTimeDifference(start, end) {
    if (!start || !end) return 0;
    const startTime = new Date(`2000-01-01T${start}`);
    let endTime = new Date(`2000-01-01T${end}`);
    if (endTime < startTime) endTime.setDate(endTime.getDate() + 1);
    return (endTime - startTime) / (1000 * 60 * 60);
}

function calculateNetHours(startTime, breakTime, endTime) {
    if (!startTime || !endTime) return 0;
    const totalHours = calculateTimeDifference(startTime, endTime);
    if (breakTime) {
        const breakDuration = calculateActualBreakDuration(startTime, breakTime, endTime);
        return Math.max(0, totalHours - breakDuration);
    }
    return totalHours;
}

function calculateActualBreakDuration(startTime, breakTime, endTime) {
    if (!breakTime || !startTime || !endTime) return 0;
    const [breakHour, breakMinute] = breakTime.split(':').map(Number);
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const breakInMinutes = breakHour * 60 + breakMinute;
    const startInMinutes = startHour * 60 + startMinute;
    const endInMinutes = endHour * 60 + endMinute;
    
    if (breakInMinutes >= startInMinutes && breakInMinutes <= endInMinutes) {
        const breakEndInMinutes = breakInMinutes + 60;
        if (breakEndInMinutes > endInMinutes) {
            return (endInMinutes - breakInMinutes) / 60;
        }
        return 1.0;
    }
    return 0;
}

function formatHours(hours) {
    return parseFloat(hours).toFixed(2);
}

// ============================================
// Toast System
// ============================================

function showToast(message, type = 'success', duration = 5000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const icons = { success: 'check-circle', error: 'exclamation-circle', warning: 'exclamation-triangle', info: 'info-circle', save: 'save' };
    const titles = { success: 'Success', error: 'Error', warning: 'Warning', info: 'Information', save: 'Saved' };
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${icons[type] || 'info-circle'} toast-icon"></i>
        <div class="toast-content">
            <h4>${titles[type] || 'Information'}</h4>
            <p>${message}</p>
            ${type === 'save' ? '<small class="text-muted">Just now</small>' : ''}
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()" aria-label="Close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(toast);
    toast.offsetHeight;
    setTimeout(() => toast.classList.add('show'), 10);
    
    const removeTimer = setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
    
    toast.addEventListener('mouseenter', () => clearTimeout(removeTimer));
    toast.addEventListener('mouseleave', () => {
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    });
}

// ============================================
// Form Validation
// ============================================

function validateForm(formData) {
    const errors = [];
    
    if (!formData.name.trim()) errors.push('Employee name is required');
    else if (formData.name.trim().length < 2) errors.push('Name must be at least 2 characters');
    
    if (!formData.type) errors.push('Employee type is required');
    if (!formData.clothes || formData.clothes < 0) errors.push('Valid number of garments is required');
    if (!formData.date) errors.push('Work date is required');
    else if (new Date(formData.date) > new Date()) errors.push('Date cannot be in the future');
    
    if (!formData.startTime) errors.push('Start time is required');
    if (!formData.breakTime) errors.push('Break time is required');
    if (!formData.endTime) errors.push('End time is required');
    
    if (formData.endTime <= formData.startTime) errors.push('End time must be after start time');
    if (formData.breakTime <= formData.startTime) errors.push('Break time must be after start time');
    if (formData.endTime <= formData.breakTime) errors.push('Break time must be before end time');
    
    if (formData.name && formData.date && formData.type && !DOM.editId.value) {
        const isDuplicate = AppState.employees.some(emp => 
            emp.name.toLowerCase() === formData.name.toLowerCase().trim() &&
            emp.date === formData.date &&
            emp.type === formData.type
        );
        if (isDuplicate) {
            errors.push(`Employee "${formData.name}" already has a ${formData.type} entry for ${formatDate(formData.date)}`);
        }
    }
    
    return errors;
}

// ============================================
// Data Management
// ============================================

function loadData() {
    try {
        const saved = localStorage.getItem('garmentEmployees');
        if (saved) {
            const data = JSON.parse(saved);
            AppState.employees = data.employees || [];
            AppState.nextId = data.nextId || 1;
            AppState.dailyEntries = data.dailyEntries || {};
            AppState.lastSaveTime = data.lastSaved || null;
            
            if (DOM.settingsBackup && data.lastSaved) {
                DOM.settingsBackup.textContent = formatDateTime(data.lastSaved);
            }
        }
        updateUI();
        updateStats();
        updateStorageInfo();
        showToast('Data loaded successfully', 'success', 2000);
    } catch (error) {
        console.error('Error loading data:', error);
        showToast(`Error loading saved data: ${error.message}`, 'error');
        AppState.employees = [];
        AppState.dailyEntries = {};
        AppState.nextId = 1;
    }
}

function saveData() {
    const data = {
        employees: AppState.employees,
        nextId: AppState.nextId,
        dailyEntries: AppState.dailyEntries,
        lastSaved: new Date().toISOString()
    };
    
    try {
        localStorage.setItem('garmentEmployees', JSON.stringify(data));
        AppState.lastSaveTime = new Date();
        updateStorageInfo();
        
        if (!this.lastSaveToast || (new Date() - this.lastSaveToast) > 30000) {
            showToast('Data saved', 'save', 2000);
            this.lastSaveToast = new Date();
        }
        return true;
    } catch (error) {
        console.error('Error saving data:', error);
        showToast(error.name === 'QuotaExceededError' 
            ? 'Storage is full. Please export and clear some data.' 
            : `Error saving data: ${error.message}`, 'error');
        return false;
    }
}

function addEmployee(formData) {
    const employee = {
        id: generateId(),
        name: formData.name.trim(),
        type: formData.type,
        clothes: parseInt(formData.clothes) || 0,
        date: formData.date,
        startTime: formData.startTime,
        breakTime: formData.breakTime,
        endTime: formData.endTime,
        notes: formData.notes || '',
        createdAt: new Date().toISOString(),
        totalHours: calculateTimeDifference(formData.startTime, formData.endTime),
        netHours: calculateNetHours(formData.startTime, formData.breakTime, formData.endTime),
        breakDuration: calculateActualBreakDuration(formData.startTime, formData.breakTime, formData.endTime)
    };
    
    AppState.employees.unshift(employee);
    if (saveData()) {
        updateUI();
        updateStats();
        showToast(`Employee "${employee.name}" added`, 'success');
        return true;
    }
    return false;
}

function updateEmployee(id, formData) {
    const index = AppState.employees.findIndex(emp => emp.id === id);
    if (index === -1) return false;
    
    const isDuplicate = AppState.employees.some((emp, idx) => 
        idx !== index &&
        emp.name.toLowerCase() === formData.name.toLowerCase().trim() &&
        emp.date === formData.date &&
        emp.type === formData.type
    );
    
    if (isDuplicate) {
        showToast(`Employee "${formData.name}" already has a ${formData.type} entry for ${formatDate(formData.date)}`, 'error');
        return false;
    }
    
    const oldEmployee = AppState.employees[index];
    const updatedEmployee = {
        ...oldEmployee,
        name: formData.name.trim(),
        type: formData.type,
        clothes: parseInt(formData.clothes) || 0,
        date: formData.date,
        startTime: formData.startTime,
        breakTime: formData.breakTime,
        endTime: formData.endTime,
        notes: formData.notes || '',
        totalHours: calculateTimeDifference(formData.startTime, formData.endTime),
        netHours: calculateNetHours(formData.startTime, formData.breakTime, formData.endTime),
        breakDuration: calculateActualBreakDuration(formData.startTime, formData.breakTime, formData.endTime),
        updatedAt: new Date().toISOString()
    };
    
    AppState.employees[index] = updatedEmployee;
    if (saveData()) {
        updateUI();
        updateStats();
        showToast(`Employee "${updatedEmployee.name}" updated`, 'success');
        cancelEditMode();
        return true;
    }
    return false;
}

function deleteEmployee(id, event) {
    const employee = AppState.employees.find(emp => emp.id === id);
    if (!employee) return false;
    
    showConfirmation(
        `Delete Employee "${employee.name}"?`,
        `This will permanently delete the record for ${employee.name} from ${formatDate(employee.date)}.\n\nThis action cannot be undone.`,
        () => {
            const index = AppState.employees.findIndex(emp => emp.id === id);
            if (index !== -1) {
                AppState.employees.splice(index, 1);
                if (saveData()) {
                    updateUI();
                    updateStats();
                    showToast(`Employee "${employee.name}" deleted`, 'success');
                }
            }
        },
        event?.currentTarget
    );
}

function clearAllData(event) {
    if (AppState.employees.length === 0 && Object.keys(AppState.dailyEntries).length === 0) {
        showToast('No data to clear', 'warning');
        return;
    }
    
    const employeeCount = AppState.employees.length;
    const dailyCount = Object.keys(AppState.dailyEntries).length;
    let details = '';
    if (employeeCount > 0) details += `• ${employeeCount} employee records\n`;
    if (dailyCount > 0) details += `• ${dailyCount} days of daily entries\n`;
    details += `\nThis action cannot be undone.`;
    
    showConfirmation('Clear All Data?', details, () => {
        AppState.employees = [];
        AppState.dailyEntries = {};
        AppState.nextId = 1;
        if (saveData()) {
            updateUI();
            updateStats();
            showToast('All data cleared', 'success');
        }
    }, event?.currentTarget);
}

function importData(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (!data || !data.employees || !Array.isArray(data.employees)) {
                throw new Error('Invalid file format');
            }
            
            if (confirm(`Import ${data.employees.length} employee records?\nThis will replace all current data.`)) {
                AppState.employees = data.employees;
                AppState.nextId = data.nextId || 1;
                AppState.dailyEntries = data.dailyEntries || {};
                if (saveData()) {
                    updateUI();
                    updateStats();
                    showToast(`Imported ${data.employees.length} records`, 'success');
                }
            }
        } catch (error) {
            showToast(`Error importing data: ${error.message}`, 'error');
        }
    };
    reader.onerror = () => showToast('Error reading file', 'error');
    reader.readAsText(file);
}

function updateStorageInfo() {
    try {
        const data = localStorage.getItem('garmentEmployees');
        const size = data ? (data.length / 1024).toFixed(2) : '0';
        if (DOM.settingsStorage) DOM.settingsStorage.textContent = `${size} KB`;
        
        const lastBackup = localStorage.getItem('lastBackup');
        if (lastBackup && DOM.settingsBackup) {
            DOM.settingsBackup.textContent = formatDateTime(lastBackup);
        }
    } catch (error) {
        console.error('Storage info error:', error);
    }
}

// ============================================
// Edit Functionality
// ============================================

function editEmployee(id) {
    const employee = AppState.employees.find(emp => emp.id === id);
    if (!employee) return;
    
    DOM.editId.value = employee.id;
    DOM.employeeName.value = employee.name;
    DOM.dailyClothes.value = employee.clothes;
    DOM.workDate.value = employee.date;
    DOM.startTime.value = employee.startTime;
    DOM.breakTime.value = employee.breakTime;
    DOM.endTime.value = employee.endTime;
    DOM.notes.value = employee.notes || '';
    
    document.querySelectorAll('input[name="employeeType"]').forEach(radio => {
        radio.checked = radio.value === employee.type;
    });
    
    DOM.submitForm.style.display = 'none';
    DOM.updateForm.style.display = 'block';
    DOM.cancelEdit.style.display = 'inline-flex';
    
    showSection('form');
    updateTimeSummary();
    showToast(`Editing ${employee.name}`, 'info');
}

function cancelEditMode() {
    DOM.editId.value = '';
    DOM.submitForm.style.display = 'block';
    DOM.updateForm.style.display = 'none';
    DOM.cancelEdit.style.display = 'none';
    
    if (DOM.employeeForm) DOM.employeeForm.reset();
    document.querySelectorAll('input[name="employeeType"]').forEach(radio => radio.checked = false);
    
    updateForm();
    showToast('Edit cancelled', 'info');
}

// ============================================
// Daily Entry System
// ============================================

function initDailyEntry() {
    const today = new Date().toISOString().split('T')[0];
    
    if (DOM.todayDate) DOM.todayDate.textContent = formatDate(today);
    if (DOM.dailyDate) {
        // Set the value but don't show it immediately
        DOM.dailyDate.value = today;
        DOM.dailyDate.max = today;
        DOM.dailyDate.addEventListener('change', handleDailyDateChange);
        DOM.dailyDate.addEventListener('focus', handleDateInputFocus);
        DOM.dailyDate.addEventListener('blur', handleDateInputBlur);
        
        // Initialize placeholder
        setTimeout(() => {
            updateDatePlaceholder();
        }, 100);
    }
    AppState.selectedDate = today;
    
    if (!AppState.dailyEntries[today]) AppState.dailyEntries[today] = {};
    loadDailyEntries();
}
function handleDateInputFocus() {
    if (this.value) {
        // Hide placeholder when focused with value
        document.getElementById('datePlaceholder').style.opacity = '0';
    }
}

function handleDateInputBlur() {
    updateDatePlaceholder();
}
function updateDatePlaceholder() {
    const dateInput = document.getElementById('dailyDate');
    const placeholder = document.getElementById('datePlaceholder');
    
    if (dateInput && placeholder) {
        if (!dateInput.value) {
            placeholder.style.display = 'block';
            placeholder.style.opacity = '1';
        } else {
            placeholder.style.opacity = '0';
            setTimeout(() => {
                placeholder.style.display = 'none';
            }, 200);
        }
    }
}



function handleDailyDateChange() {
    AppState.selectedDate = DOM.dailyDate.value;
    dailyInputChanges.clear();
    updateDatePlaceholder(); // Add this line
    updateDailyTable();
}


function loadDailyEntries() {
    const date = DOM.dailyDate ? DOM.dailyDate.value : AppState.selectedDate;
    if (!date) return;
    if (!AppState.dailyEntries[date]) AppState.dailyEntries[date] = {};
    updateDailyTable();
}

function updateDailyTable() {
    const date = DOM.dailyDate ? DOM.dailyDate.value : AppState.selectedDate;
    const dailyData = AppState.dailyEntries[date] || {};
    
    const allEmployees = [];
    AppState.employees.forEach(emp => {
        if (!allEmployees.includes(emp.name)) allEmployees.push(emp.name);
    });
    allEmployees.sort();
    
    if (DOM.addAllToday) {
        DOM.addAllToday.disabled = allEmployees.length === 0;
        DOM.addAllToday.title = allEmployees.length > 0 ? `Add all ${allEmployees.length} employees` : 'No employees available';
    }
    
    if (DOM.totalEmployees) DOM.totalEmployees.textContent = allEmployees.length;
    
    if (allEmployees.length === 0) {
        if (DOM.dailyEmpty) DOM.dailyEmpty.classList.add('show');
        if (DOM.dailyTableBody) DOM.dailyTableBody.innerHTML = '';
        updateDailyStats();
        return;
    }
    
    if (DOM.dailyEmpty) DOM.dailyEmpty.classList.remove('show');
    
    let html = '';
    allEmployees.forEach(employeeName => {
        const entry = dailyData[employeeName] || {
            clothes: 0, startTime: '09:00', breakTime: '13:00', endTime: '17:00', notes: ''
        };
        
        const netHours = calculateNetHours(entry.startTime, entry.breakTime, entry.endTime);
        const breakDuration = calculateActualBreakDuration(entry.startTime, entry.breakTime, entry.endTime);
        const hasUnsavedChanges = dailyInputChanges.has(employeeName);
        const displayValue = hasUnsavedChanges ? dailyInputChanges.get(employeeName) : entry.clothes;
        
        html += `
            <tr data-employee="${employeeName}">
                <td><div class="employee-info"><strong>${employeeName}</strong>${hasUnsavedChanges ? '<span class="unsaved-badge">*</span>' : ''}</div></td>
                <td><span class="badge ${getEmployeeTypeClass(employeeName)}">${getEmployeeType(employeeName)}</span></td>
                <td><input type="number" class="daily-input" value="${displayValue}" min="0" data-employee="${employeeName}" placeholder="0" data-original="${entry.clothes}"></td>
                <td><div class="time-cell"><small>${formatTime(entry.startTime)} - ${formatTime(entry.endTime)}</small><div>Break: ${formatTime(entry.breakTime)} (${formatHours(breakDuration)}h)</div></div></td>
                <td><span class="text-primary daily-hours" data-employee="${employeeName}">${formatHours(netHours)}h</span></td>
                <td><div class="actions"><button class="action-btn edit" onclick="openDailyModal('${employeeName.replace(/'/g, "\\'")}')" title="Edit Times"><i class="fas fa-clock"></i></button><button class="action-btn delete" onclick="removeDailyEntry('${employeeName.replace(/'/g, "\\'")}')" title="Remove"><i class="fas fa-trash"></i></button></div></td>
            </tr>
        `;
    });
    
    if (DOM.dailyTableBody) DOM.dailyTableBody.innerHTML = html;
    
    document.querySelectorAll('.daily-input').forEach(input => {
        input.addEventListener('input', function() {
            const employeeName = this.getAttribute('data-employee');
            const value = parseInt(this.value) || 0;
            dailyInputChanges.set(employeeName, value);
            updateRowUnsavedStatus(employeeName, true);
        });
    });
    
    updateDailyStats();
}

function updateRowUnsavedStatus(employeeName, hasChanges) {
    const row = document.querySelector(`tr[data-employee="${employeeName}"]`);
    if (!row) return;
    
    const employeeInfo = row.querySelector('.employee-info');
    let unsavedBadge = employeeInfo.querySelector('.unsaved-badge');
    
    if (hasChanges && !unsavedBadge) {
        unsavedBadge = document.createElement('span');
        unsavedBadge.className = 'unsaved-badge';
        unsavedBadge.textContent = '*';
        unsavedBadge.title = 'Unsaved changes';
        employeeInfo.appendChild(unsavedBadge);
    } else if (!hasChanges && unsavedBadge) {
        unsavedBadge.remove();
    }
}

function getEmployeeType(employeeName) {
    const employee = AppState.employees.find(emp => emp.name === employeeName);
    return employee ? employee.type.charAt(0).toUpperCase() + employee.type.slice(1) : 'Unknown';
}

function getEmployeeTypeClass(employeeName) {
    const employee = AppState.employees.find(emp => emp.name === employeeName);
    return employee ? (employee.type === 'weekly' ? 'weekly-badge' : 'monthly-badge') : '';
}

function updateDailyStats() {
    const date = DOM.dailyDate ? DOM.dailyDate.value : AppState.selectedDate;
    const dailyData = AppState.dailyEntries[date] || {};
    
    const allEmployees = [];
    AppState.employees.forEach(emp => {
        if (!allEmployees.includes(emp.name)) allEmployees.push(emp.name);
    });
    
    let activeCount = 0, totalGarments = 0, totalHours = 0, totalBreakHours = 0;
    
    Object.values(dailyData).forEach(entry => {
        if (entry.clothes > 0) {
            activeCount++;
            totalGarments += entry.clothes;
            totalHours += calculateNetHours(entry.startTime, entry.breakTime, entry.endTime);
            totalBreakHours += calculateActualBreakDuration(entry.startTime, entry.breakTime, entry.endTime);
        }
    });
    
    dailyInputChanges.forEach((clothes, employeeName) => {
        if (clothes > 0) {
            const savedEntry = dailyData[employeeName];
            if (!savedEntry || savedEntry.clothes === 0) {
                activeCount++;
                totalGarments += clothes;
                totalHours += calculateNetHours('09:00', '13:00', '17:00');
                totalBreakHours += calculateActualBreakDuration('09:00', '13:00', '17:00');
            }
        }
    });
    
    const avgGarments = activeCount > 0 ? (totalGarments / activeCount).toFixed(1) : '0';
    
    if (DOM.totalEmployees) DOM.totalEmployees.textContent = allEmployees.length;
    if (DOM.dailyActive) DOM.dailyActive.textContent = activeCount;
    if (DOM.dailyGarments) DOM.dailyGarments.textContent = totalGarments;
    if (DOM.dailyHours) DOM.dailyHours.textContent = formatHours(totalHours);
    if (DOM.dailyAvg) DOM.dailyAvg.textContent = avgGarments;
}

function addAllToday() {
    const date = DOM.dailyDate ? DOM.dailyDate.value : AppState.selectedDate;
    const allEmployees = [];
    AppState.employees.forEach(emp => {
        if (!allEmployees.includes(emp.name)) allEmployees.push(emp.name);
    });
    
    if (allEmployees.length === 0) {
        showToast('No employees available to add', 'warning');
        return;
    }
    
    AppState.dailyEntries[date] = {};
    allEmployees.forEach(employeeName => {
        const employee = AppState.employees.find(emp => emp.name === employeeName);
        AppState.dailyEntries[date][employeeName] = {
            clothes: 0,
            startTime: employee?.startTime || '09:00',
            breakTime: employee?.breakTime || '13:00',
            endTime: employee?.endTime || '17:00',
            notes: employee?.notes || ''
        };
    });
    
    saveData();
    updateDailyTable();
    showToast(`Reseted all ${allEmployees.length} employees for ${formatDate(date)}`, 'success');
}

// FIXED: Save All Daily Entries to Records
function saveAllDailyEntries() {
    const date = DOM.dailyDate ? DOM.dailyDate.value : AppState.selectedDate;
    
    if (dailyInputChanges.size === 0) {
        showToast('No changes to save', 'warning');
        return;
    }
    
    let entriesUpdated = 0;
    let entriesCreated = 0;
    
    dailyInputChanges.forEach((clothes, employeeName) => {
        if (clothes < 0) return;
        
        const existingEntryIndex = AppState.employees.findIndex(emp => 
            emp.name === employeeName && emp.date === date
        );
        
        const employee = AppState.employees.find(emp => emp.name === employeeName);
        const type = employee ? employee.type : 'weekly';
        
        const dailyEntryData = AppState.dailyEntries[date]?.[employeeName] || {
            startTime: '09:00', breakTime: '13:00', endTime: '17:00', notes: ''
        };
        
        if (existingEntryIndex !== -1) {
            // Update existing record
            AppState.employees[existingEntryIndex] = {
                ...AppState.employees[existingEntryIndex],
                clothes: clothes,
                startTime: dailyEntryData.startTime || AppState.employees[existingEntryIndex].startTime,
                breakTime: dailyEntryData.breakTime || AppState.employees[existingEntryIndex].breakTime,
                endTime: dailyEntryData.endTime || AppState.employees[existingEntryIndex].endTime,
                notes: dailyEntryData.notes || AppState.employees[existingEntryIndex].notes,
                totalHours: calculateTimeDifference(
                    dailyEntryData.startTime || AppState.employees[existingEntryIndex].startTime,
                    dailyEntryData.endTime || AppState.employees[existingEntryIndex].endTime
                ),
                netHours: calculateNetHours(
                    dailyEntryData.startTime || AppState.employees[existingEntryIndex].startTime,
                    dailyEntryData.breakTime || AppState.employees[existingEntryIndex].breakTime,
                    dailyEntryData.endTime || AppState.employees[existingEntryIndex].endTime
                ),
                breakDuration: calculateActualBreakDuration(
                    dailyEntryData.startTime || AppState.employees[existingEntryIndex].startTime,
                    dailyEntryData.breakTime || AppState.employees[existingEntryIndex].breakTime,
                    dailyEntryData.endTime || AppState.employees[existingEntryIndex].endTime
                ),
                updatedAt: new Date().toISOString()
            };
            entriesUpdated++;
        } else {
            // Create new record
            const newEntry = {
                id: generateId(),
                name: employeeName,
                type: type,
                clothes: clothes,
                date: date,
                startTime: dailyEntryData.startTime || '09:00',
                breakTime: dailyEntryData.breakTime || '13:00',
                endTime: dailyEntryData.endTime || '17:00',
                notes: dailyEntryData.notes || '',
                createdAt: new Date().toISOString(),
                totalHours: calculateTimeDifference(dailyEntryData.startTime || '09:00', dailyEntryData.endTime || '17:00'),
                netHours: calculateNetHours(dailyEntryData.startTime || '09:00', dailyEntryData.breakTime || '13:00', dailyEntryData.endTime || '17:00'),
                breakDuration: calculateActualBreakDuration(dailyEntryData.startTime || '09:00', dailyEntryData.breakTime || '13:00', dailyEntryData.endTime || '17:00')
            };
            AppState.employees.unshift(newEntry);
            entriesCreated++;
        }
        
        // Update daily entry
        if (!AppState.dailyEntries[date]) AppState.dailyEntries[date] = {};
        if (!AppState.dailyEntries[date][employeeName]) {
            AppState.dailyEntries[date][employeeName] = {
                clothes: 0, startTime: '09:00', breakTime: '13:00', endTime: '17:00', notes: ''
            };
        }
        AppState.dailyEntries[date][employeeName].clothes = clothes;
    });
    
    if (entriesUpdated > 0 || entriesCreated > 0) {
        dailyInputChanges.clear();
        if (saveData()) {
            updateUI();
            updateStats();
            updateDailyTable();
            
            let message = '';
            if (entriesCreated > 0) message += `${entriesCreated} new entries created. `;
            if (entriesUpdated > 0) message += `${entriesUpdated} existing entries updated.`;
            showToast(message, 'success');
        }
    } else {
        showToast('No valid entries to save', 'warning');
    }
}

// ============================================
// Modal Functions
// ============================================

function createModals() {
    // Daily Time Modal
    if (!document.getElementById('dailyTimeModal')) {
        const modalHTML = `
            <div id="dailyTimeModal" class="modal" aria-hidden="true">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3><i class="fas fa-clock"></i> Edit Daily Time</h3>
                        <button class="modal-close" onclick="closeDailyModal()" aria-label="Close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="modal-employee-info">
                            <h4 id="modalEmployeeName"></h4>
                        </div>
                        <div class="input-group">
                            <label for="modalGarments"><i class="fas fa-tshirt"></i> Garments Produced</label>
                            <input type="number" id="modalGarments" min="0" placeholder="Number of garments">
                        </div>
                        <div class="time-inputs">
                            <div class="time-input-group"><label for="modalStartTime">Start Time</label><input type="time" id="modalStartTime"></div>
                            <div class="time-input-group"><label for="modalBreakTime">Lunch Break</label><input type="time" id="modalBreakTime"></div>
                            <div class="time-input-group"><label for="modalEndTime">End Time</label><input type="time" id="modalEndTime"></div>
                        </div>
                        <div class="input-group">
                            <label for="modalNotes"><i class="fas fa-sticky-note"></i> Notes</label>
                            <textarea id="modalNotes" rows="3" placeholder="Add notes..."></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="closeDailyModal()">Cancel</button>
                        <button class="btn btn-primary" onclick="saveDailyEntry()">Save Changes</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        const modal = document.getElementById('dailyTimeModal');
        modal.addEventListener('click', e => { if (e.target === this) closeDailyModal(); });
        modal.addEventListener('keydown', e => {
            if (e.key === 'Escape') closeDailyModal();
            if (e.key === 'Enter' && e.ctrlKey) saveDailyEntry();
        });
    }
    
    // Confirmation Modal
    if (!document.getElementById('confirmationModal')) {
        const modalHTML = `
            <div id="confirmationModal" class="modal" aria-hidden="true">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3><i class="fas fa-exclamation-triangle"></i> Confirm Action</h3>
                        <button class="modal-close" onclick="closeConfirmationModal()" aria-label="Close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="confirmation-content">
                            <div class="confirmation-icon"><i class="fas fa-exclamation-circle"></i></div>
                            <p class="confirmation-message" id="confirmationMessage"></p>
                            <p class="confirmation-details" id="confirmationDetails"></p>
                            <div class="confirmation-buttons">
                                <button class="btn btn-secondary" onclick="closeConfirmationModal()">Cancel</button>
                                <button class="btn btn-danger" id="confirmActionButton">Confirm</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        document.getElementById('confirmActionButton').addEventListener('click', () => {
            if (confirmationCallback) {
                confirmationCallback();
                closeConfirmationModal();
            }
        });
        
        const modal = document.getElementById('confirmationModal');
        modal.addEventListener('click', e => { if (e.target === this) closeConfirmationModal(); });
        modal.addEventListener('keydown', e => { if (e.key === 'Escape') closeConfirmationModal(); });
    }
}

function openDailyModal(employeeName) {
    const date = DOM.dailyDate ? DOM.dailyDate.value : AppState.selectedDate;
    const entry = AppState.dailyEntries[date]?.[employeeName] || {
        clothes: 0, startTime: '09:00', breakTime: '13:00', endTime: '17:00', notes: ''
    };
    
    AppState.editingDailyId = employeeName;
    lastFocusedElement = document.activeElement;
    
    document.getElementById('modalEmployeeName').textContent = employeeName;
    document.getElementById('modalGarments').value = entry.clothes;
    document.getElementById('modalStartTime').value = entry.startTime;
    document.getElementById('modalBreakTime').value = entry.breakTime;
    document.getElementById('modalEndTime').value = entry.endTime;
    document.getElementById('modalNotes').value = entry.notes || '';
    
    const modal = document.getElementById('dailyTimeModal');
    modal.style.display = 'block';
    modal.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => document.getElementById('modalGarments').focus(), 100);
}

function saveDailyEntry() {
    if (!AppState.editingDailyId) return;
    
    const date = DOM.dailyDate ? DOM.dailyDate.value : AppState.selectedDate;
    if (!date) return;
    
    const modalGarments = document.getElementById('modalGarments');
    const modalStartTime = document.getElementById('modalStartTime');
    const modalBreakTime = document.getElementById('modalBreakTime');
    const modalEndTime = document.getElementById('modalEndTime');
    const modalNotes = document.getElementById('modalNotes');
    
    if (modalStartTime.value && modalEndTime.value && modalEndTime.value <= modalStartTime.value) {
        showToast('End time must be after start time', 'error');
        return;
    }
    
    if (!AppState.dailyEntries[date]) AppState.dailyEntries[date] = {};
    
    AppState.dailyEntries[date][AppState.editingDailyId] = {
        clothes: parseInt(modalGarments.value) || 0,
        startTime: modalStartTime.value,
        breakTime: modalBreakTime.value,
        endTime: modalEndTime.value,
        notes: modalNotes.value
    };
    
    saveData();
    updateDailyRow(AppState.editingDailyId);
    closeDailyModal();
    showToast(`Daily entry saved for ${AppState.editingDailyId}`, 'success');
}

function updateDailyRow(employeeName) {
    const date = DOM.dailyDate ? DOM.dailyDate.value : AppState.selectedDate;
    const entry = AppState.dailyEntries[date]?.[employeeName];
    if (!entry) return;
    
    const row = document.querySelector(`tr[data-employee="${employeeName}"]`);
    if (!row) return;
    
    const netHours = calculateNetHours(entry.startTime, entry.breakTime, entry.endTime);
    const breakDuration = calculateActualBreakDuration(entry.startTime, entry.breakTime, entry.endTime);
    
    const input = row.querySelector('.daily-input');
    if (input) {
        input.value = entry.clothes;
        input.setAttribute('data-original', entry.clothes);
        dailyInputChanges.delete(employeeName);
        updateRowUnsavedStatus(employeeName, false);
    }
    
    const hoursSpan = row.querySelector('.daily-hours');
    if (hoursSpan) hoursSpan.textContent = `${formatHours(netHours)}h`;
    
    const timeCell = row.querySelector('.time-cell');
    if (timeCell) {
        timeCell.innerHTML = `<small>${formatTime(entry.startTime)} - ${formatTime(entry.endTime)}</small><div>Break: ${formatTime(entry.breakTime)} (${formatHours(breakDuration)}h)</div>`;
    }
    
    updateDailyStats();
}

function removeDailyEntry(employeeName) {
    const date = DOM.dailyDate ? DOM.dailyDate.value : AppState.selectedDate;
    const entry = AppState.dailyEntries[date]?.[employeeName];
    
    if (!entry) {
        showToast('Entry not found', 'warning');
        return;
    }
    
    showConfirmation(`Remove Daily Entry?`, `Remove daily entry for ${employeeName}?\nGarments: ${entry.clothes}`, () => {
        delete AppState.dailyEntries[date][employeeName];
        if (Object.keys(AppState.dailyEntries[date]).length === 0) {
            delete AppState.dailyEntries[date];
        }
        saveData();
        
        const row = document.querySelector(`tr[data-employee="${employeeName}"]`);
        if (row) {
            const input = row.querySelector('.daily-input');
            if (input) input.value = 0;
            const hoursSpan = row.querySelector('.daily-hours');
            if (hoursSpan) hoursSpan.textContent = '0.00h';
        }
        
        updateDailyStats();
        showToast(`Entry removed for ${employeeName}`, 'success');
    });
}

function closeDailyModal() {
    const modal = document.getElementById('dailyTimeModal');
    if (modal) {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = '';
    AppState.editingDailyId = null;
    
    if (lastFocusedElement) {
        setTimeout(() => lastFocusedElement.focus(), 50);
    }
    lastFocusedElement = null;
}

function showConfirmation(message, details, callback, element = null) {
    confirmationCallback = callback;
    confirmationElement = element || document.activeElement;
    
    const modal = document.getElementById('confirmationModal');
    const messageEl = document.getElementById('confirmationMessage');
    const detailsEl = document.getElementById('confirmationDetails');
    
    messageEl.textContent = message;
    detailsEl.textContent = details || '';
    
    modal.style.display = 'block';
    modal.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => document.getElementById('confirmActionButton').focus(), 100);
}

function closeConfirmationModal() {
    const modal = document.getElementById('confirmationModal');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    
    if (confirmationElement) {
        setTimeout(() => confirmationElement.focus(), 50);
    }
    
    confirmationCallback = null;
    confirmationElement = null;
}

// ============================================
// Export Functions
// ============================================

function downloadFile(filename, blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}

function toggleDailyExportMenu() {
    if (!DOM.dailyExportMenu) return;
    const isShowing = DOM.dailyExportMenu.classList.contains('show');
    DOM.dailyExportMenu.classList.toggle('show');
    
    if (DOM.dailyExportButton) {
        DOM.dailyExportButton.setAttribute('aria-expanded', isShowing ? 'false' : 'true');
    }
    
    if (!isShowing) {
        setTimeout(() => {
            document.addEventListener('click', closeExportMenuOnClickOutside);
        }, 10);
    } else {
        document.removeEventListener('click', closeExportMenuOnClickOutside);
    }
}

function closeExportMenuOnClickOutside(e) {
    if (DOM.dailyExportMenu && !DOM.dailyExportMenu.contains(e.target) && DOM.dailyExportButton && !DOM.dailyExportButton.contains(e.target)) {
        DOM.dailyExportMenu.classList.remove('show');
        if (DOM.dailyExportButton) DOM.dailyExportButton.setAttribute('aria-expanded', 'false');
        document.removeEventListener('click', closeExportMenuOnClickOutside);
    }
}

function exportDailyToPDF() {
    try {
        const date = DOM.dailyDate ? DOM.dailyDate.value : AppState.selectedDate;
        const dailyData = AppState.dailyEntries[date] || {};
        
        if (Object.keys(dailyData).length === 0) {
            showToast('No daily data to export', 'warning');
            return;
        }
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidth = doc.internal.pageSize.width;
        
        // Header
        doc.setFillColor(37, 99, 235);
        doc.rect(0, 0, pageWidth, 25, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('DAILY PRODUCTION REPORT', pageWidth / 2, 15, { align: 'center' });
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(`Date: ${formatDate(date)}`, pageWidth / 2, 22, { align: 'center' });
        
        let yPos = 35;
        
        // Summary
        let activeCount = 0, totalGarments = 0, totalHours = 0, totalBreakHours = 0;
        const tableData = [];
        
        const allEmployees = [];
        AppState.employees.forEach(emp => {
            if (!allEmployees.includes(emp.name)) allEmployees.push(emp.name);
        });
        allEmployees.sort();
        
        allEmployees.forEach(employeeName => {
            const entry = dailyData[employeeName] || {
                clothes: 0, startTime: '09:00', breakTime: '13:00', endTime: '17:00', notes: ''
            };
            
            const netHours = calculateNetHours(entry.startTime, entry.breakTime, entry.endTime);
            const breakHours = calculateActualBreakDuration(entry.startTime, entry.breakTime, entry.endTime);
            
            if (entry.clothes > 0) {
                activeCount++;
                totalGarments += entry.clothes;
                totalHours += netHours;
                totalBreakHours += breakHours;
            }
            
            tableData.push([
                employeeName.substring(0, 20),
                getEmployeeType(employeeName),
                entry.clothes.toString(),
                `${formatTime(entry.startTime)} - ${formatTime(entry.endTime)}`,
                formatHours(netHours),
                formatHours(breakHours)
            ]);
        });
        
        // Daily Summary
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('Daily Summary:', 10, yPos);
        yPos += 8;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(`Date: ${formatDate(date)}`, 10, yPos);
        doc.text(`Total Employees: ${allEmployees.length}`, 70, yPos);
        doc.text(`Active Employees: ${activeCount}`, 130, yPos);
        yPos += 6;
        doc.text(`Total Garments: ${totalGarments}`, 10, yPos);
        doc.text(`Total Hours: ${formatHours(totalHours)}`, 70, yPos);
        doc.text(`Total Break: ${formatHours(totalBreakHours)}`, 130, yPos);
        yPos += 10;
        
        // Daily Table
        if (tableData.length > 0) {
            doc.autoTable({
                head: [['Employee', 'Type', 'Garments', 'Time', 'Hours', 'Break']],
                body: tableData,
                startY: yPos,
                theme: 'grid',
                headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: 'bold', fontSize: 8 },
                bodyStyles: { fontSize: 7, cellPadding: 2, overflow: 'linebreak' },
                margin: { left: 10, right: 10 },
                styles: { fontSize: 7, cellPadding: 2, lineWidth: 0.1 },
                columnStyles: {
                    0: { cellWidth: 35 }, 1: { cellWidth: 20 }, 2: { cellWidth: 20 },
                    3: { cellWidth: 40 }, 4: { cellWidth: 20 }, 5: { cellWidth: 20 }
                }
            });
        }
        
        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(7);
            doc.setTextColor(100, 116, 139);
            doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, 290, { align: 'center' });
            doc.text('Generated by Garment Management System', pageWidth / 2, 295, { align: 'center' });
        }
        
        const fileName = `Daily_Report_${date.replace(/-/g, '_')}.pdf`;
        const pdfBlob = doc.output('blob');
        downloadFile(fileName, pdfBlob);
        showToast('Daily PDF report generated!', 'success');
        
    } catch (error) {
        console.error('Daily PDF Export Error:', error);
        showToast(`Error generating daily PDF: ${error.message}`, 'error');
    }
}

function exportDailyToExcel() {
    try {
        const date = DOM.dailyDate ? DOM.dailyDate.value : AppState.selectedDate;
        const dailyData = AppState.dailyEntries[date] || {};
        
        if (Object.keys(dailyData).length === 0) {
            showToast('No daily data to export', 'warning');
            return;
        }
        
        const wb = XLSX.utils.book_new();
        wb.Props = {
            Title: "Daily Production Report",
            Subject: "Daily Employee Data",
            Author: "Garment Management System",
            CreatedDate: new Date()
        };
        
        const dailyDataArray = [
            ['DAILY PRODUCTION REPORT'],
            [`Date: ${formatDate(date)}`],
            [`Generated: ${new Date().toLocaleString()}`],
            [''],
            ['Employee', 'Type', 'Garments', 'Start Time', 'Break Time', 'End Time', 'Net Hours', 'Break Hours', 'Notes']
        ];
        
        let totalGarments = 0, totalHours = 0, totalBreakHours = 0;
        
        const allEmployees = [];
        AppState.employees.forEach(emp => {
            if (!allEmployees.includes(emp.name)) allEmployees.push(emp.name);
        });
        allEmployees.sort();
        
        allEmployees.forEach(employeeName => {
            const entry = dailyData[employeeName] || {
                clothes: 0, startTime: '09:00', breakTime: '13:00', endTime: '17:00', notes: ''
            };
            const netHours = calculateNetHours(entry.startTime, entry.breakTime, entry.endTime);
            const breakHours = calculateActualBreakDuration(entry.startTime, entry.breakTime, entry.endTime);
            
            totalGarments += entry.clothes;
            totalHours += netHours;
            totalBreakHours += breakHours;
            
            dailyDataArray.push([
                employeeName,
                getEmployeeType(employeeName),
                entry.clothes,
                formatTime(entry.startTime),
                formatTime(entry.breakTime),
                formatTime(entry.endTime),
                parseFloat(netHours.toFixed(2)),
                parseFloat(breakHours.toFixed(2)),
                entry.notes || ''
            ]);
        });
        
        dailyDataArray.push([''], ['SUMMARY']);
        dailyDataArray.push(['Total Employees', allEmployees.length]);
        dailyDataArray.push(['Active Employees', Object.values(dailyData).filter(e => e.clothes > 0).length]);
        dailyDataArray.push(['Total Garments', totalGarments]);
        dailyDataArray.push(['Total Hours', parseFloat(totalHours.toFixed(2))]);
        dailyDataArray.push(['Total Break Hours', parseFloat(totalBreakHours.toFixed(2))]);
        dailyDataArray.push(['Efficiency (Garments/Hour)', totalHours > 0 ? parseFloat((totalGarments / totalHours).toFixed(2)) : 0]);
        
        const wsDaily = XLSX.utils.aoa_to_sheet(dailyDataArray);
        
        // Auto-size columns
        const colWidths = dailyDataArray.reduce((widths, row) => {
            row.forEach((cell, colIndex) => {
                const length = cell ? cell.toString().length : 0;
                if (!widths[colIndex] || length > widths[colIndex]) {
                    widths[colIndex] = length;
                }
            });
            return widths;
        }, []);
        
        wsDaily['!cols'] = colWidths.map(width => ({ wch: Math.min(width + 2, 50) }));
        XLSX.utils.book_append_sheet(wb, wsDaily, "Daily Report");
        
        const fileName = `Daily_Report_${date.replace(/-/g, '_')}.xlsx`;
        const excelOutput = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
        const buffer = new ArrayBuffer(excelOutput.length);
        const view = new Uint8Array(buffer);
        for (let i = 0; i < excelOutput.length; i++) {
            view[i] = excelOutput.charCodeAt(i) & 0xFF;
        }
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        
        downloadFile(fileName, blob);
        showToast('Daily Excel report generated!', 'success');
        
    } catch (error) {
        console.error('Daily Excel Export Error:', error);
        showToast(`Error generating daily Excel: ${error.message}`, 'error');
    }
}

function exportToPDF() {
    try {
        if (AppState.employees.length === 0) {
            showToast('No data to export', 'warning');
            return;
        }
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidth = doc.internal.pageSize.width;
        
        // Header
        doc.setFillColor(37, 99, 235);
        doc.rect(0, 0, pageWidth, 25, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('GARMENT WORKER MANAGEMENT SYSTEM', pageWidth / 2, 15, { align: 'center' });
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(`Report Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 22, { align: 'center' });
        
        let yPos = 35;
        
        // Summary
        const weekly = AppState.employees.filter(e => e.type === 'weekly');
        const monthly = AppState.employees.filter(e => e.type === 'monthly');
        const weeklyClothes = weekly.reduce((s, e) => s + e.clothes, 0);
        const monthlyClothes = monthly.reduce((s, e) => s + e.clothes, 0);
        const weeklyHours = weekly.reduce((s, e) => s + (e.netHours || 0), 0);
        const monthlyHours = monthly.reduce((s, e) => s + (e.netHours || 0), 0);
        const totalGarments = weeklyClothes + monthlyClothes;
        const totalHours = weeklyHours + monthlyHours;
        const efficiency = totalHours > 0 ? (totalGarments / totalHours).toFixed(2) : 0;
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('Summary Overview', 10, yPos);
        yPos += 8;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(`Total Employees: ${AppState.employees.length}`, 10, yPos);
        doc.text(`Weekly Employees: ${weekly.length}`, 70, yPos);
        doc.text(`Monthly Employees: ${monthly.length}`, 130, yPos);
        yPos += 6;
        doc.text(`Total Garments: ${totalGarments}`, 10, yPos);
        doc.text(`Total Hours: ${formatHours(totalHours)}`, 70, yPos);
        doc.text(`Efficiency: ${efficiency} garments/hour`, 130, yPos);
        yPos += 15;
        
        // Weekly Employees Table
        if (weekly.length > 0) {
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(37, 99, 235);
            doc.text('WEEKLY EMPLOYEES', 10, yPos);
            
            const weeklyMap = new Map();
            weekly.forEach(emp => {
                const key = `${emp.name}_${emp.date}`;
                if (!weeklyMap.has(key)) weeklyMap.set(key, emp);
            });
            
            const weeklyData = Array.from(weeklyMap.values()).map(emp => [
                emp.name.substring(0, 20),
                formatDate(emp.date),
                emp.clothes.toString(),
                `${formatTime(emp.startTime)} - ${formatTime(emp.endTime)}`,
                formatHours(emp.netHours || 0),
                formatHours(emp.breakDuration || 0)
            ]);
            
            doc.autoTable({
                head: [['Name', 'Date', 'Garments', 'Time', 'Hours', 'Break']],
                body: weeklyData,
                startY: yPos + 5,
                theme: 'grid',
                headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: 'bold', fontSize: 8 },
                bodyStyles: { fontSize: 7, cellPadding: 2 },
                margin: { left: 10, right: 10 },
                styles: { fontSize: 7, cellPadding: 2, lineWidth: 0.1 },
                columnStyles: {
                    0: { cellWidth: 30 }, 1: { cellWidth: 23 }, 2: { cellWidth: 18 },
                    3: { cellWidth: 32 }, 4: { cellWidth: 18 }, 5: { cellWidth: 18 }
                }
            });
            
            yPos = doc.lastAutoTable.finalY + 10;
        }
        
        // Monthly Employees Table
        if (monthly.length > 0) {
            if (yPos > 200) { doc.addPage(); yPos = 20; }
            
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(124, 58, 237);
            doc.text('MONTHLY EMPLOYEES', 10, yPos);
            
            const monthlyMap = new Map();
            monthly.forEach(emp => {
                const key = `${emp.name}_${emp.date}`;
                if (!monthlyMap.has(key)) monthlyMap.set(key, emp);
            });
            
            const monthlyData = Array.from(monthlyMap.values()).map(emp => [
                emp.name.substring(0, 20),
                formatDate(emp.date),
                emp.clothes.toString(),
                `${formatTime(emp.startTime)} - ${formatTime(emp.endTime)}`,
                formatHours(emp.netHours || 0),
                formatHours(emp.breakDuration || 0)
            ]);
            
            doc.autoTable({
                head: [['Name', 'Date', 'Garments', 'Time', 'Hours', 'Break']],
                body: monthlyData,
                startY: yPos + 5,
                theme: 'grid',
                headStyles: { fillColor: [124, 58, 237], textColor: 255, fontStyle: 'bold', fontSize: 8 },
                bodyStyles: { fontSize: 7, cellPadding: 2 },
                margin: { left: 10, right: 10 },
                styles: { fontSize: 7, cellPadding: 2, lineWidth: 0.1 },
                columnStyles: {
                    0: { cellWidth: 30 }, 1: { cellWidth: 23 }, 2: { cellWidth: 18 },
                    3: { cellWidth: 32 }, 4: { cellWidth: 18 }, 5: { cellWidth: 18 }
                }
            });
        }
        
        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(7);
            doc.setTextColor(100, 116, 139);
            doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, 290, { align: 'center' });
            doc.text('© Garment Management System v3.2.4', pageWidth / 2, 295, { align: 'center' });
        }
        
        const fileName = `Garment_Report_${new Date().toISOString().split('T')[0]}.pdf`;
        const pdfBlob = doc.output('blob');
        downloadFile(fileName, pdfBlob);
        showToast('Complete PDF report generated!', 'success');
        
    } catch (error) {
        console.error('PDF Export Error:', error);
        showToast(`Error generating PDF: ${error.message}`, 'error');
    }
}

function exportToExcel() {
    try {
        if (AppState.employees.length === 0) {
            showToast('No data to export', 'warning');
            return;
        }
        
        const weeklyMap = new Map();
        const monthlyMap = new Map();
        
        AppState.employees.forEach(emp => {
            const key = `${emp.name}_${emp.date}_${emp.type}`;
            if (emp.type === 'weekly' && !weeklyMap.has(key)) weeklyMap.set(key, emp);
            else if (emp.type === 'monthly' && !monthlyMap.has(key)) monthlyMap.set(key, emp);
        });
        
        const weekly = Array.from(weeklyMap.values());
        const monthly = Array.from(monthlyMap.values());
        const wb = XLSX.utils.book_new();
        wb.Props = { Title: "Garment Worker Management Report", Author: "Garment Management System", CreatedDate: new Date() };
        
        if (weekly.length > 0) {
            const weeklyData = [
                ['WEEKLY EMPLOYEES REPORT'],
                [`Report Date: ${new Date().toLocaleDateString()}`],
                [`Total Employees: ${weekly.length}`],
                [''],
                ['Name', 'Date', 'Garments', 'Start Time', 'Break Time', 'End Time', 'Net Hours', 'Break Hours', 'Notes']
            ];
            
            weekly.forEach(emp => {
                weeklyData.push([
                    emp.name,
                    formatDate(emp.date),
                    emp.clothes,
                    formatTime(emp.startTime),
                    formatTime(emp.breakTime),
                    formatTime(emp.endTime),
                    parseFloat((emp.netHours || 0).toFixed(2)),
                    parseFloat((emp.breakDuration || 0).toFixed(2)),
                    emp.notes || ''
                ]);
            });
            
            const weeklyTotalGarments = weekly.reduce((sum, emp) => sum + emp.clothes, 0);
            const weeklyTotalHours = weekly.reduce((sum, emp) => sum + (emp.netHours || 0), 0);
            weeklyData.push([''], ['WEEKLY SUMMARY']);
            weeklyData.push(['Total Employees', weekly.length]);
            weeklyData.push(['Total Garments', weeklyTotalGarments]);
            weeklyData.push(['Total Hours', parseFloat(weeklyTotalHours.toFixed(2))]);
            weeklyData.push(['Average Garments/Employee', parseFloat((weeklyTotalGarments / weekly.length).toFixed(1))]);
            weeklyData.push(['Efficiency', weeklyTotalHours > 0 ? parseFloat((weeklyTotalGarments / weeklyTotalHours).toFixed(2)) : 0]);
            
            const wsWeekly = XLSX.utils.aoa_to_sheet(weeklyData);
            const colWidths = weeklyData.reduce((widths, row) => {
                row.forEach((cell, colIndex) => {
                    const length = cell ? cell.toString().length : 0;
                    if (!widths[colIndex] || length > widths[colIndex]) widths[colIndex] = length;
                });
                return widths;
            }, []);
            wsWeekly['!cols'] = colWidths.map(width => ({ wch: Math.min(width + 2, 50) }));
            XLSX.utils.book_append_sheet(wb, wsWeekly, "Weekly Employees");
        }
        
        if (monthly.length > 0) {
            const monthlyData = [
                ['MONTHLY EMPLOYEES REPORT'],
                [`Report Date: ${new Date().toLocaleDateString()}`],
                [`Total Employees: ${monthly.length}`],
                [''],
                ['Name', 'Date', 'Garments', 'Start Time', 'Break Time', 'End Time', 'Net Hours', 'Break Hours', 'Notes']
            ];
            
            monthly.forEach(emp => {
                monthlyData.push([
                    emp.name,
                    formatDate(emp.date),
                    emp.clothes,
                    formatTime(emp.startTime),
                    formatTime(emp.breakTime),
                    formatTime(emp.endTime),
                    parseFloat((emp.netHours || 0).toFixed(2)),
                    parseFloat((emp.breakDuration || 0).toFixed(2)),
                    emp.notes || ''
                ]);
            });
            
            const monthlyTotalGarments = monthly.reduce((sum, emp) => sum + emp.clothes, 0);
            const monthlyTotalHours = monthly.reduce((sum, emp) => sum + (emp.netHours || 0), 0);
            monthlyData.push([''], ['MONTHLY SUMMARY']);
            monthlyData.push(['Total Employees', monthly.length]);
            monthlyData.push(['Total Garments', monthlyTotalGarments]);
            monthlyData.push(['Total Hours', parseFloat(monthlyTotalHours.toFixed(2))]);
            monthlyData.push(['Average Garments/Employee', parseFloat((monthlyTotalGarments / monthly.length).toFixed(1))]);
            monthlyData.push(['Efficiency', monthlyTotalHours > 0 ? parseFloat((monthlyTotalGarments / monthlyTotalHours).toFixed(2)) : 0]);
            
            const wsMonthly = XLSX.utils.aoa_to_sheet(monthlyData);
            const colWidths = monthlyData.reduce((widths, row) => {
                row.forEach((cell, colIndex) => {
                    const length = cell ? cell.toString().length : 0;
                    if (!widths[colIndex] || length > widths[colIndex]) widths[colIndex] = length;
                });
                return widths;
            }, []);
            wsMonthly['!cols'] = colWidths.map(width => ({ wch: Math.min(width + 2, 50) }));
            XLSX.utils.book_append_sheet(wb, wsMonthly, "Monthly Employees");
        }
        
        const fileName = `Garment_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
        const excelOutput = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
        const buffer = new ArrayBuffer(excelOutput.length);
        const view = new Uint8Array(buffer);
        for (let i = 0; i < excelOutput.length; i++) {
            view[i] = excelOutput.charCodeAt(i) & 0xFF;
        }
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        
        downloadFile(fileName, blob);
        showToast('Complete Excel report generated!', 'success');
        
    } catch (error) {
        console.error('Excel Export Error:', error);
        showToast(`Error generating Excel: ${error.message}`, 'error');
    }
}

function exportBackup() {
    try {
        const data = {
            metadata: {
                exportedAt: new Date().toISOString(),
                totalEmployees: AppState.employees.length,
                dailyEntriesCount: Object.keys(AppState.dailyEntries).length,
                version: '3.2.4'
            },
            employees: AppState.employees,
            nextId: AppState.nextId,
            dailyEntries: AppState.dailyEntries
        };
        
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        downloadFile(`garment_backup_${new Date().toISOString().split('T')[0]}.json`, blob);
        
        localStorage.setItem('lastBackup', new Date().toISOString());
        updateStorageInfo();
        showToast(`Backup exported successfully (${data.totalEmployees} employees)`, 'success');
    } catch (error) {
        console.error('Backup Export Error:', error);
        showToast(`Error exporting backup: ${error.message}`, 'error');
    }
}

// ============================================
// UI Management
// ============================================

function updateUI() {
    updateNavigation();
    updateTables();
    updateForm();
    updatePreview();
    updateDailyTable();
}

function updateNavigation() {
    const weeklyCount = AppState.employees.filter(e => e.type === 'weekly').length;
    const monthlyCount = AppState.employees.filter(e => e.type === 'monthly').length;
    const today = new Date().toISOString().split('T')[0];
    const todayEntries = Object.keys(AppState.dailyEntries[today] || {}).length;
    
    if (DOM.navWeekly) DOM.navWeekly.textContent = weeklyCount;
    if (DOM.navMonthly) DOM.navMonthly.textContent = monthlyCount;
    if (DOM.navDaily) DOM.navDaily.textContent = todayEntries;
    if (DOM.mobileTotal) DOM.mobileTotal.textContent = AppState.employees.length;
}

function updateTables() {
    updateTable('weekly');
    updateTable('monthly');
}

function updateTable(type) {
    const tableBody = type === 'weekly' ? DOM.weeklyTableBody : DOM.monthlyTableBody;
    const emptyState = type === 'weekly' ? DOM.weeklyEmpty : DOM.monthlyEmpty;
    const pageInfo = type === 'weekly' ? DOM.weeklyPageInfo : DOM.monthlyPageInfo;
    
    if (!tableBody || !emptyState) return;
    
    let employees = AppState.employees.filter(emp => emp.type === type);
    const uniqueMap = new Map();
    employees.forEach(emp => {
        const key = `${emp.name}_${emp.date}`;
        if (!uniqueMap.has(key)) uniqueMap.set(key, emp);
    });
    employees = Array.from(uniqueMap.values());
    
    updateSortIndicators(type);
    const sortConfig = AppState.sortConfig[type];
    
    employees.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        if (sortConfig.key === 'date') {
            aValue = new Date(a.date);
            bValue = new Date(b.date);
        } else if (['clothes', 'netHours', 'breakDuration'].includes(sortConfig.key)) {
            aValue = parseFloat(aValue) || 0;
            bValue = parseFloat(bValue) || 0;
        }
        
        return sortConfig.direction === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
    });
    
    const currentPage = AppState.currentPage[type];
    const totalPages = Math.ceil(employees.length / AppState.itemsPerPage);
    const startIndex = (currentPage - 1) * AppState.itemsPerPage;
    const pageEmployees = employees.slice(startIndex, startIndex + AppState.itemsPerPage);
    
    if (pageEmployees.length === 0) {
        tableBody.innerHTML = '';
        emptyState.classList.add('show');
        updatePaginationInfo(type, 0, employees.length, currentPage, totalPages);
        return;
    }
    
    emptyState.classList.remove('show');
    
    tableBody.innerHTML = pageEmployees.map(employee => `
        <tr>
            <td><div class="employee-info"><strong>${employee.name}</strong>${employee.notes ? `<small class="text-muted">${employee.notes}</small>` : ''}</div></td>
            <td>${formatDate(employee.date)}</td>
            <td><span class="badge ${type}-badge">${employee.clothes}</span></td>
            <td><span class="text-primary">${formatHours(employee.netHours || 0)}h</span><small class="text-muted d-block">${formatTime(employee.startTime)} - ${formatTime(employee.endTime)}</small>${employee.breakDuration ? `<small class="text-muted d-block">Break: ${formatHours(employee.breakDuration)}h</small>` : ''}</td>
            <td><div class="actions"><button class="action-btn edit" onclick="editEmployee('${employee.id}')" title="Edit"><i class="fas fa-edit"></i></button><button class="action-btn delete" onclick="deleteEmployee('${employee.id}', event)" title="Delete"><i class="fas fa-trash"></i></button></div></td>
        </tr>
    `).join('');
    
    updatePaginationInfo(type, pageEmployees.length, employees.length, currentPage, totalPages);
    updatePaginationButtons(type, currentPage, totalPages);
    if (pageInfo) pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}

function updateSortIndicators(type) {
    const sortConfig = AppState.sortConfig[type];
    const table = type === 'weekly' ? 'weeklyTable' : 'monthlyTable';
    const thElements = document.querySelectorAll(`#${table} th[data-sort]`);
    
    thElements.forEach(th => {
        th.classList.remove('sort-asc', 'sort-desc');
        if (th.dataset.sort === sortConfig.key) {
            th.classList.add(`sort-${sortConfig.direction}`);
            th.setAttribute('aria-sort', sortConfig.direction === 'asc' ? 'ascending' : 'descending');
        } else {
            th.setAttribute('aria-sort', 'none');
        }
    });
}

function updatePaginationInfo(type, showing, total, currentPage, totalPages) {
    const showingElement = type === 'weekly' ? DOM.weeklyShowing : DOM.monthlyShowing;
    const totalElement = type === 'weekly' ? DOM.weeklyTotal : DOM.monthlyTotal;
    if (showingElement) showingElement.textContent = showing;
    if (totalElement) totalElement.textContent = total;
}

function updatePaginationButtons(type, currentPage, totalPages) {
    const prevBtn = type === 'weekly' ? DOM.prevWeekly : DOM.prevMonthly;
    const nextBtn = type === 'weekly' ? DOM.nextWeekly : DOM.nextMonthly;
    if (prevBtn) prevBtn.disabled = currentPage <= 1;
    if (nextBtn) nextBtn.disabled = currentPage >= totalPages;
}

function updateForm() {
    const today = new Date().toISOString().split('T')[0];
    if (DOM.workDate && !DOM.workDate.value) DOM.workDate.value = today;
    if (DOM.workDate) DOM.workDate.max = today;
    
    if (DOM.startTime && !DOM.startTime.value) {
        DOM.startTime.value = '09:00';
        DOM.breakTime.value = '13:00';
        DOM.endTime.value = '17:00';
        updateTimeSummary();
    }
    
    if (DOM.employeeName && AppState.currentSection === 'form') {
        setTimeout(() => {
            if (!document.activeElement || document.activeElement.tagName === 'BODY') {
                DOM.employeeName.focus();
            }
        }, 100);
    }
}

function updateTimeSummary() {
    const start = DOM.startTime ? DOM.startTime.value : '';
    const breakTime = DOM.breakTime ? DOM.breakTime.value : '';
    const end = DOM.endTime ? DOM.endTime.value : '';
    
    if (start && end && DOM.totalHours && DOM.netHours && DOM.breakDuration) {
        const total = calculateTimeDifference(start, end);
        const net = calculateNetHours(start, breakTime, end);
        const breakDuration = calculateActualBreakDuration(start, breakTime, end);
        DOM.totalHours.textContent = formatHours(total);
        DOM.netHours.textContent = formatHours(net);
        DOM.breakDuration.textContent = formatHours(breakDuration);
    }
}

function updateStats() {
    const weeklyEmployees = AppState.employees.filter(e => e.type === 'weekly');
    const monthlyEmployees = AppState.employees.filter(e => e.type === 'monthly');
    
    const weeklyClothes = weeklyEmployees.reduce((sum, emp) => sum + emp.clothes, 0);
    const weeklyHours = weeklyEmployees.reduce((sum, emp) => sum + (emp.netHours || 0), 0);
    const weeklyAvgClothes = weeklyEmployees.length > 0 ? (weeklyClothes / weeklyEmployees.length).toFixed(1) : '0';
    
    const monthlyClothes = monthlyEmployees.reduce((sum, emp) => sum + emp.clothes, 0);
    const monthlyHours = monthlyEmployees.reduce((sum, emp) => sum + (emp.netHours || 0), 0);
    const monthlyAvgClothes = monthlyEmployees.length > 0 ? (monthlyClothes / monthlyEmployees.length).toFixed(1) : '0';
    
    const totalClothes = weeklyClothes + monthlyClothes;
    const totalHours = weeklyHours + monthlyHours;
    const efficiency = totalHours > 0 ? (totalClothes / totalHours).toFixed(2) : '0';
    
    if (DOM.weeklyCount) DOM.weeklyCount.textContent = weeklyEmployees.length;
    if (DOM.weeklyGarments) DOM.weeklyGarments.textContent = weeklyClothes;
    if (DOM.weeklyHours) DOM.weeklyHours.textContent = formatHours(weeklyHours);
    if (DOM.weeklyAvg) DOM.weeklyAvg.textContent = weeklyAvgClothes;
    
    if (DOM.monthlyCount) DOM.monthlyCount.textContent = monthlyEmployees.length;
    if (DOM.monthlyGarments) DOM.monthlyGarments.textContent = monthlyClothes;
    if (DOM.monthlyHours) DOM.monthlyHours.textContent = formatHours(monthlyHours);
    if (DOM.monthlyAvg) DOM.monthlyAvg.textContent = monthlyAvgClothes;
    
    if (DOM.desktopTotal) DOM.desktopTotal.textContent = AppState.employees.length;
    if (DOM.desktopGarments) DOM.desktopGarments.textContent = totalClothes;
    if (DOM.desktopHours) DOM.desktopHours.textContent = formatHours(totalHours);
    if (DOM.desktopEfficiency) DOM.desktopEfficiency.textContent = efficiency;
    if (DOM.footerTotal) DOM.footerTotal.textContent = AppState.employees.length;
    if (DOM.footerGarments) DOM.footerGarments.textContent = totalClothes;
    if (DOM.footerEfficiency) DOM.footerEfficiency.textContent = efficiency;
    
    if (DOM.settingsTotal) DOM.settingsTotal.textContent = AppState.employees.length;
    if (DOM.settingsWeekly) DOM.settingsWeekly.textContent = weeklyEmployees.length;
    if (DOM.settingsMonthly) DOM.settingsMonthly.textContent = monthlyEmployees.length;
}

function updatePreview() {
    const weeklyEmployees = AppState.employees.filter(e => e.type === 'weekly');
    const monthlyEmployees = AppState.employees.filter(e => e.type === 'monthly');
    
    const weeklyClothes = weeklyEmployees.reduce((sum, emp) => sum + emp.clothes, 0);
    const monthlyClothes = monthlyEmployees.reduce((sum, emp) => sum + emp.clothes, 0);
    
    const today = new Date().toISOString().split('T')[0];
    const todayData = AppState.dailyEntries[today] || {};
    const todayGarments = Object.values(todayData).reduce((sum, entry) => sum + entry.clothes, 0);
    
    if (DOM.previewWeekly) DOM.previewWeekly.textContent = weeklyEmployees.length;
    if (DOM.previewWeeklyGarments) DOM.previewWeeklyGarments.textContent = weeklyClothes;
    if (DOM.previewMonthly) DOM.previewMonthly.textContent = monthlyEmployees.length;
    if (DOM.previewMonthlyGarments) DOM.previewMonthlyGarments.textContent = monthlyClothes;
    if (DOM.previewToday) DOM.previewToday.textContent = Object.keys(todayData).length;
    if (DOM.previewTodayGarments) DOM.previewTodayGarments.textContent = todayGarments;
    if (DOM.previewTotal) DOM.previewTotal.textContent = AppState.employees.length;
    
    const totalHours = AppState.employees.reduce((sum, emp) => sum + (emp.netHours || 0), 0);
    if (DOM.previewHours) DOM.previewHours.textContent = formatHours(totalHours);
}

// ============================================
// Navigation
// ============================================

function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
        section.classList.remove('active');
    });
    
    document.querySelectorAll('.nav-link, .nav-item, .desktop-nav-link').forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
    });
    
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'block';
        section.classList.add('active');
        AppState.currentSection = sectionId;
        
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        const desktopNavLink = document.querySelector(`.desktop-nav-link[href="#${sectionId}"]`);
        const navItem = document.querySelector(`.nav-item[href="#${sectionId}"]`);
        
        if (navLink) { navLink.classList.add('active'); navLink.setAttribute('aria-current', 'page'); }
        if (desktopNavLink) { desktopNavLink.classList.add('active'); desktopNavLink.setAttribute('aria-current', 'page'); }
        if (navItem) { navItem.classList.add('active'); navItem.setAttribute('aria-current', 'page'); }
        
        hideMobileMenu();
        if (DOM.dailyExportMenu) {
            DOM.dailyExportMenu.classList.remove('show');
            if (DOM.dailyExportButton) DOM.dailyExportButton.setAttribute('aria-expanded', 'false');
        }
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.history.replaceState(null, null, `#${sectionId}`);
        
        if (sectionId === 'form') updateForm();
        else if (sectionId === 'daily') updateDailyTable();
    }
}

function showMobileMenu() {
    if (DOM.mobileNav) {
        DOM.mobileNav.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function hideMobileMenu() {
    if (DOM.mobileNav) {
        DOM.mobileNav.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function setupNavigation() {
    if (DOM.menuToggle) {
        DOM.menuToggle.addEventListener('click', showMobileMenu);
        DOM.menuToggle.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showMobileMenu(); } });
    }
    if (DOM.closeNav) DOM.closeNav.addEventListener('click', hideMobileMenu);
    
    document.querySelectorAll('.nav-link, .nav-item, .desktop-nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                showSection(href.substring(1));
                hideMobileMenu();
            }
        });
        link.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); link.click(); } });
    });
    
    if (DOM.mobileThemeToggle) DOM.mobileThemeToggle.addEventListener('click', toggleTheme);
    if (DOM.navThemeToggle) DOM.navThemeToggle.addEventListener('click', toggleTheme);
    if (DOM.desktopThemeToggle) DOM.desktopThemeToggle.addEventListener('click', toggleTheme);
    
    document.addEventListener('click', function(e) {
        if (DOM.mobileNav && DOM.mobileNav.classList.contains('active') && !DOM.mobileNav.contains(e.target) && !DOM.menuToggle.contains(e.target)) {
            hideMobileMenu();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (DOM.dailyExportMenu && DOM.dailyExportMenu.classList.contains('show')) {
                DOM.dailyExportMenu.classList.remove('show');
                if (DOM.dailyExportButton) DOM.dailyExportButton.setAttribute('aria-expanded', 'false');
            }
            closeDailyModal();
            hideMobileMenu();
        }
        if (e.ctrlKey && e.key === 's') { e.preventDefault(); saveData(); }
        if (e.ctrlKey && e.key === 'e') { e.preventDefault(); showSection('export'); }
    });
}

// ============================================
// Event Listeners
// ============================================

function setupEventListeners() {
    // Form submission
    if (DOM.employeeForm) {
        DOM.employeeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = {
                name: DOM.employeeName ? DOM.employeeName.value : '',
                type: Array.from(DOM.employeeType || []).find(radio => radio.checked)?.value,
                clothes: DOM.dailyClothes ? DOM.dailyClothes.value : 0,
                date: DOM.workDate ? DOM.workDate.value : '',
                startTime: DOM.startTime ? DOM.startTime.value : '',
                breakTime: DOM.breakTime ? DOM.breakTime.value : '',
                endTime: DOM.endTime ? DOM.endTime.value : '',
                notes: DOM.notes ? DOM.notes.value : ''
            };
            
            const errors = validateForm(formData);
            if (errors.length > 0) {
                errors.forEach(error => showToast(error, 'error'));
                return;
            }
            
            if (addEmployee(formData)) {
                DOM.employeeForm.reset();
                document.querySelectorAll('input[name="employeeType"]').forEach(radio => radio.checked = false);
                updateForm();
                showSection('weekly');
            }
        });
    }
    
    // Update form
    if (DOM.updateForm) {
        DOM.updateForm.addEventListener('click', () => {
            const id = DOM.editId ? DOM.editId.value : '';
            if (!id) return;
            
            const formData = {
                name: DOM.employeeName ? DOM.employeeName.value : '',
                type: Array.from(DOM.employeeType || []).find(radio => radio.checked)?.value,
                clothes: DOM.dailyClothes ? DOM.dailyClothes.value : 0,
                date: DOM.workDate ? DOM.workDate.value : '',
                startTime: DOM.startTime ? DOM.startTime.value : '',
                breakTime: DOM.breakTime ? DOM.breakTime.value : '',
                endTime: DOM.endTime ? DOM.endTime.value : '',
                notes: DOM.notes ? DOM.notes.value : ''
            };
            
            const errors = validateForm(formData);
            if (errors.length > 0) {
                errors.forEach(error => showToast(error, 'error'));
                return;
            }
            
            updateEmployee(id, formData);
        });
    }
    
    // Clear form
    if (DOM.clearForm) {
        DOM.clearForm.addEventListener('click', () => {
            if (DOM.employeeForm) DOM.employeeForm.reset();
            document.querySelectorAll('input[name="employeeType"]').forEach(radio => radio.checked = false);
            updateForm();
            cancelEditMode();
            showToast('Form cleared', 'info');
        });
    }
    
    // Cancel edit
    if (DOM.cancelEdit) DOM.cancelEdit.addEventListener('click', cancelEditMode);
    
    // Time inputs
    if (DOM.startTime) {
        DOM.startTime.addEventListener('change', updateTimeSummary);
        DOM.startTime.addEventListener('input', updateTimeSummary);
    }
    if (DOM.breakTime) {
        DOM.breakTime.addEventListener('change', updateTimeSummary);
        DOM.breakTime.addEventListener('input', updateTimeSummary);
    }
    if (DOM.endTime) {
        DOM.endTime.addEventListener('change', updateTimeSummary);
        DOM.endTime.addEventListener('input', updateTimeSummary);
    }
    
    // Daily Export Button
    if (DOM.dailyExportButton) DOM.dailyExportButton.addEventListener('click', toggleDailyExportMenu);
    
    // Add all today
    if (DOM.addAllToday) DOM.addAllToday.addEventListener('click', addAllToday);
    
    // Save all daily entries
    if (DOM.saveDailyEntries) DOM.saveDailyEntries.addEventListener('click', saveAllDailyEntries);
    
    // Import file
    const importFile = document.getElementById('importFile');
    if (importFile) {
        importFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 5 * 1024 * 1024) {
                    showToast('File too large (max 5MB)', 'error');
                    e.target.value = '';
                    return;
                }
                if (file.type !== 'application/json') {
                    showToast('Please select a JSON file', 'error');
                    e.target.value = '';
                    return;
                }
                importData(file);
            }
            e.target.value = '';
        });
    }
    
    // Pagination
    if (DOM.prevWeekly) {
        DOM.prevWeekly.addEventListener('click', () => {
            if (AppState.currentPage.weekly > 1) {
                AppState.currentPage.weekly--;
                updateTable('weekly');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }
    if (DOM.nextWeekly) {
        DOM.nextWeekly.addEventListener('click', () => {
            const weeklyCount = AppState.employees.filter(e => e.type === 'weekly').length;
            const totalPages = Math.ceil(weeklyCount / AppState.itemsPerPage);
            if (AppState.currentPage.weekly < totalPages) {
                AppState.currentPage.weekly++;
                updateTable('weekly');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }
    if (DOM.prevMonthly) {
        DOM.prevMonthly.addEventListener('click', () => {
            if (AppState.currentPage.monthly > 1) {
                AppState.currentPage.monthly--;
                updateTable('monthly');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }
    if (DOM.nextMonthly) {
        DOM.nextMonthly.addEventListener('click', () => {
            const monthlyCount = AppState.employees.filter(e => e.type === 'monthly').length;
            const totalPages = Math.ceil(monthlyCount / AppState.itemsPerPage);
            if (AppState.currentPage.monthly < totalPages) {
                AppState.currentPage.monthly++;
                updateTable('monthly');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }
    
    // Table sorting
    document.querySelectorAll('[data-sort]').forEach(th => {
        th.addEventListener('click', () => {
            const table = th.closest('.data-table').id;
            const type = table.includes('weekly') ? 'weekly' : 'monthly';
            const key = th.dataset.sort;
            
            if (AppState.sortConfig[type].key === key) {
                AppState.sortConfig[type].direction = AppState.sortConfig[type].direction === 'asc' ? 'desc' : 'asc';
            } else {
                AppState.sortConfig[type] = { key, direction: 'asc' };
            }
            
            AppState.currentPage[type] = 1;
            updateTable(type);
        });
        th.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                th.click();
            }
        });
    });
    
    // Set current year
    const currentYear = document.getElementById('currentYear');
    if (currentYear) currentYear.textContent = new Date().getFullYear();
    
    // Auto-save
    setInterval(() => {
        if (AppState.lastSaveTime && (new Date() - AppState.lastSaveTime) > 30000) {
            saveData();
        }
    }, 30000);
    
    // Window resize
    window.addEventListener('resize', () => updateDailyTable());
}

// ============================================
// Initialization Helpers
// ============================================

function createSaveIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'saveIndicator';
    indicator.className = 'save-indicator';
    indicator.innerHTML = '<i class="fas fa-save"></i> <span>Auto-saved</span>';
    indicator.style.display = 'none';
    document.body.appendChild(indicator);
}

// ============================================
// Start Application & Global Functions
// ============================================

document.addEventListener('DOMContentLoaded', init);

// Global functions for HTML onclick handlers
window.clearAllData = clearAllData;
window.clearDailyEntries = (event) => {
    const today = new Date().toISOString().split('T')[0];
    const todayEntries = AppState.dailyEntries[today] || {};
    const entryCount = Object.keys(todayEntries).length;
    
    if (entryCount === 0) {
        showToast('No daily entries for today', 'warning');
        return;
    }
    
    showConfirmation(`Clear Today's Entries?`, `This will clear ${entryCount} daily entries for ${formatDate(today)}.\n\nThis action cannot be undone.`, () => {
        delete AppState.dailyEntries[today];
        if (saveData()) {
            updateDailyTable();
            showToast('Today\'s entries cleared', 'success');
        }
    }, event?.currentTarget);
};
window.exportToPDF = exportToPDF;
window.exportToExcel = exportToExcel;
window.exportBackup = exportBackup;
window.deleteEmployee = deleteEmployee;
window.editEmployee = editEmployee;
window.toggleTheme = toggleTheme;
window.openDailyModal = openDailyModal;
window.saveDailyEntry = saveDailyEntry;
window.removeDailyEntry = removeDailyEntry;
window.toggleDailyExportMenu = toggleDailyExportMenu;
window.exportDailyToPDF = exportDailyToPDF;
window.exportDailyToExcel = exportDailyToExcel;
window.showSection = showSection;
window.closeDailyModal = closeDailyModal;
window.addAllToday = addAllToday;
window.saveAllDailyEntries = saveAllDailyEntries;
window.showConfirmation = showConfirmation;
window.closeConfirmationModal = closeConfirmationModal;

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AppState, calculateNetHours, calculateTimeDifference, formatDate, formatTime };
}
