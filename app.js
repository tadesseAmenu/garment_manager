// ============================================
// Garment Worker Management System
// Version 3.2.2 - COMPLETE FIXED VERSION
// ============================================

// Application State
const AppState = {
    employees: [],
    nextId: 1,
    currentSection: 'form',
    currentPage: {
        weekly: 1,
        monthly: 1
    },
    itemsPerPage: 10,
    sortConfig: {
        weekly: { key: 'date', direction: 'desc' },
        monthly: { key: 'date', direction: 'desc' }
    },
    isDarkMode: false,
    editingId: null,
    dailyEntries: {},
    selectedDate: null,
    editingDailyId: null,
    lastSaveTime: null,
    currentSortColumn: {
        weekly: null,
        monthly: null
    }
};

// DOM Elements Cache (will be initialized in initDOM())
let DOM = {};

// ============================================
// DOM Initialization - FIXED
// ============================================

function initDOM() {
    DOM = {
        // Theme elements
        mobileThemeToggle: document.getElementById('mobileThemeToggle'),
        navThemeToggle: document.getElementById('navThemeToggle'),
        desktopThemeToggle: document.getElementById('desktopThemeToggle'),
        
        // Mobile elements
        menuToggle: document.getElementById('menuToggle'),
        mobileNav: document.getElementById('mobileNav'),
        closeNav: document.getElementById('closeNav'),
        navWeekly: document.getElementById('navWeekly'),
        navMonthly: document.getElementById('navMonthly'),
        navDaily: document.getElementById('navDaily'),
        mobileTotal: document.getElementById('mobileTotal'),
        
        // Form elements
        employeeForm: document.getElementById('employeeForm'),
        clearForm: document.getElementById('clearForm'),
        cancelEdit: document.getElementById('cancelEdit'),
        employeeName: document.getElementById('employeeName'),
        employeeType: document.querySelectorAll('input[name="employeeType"]'),
        dailyClothes: document.getElementById('dailyClothes'),
        workDate: document.getElementById('workDate'),
        startTime: document.getElementById('startTime'),
        breakTime: document.getElementById('breakTime'),
        endTime: document.getElementById('endTime'),
        notes: document.getElementById('notes'),
        submitForm: document.getElementById('submitForm'),
        updateForm: document.getElementById('updateForm'),
        editId: document.getElementById('editId'),
        
        // Daily entry elements
        dailyDate: document.getElementById('dailyDate'),
        todayDate: document.getElementById('todayDate'),
        totalEmployees: document.getElementById('totalEmployees'),
        dailyActive: document.getElementById('dailyActive'),
        dailyGarments: document.getElementById('dailyGarments'),
        dailyHours: document.getElementById('dailyHours'),
        dailyAvg: document.getElementById('dailyAvg'),
        addAllToday: document.getElementById('addAllToday'),
        saveDailyEntries: document.getElementById('saveDailyEntries'),
        dailyTableBody: document.getElementById('dailyTableBody'),
        dailyEmpty: document.getElementById('dailyEmpty'),
        dailyExportButton: document.getElementById('dailyExportButton'),
        
        // Table elements
        weeklyTableBody: document.getElementById('weeklyTableBody'),
        monthlyTableBody: document.getElementById('monthlyTableBody'),
        weeklyEmpty: document.getElementById('weeklyEmpty'),
        monthlyEmpty: document.getElementById('monthlyEmpty'),
        
        // Stats elements
        weeklyCount: document.getElementById('weeklyCount'),
        weeklyGarments: document.getElementById('weeklyGarments'),
        weeklyHours: document.getElementById('weeklyHours'),
        weeklyAvg: document.getElementById('weeklyAvg'),
        monthlyCount: document.getElementById('monthlyCount'),
        monthlyGarments: document.getElementById('monthlyGarments'),
        monthlyHours: document.getElementById('monthlyHours'),
        monthlyAvg: document.getElementById('monthlyAvg'),
        desktopTotal: document.getElementById('desktopTotal'),
        desktopGarments: document.getElementById('desktopGarments'),
        desktopHours: document.getElementById('desktopHours'),
        footerTotal: document.getElementById('footerTotal'),
        footerGarments: document.getElementById('footerGarments'),
        footerEfficiency: document.getElementById('footerEfficiency'),
        
        // Preview elements
        previewWeekly: document.getElementById('previewWeekly'),
        previewWeeklyGarments: document.getElementById('previewWeeklyGarments'),
        previewMonthly: document.getElementById('previewMonthly'),
        previewMonthlyGarments: document.getElementById('previewMonthlyGarments'),
        previewToday: document.getElementById('previewToday'),
        previewTodayGarments: document.getElementById('previewTodayGarments'),
        previewTotal: document.getElementById('previewTotal'),
        previewHours: document.getElementById('previewHours'),
        
        // Settings elements
        settingsTotal: document.getElementById('settingsTotal'),
        settingsStorage: document.getElementById('settingsStorage'),
        settingsBackup: document.getElementById('settingsBackup'),
        
        // Export menu
        dailyExportMenu: document.getElementById('dailyExportMenu'),
        
        // Pagination elements
        prevWeekly: document.getElementById('prevWeekly'),
        nextWeekly: document.getElementById('nextWeekly'),
        prevMonthly: document.getElementById('prevMonthly'),
        nextMonthly: document.getElementById('nextMonthly'),
        weeklyShowing: document.getElementById('weeklyShowing'),
        weeklyTotal: document.getElementById('weeklyTotal'),
        monthlyShowing: document.getElementById('monthlyShowing'),
        monthlyTotal: document.getElementById('monthlyTotal'),
        weeklyPageInfo: document.querySelector('#weekly .page-info'),
        monthlyPageInfo: document.querySelector('#monthly .page-info'),
        
        // Time calculation elements
        totalHours: document.getElementById('totalHours'),
        netHours: document.getElementById('netHours'),
        breakDuration: document.getElementById('breakDuration'),
        
        // Desktop navigation
        desktopNavLinks: document.querySelectorAll('.desktop-nav-link'),
        
        // Save indicator
        saveIndicator: null
    };
}

// ============================================
// Theme Management
// ============================================

function initTheme() {
    const savedTheme = localStorage.getItem('garmentTheme');
    AppState.isDarkMode = savedTheme === 'dark';
    
    if (AppState.isDarkMode) {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
    } else {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
    }
    
    updateThemeButtons();
}

function toggleTheme() {
    AppState.isDarkMode = !AppState.isDarkMode;
    
    if (AppState.isDarkMode) {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
        localStorage.setItem('garmentTheme', 'dark');
    } else {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        localStorage.setItem('garmentTheme', 'light');
    }
    
    updateThemeButtons();
}

function updateThemeButtons() {
    const themeButtons = [
        DOM.mobileThemeToggle,
        DOM.navThemeToggle,
        DOM.desktopThemeToggle
    ];
    
    themeButtons.forEach(button => {
        if (button) {
            const icon = button.querySelector('i');
            const label = button.querySelector('.theme-label');
            
            if (icon) {
                icon.className = AppState.isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
            }
            
            if (label) {
                label.textContent = AppState.isDarkMode ? 'Light Mode' : 'Dark Mode';
            }
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
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatDateTime(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
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
    const endTime = new Date(`2000-01-01T${end}`);
    
    if (endTime < startTime) {
        endTime.setDate(endTime.getDate() + 1);
    }
    
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
    
    // Parse times
    const [breakHour, breakMinute] = breakTime.split(':').map(Number);
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    // Convert to minutes for easier calculation
    const breakInMinutes = breakHour * 60 + breakMinute;
    const startInMinutes = startHour * 60 + startMinute;
    const endInMinutes = endHour * 60 + endMinute;
    
    // Check if break is within work hours
    if (breakInMinutes >= startInMinutes && breakInMinutes <= endInMinutes) {
        // Break is 1 hour (standard lunch break)
        const breakEndInMinutes = breakInMinutes + 60;
        
        // If break extends beyond end time, calculate partial break
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
// Toast Notification System
// ============================================

function showToast(message, type = 'success', duration = 5000) {
    const container = document.getElementById('toastContainer');
    if (!container) {
        console.error('Toast container not found');
        return;
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle',
        save: 'save'
    };
    
    const titles = {
        success: 'Success',
        error: 'Error',
        warning: 'Warning',
        info: 'Information',
        save: 'Saved'
    };
    
    const icon = icons[type] || icons.info;
    const title = titles[type] || 'Information';
    
    toast.innerHTML = `
        <i class="fas fa-${icon} toast-icon"></i>
        <div class="toast-content">
            <h4>${title}</h4>
            <p>${message}</p>
            ${type === 'save' ? `<small class="text-muted">Just now</small>` : ''}
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()" aria-label="Close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(toast);
    
    // Force reflow
    toast.offsetHeight;
    
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Auto-remove after duration
    const removeTimer = setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode === container) {
                toast.remove();
            }
        }, 300);
    }, duration);
    
    // Pause auto-remove on hover
    toast.addEventListener('mouseenter', () => clearTimeout(removeTimer));
    toast.addEventListener('mouseleave', () => {
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode === container) {
                    toast.remove();
                }
            }, 300);
        }, duration);
    });
}

// ============================================
// Form Validation
// ============================================

function validateForm(formData) {
    const errors = [];
    
    if (!formData.name.trim()) {
        errors.push('Employee name is required');
    } else if (formData.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters');
    }
    
    if (!formData.type) {
        errors.push('Employee type is required');
    }
    
    if (!formData.clothes || formData.clothes < 0) {
        errors.push('Valid number of garments is required (minimum 0)');
    }
    
    if (!formData.date) {
        errors.push('Work date is required');
    } else {
        const selectedDate = new Date(formData.date);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        
        if (selectedDate > today) {
            errors.push('Date cannot be in the future');
        }
    }
    
    if (!formData.startTime) errors.push('Start time is required');
    if (!formData.breakTime) errors.push('Break time is required');
    if (!formData.endTime) errors.push('End time is required');
    
    if (formData.startTime && formData.endTime && formData.endTime <= formData.startTime) {
        errors.push('End time must be after start time');
    }
    
    if (formData.startTime && formData.breakTime && formData.breakTime <= formData.startTime) {
        errors.push('Break time must be after start time');
    }
    
    if (formData.endTime && formData.breakTime && formData.endTime <= formData.breakTime) {
        errors.push('Break time must be before end time');
    }
    
    // Check for duplicate entry (same name and date)
    if (formData.name && formData.date && !DOM.editId.value) {
        const isDuplicate = AppState.employees.some(emp => 
            emp.name.toLowerCase() === formData.name.toLowerCase().trim() &&
            emp.date === formData.date
        );
        
        if (isDuplicate) {
            errors.push(`Employee "${formData.name}" already has an entry for ${formatDate(formData.date)}`);
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
            
            // Update backup time display
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
        
        // Try to recover with default data
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
        
        // Show save indicator
        showToast('Data saved', 'save', 2000);
        return true;
    } catch (error) {
        console.error('Error saving data:', error);
        
        if (error.name === 'QuotaExceededError') {
            showToast('Storage is full. Please export and clear some data.', 'error');
        } else {
            showToast(`Error saving data: ${error.message}`, 'error');
        }
        
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
        showToast(`Employee "${employee.name}" added successfully`, 'success');
        return true;
    }
    return false;
}

function updateEmployee(id, formData) {
    const index = AppState.employees.findIndex(emp => emp.id === id);
    if (index !== -1) {
        const oldEmployee = AppState.employees[index];
        
        // Check for duplicates (excluding current employee)
        const isDuplicate = AppState.employees.some((emp, idx) => 
            idx !== index &&
            emp.name.toLowerCase() === formData.name.toLowerCase().trim() &&
            emp.date === formData.date
        );
        
        if (isDuplicate) {
            showToast(`Employee "${formData.name}" already has an entry for ${formatDate(formData.date)}`, 'error');
            return false;
        }
        
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
            showToast(`Employee "${updatedEmployee.name}" updated successfully`, 'success');
            cancelEditMode();
            return true;
        }
    }
    return false;
}

function deleteEmployee(id) {
    const employee = AppState.employees.find(emp => emp.id === id);
    if (!employee) return false;
    
    if (confirm(`Are you sure you want to delete employee "${employee.name}"?\nThis action cannot be undone.`)) {
        const index = AppState.employees.findIndex(emp => emp.id === id);
        if (index !== -1) {
            AppState.employees.splice(index, 1);
            
            if (saveData()) {
                updateUI();
                updateStats();
                showToast(`Employee "${employee.name}" deleted`, 'success');
                return true;
            }
        }
    }
    return false;
}

function clearAllData() {
    if (AppState.employees.length === 0 && Object.keys(AppState.dailyEntries).length === 0) {
        showToast('No data to clear', 'warning');
        return;
    }
    
    const employeeCount = AppState.employees.length;
    const dailyCount = Object.keys(AppState.dailyEntries).length;
    let message = `Are you sure you want to delete all data?\n\n`;
    
    if (employeeCount > 0) message += `• ${employeeCount} employee records\n`;
    if (dailyCount > 0) message += `• ${dailyCount} days of daily entries\n`;
    message += `\nThis action cannot be undone.`;
    
    if (confirm(message)) {
        AppState.employees = [];
        AppState.dailyEntries = {};
        AppState.nextId = 1;
        if (saveData()) {
            updateUI();
            updateStats();
            showToast('All data cleared successfully', 'success');
        }
    }
}

function clearDailyEntries() {
    const today = new Date().toISOString().split('T')[0];
    const todayEntries = AppState.dailyEntries[today] || {};
    const entryCount = Object.keys(todayEntries).length;
    
    if (entryCount === 0) {
        showToast('No daily entries for today', 'warning');
        return;
    }
    
    if (confirm(`Clear ${entryCount} daily entries for ${formatDate(today)}?\nThis action cannot be undone.`)) {
        delete AppState.dailyEntries[today];
        if (saveData()) {
            updateDailyTable();
            showToast('Today\'s entries cleared successfully', 'success');
        }
    }
}

function importData(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            // Validate data structure
            if (!data || typeof data !== 'object') {
                throw new Error('Invalid file format');
            }
            
            if (!data.employees || !Array.isArray(data.employees)) {
                throw new Error('Invalid data structure: employees array missing');
            }
            
            // Additional validation
            const isValidEmployee = (emp) => {
                return emp && 
                       typeof emp.name === 'string' &&
                       typeof emp.type === 'string' &&
                       !isNaN(parseInt(emp.clothes));
            };
            
            const invalidEmployees = data.employees.filter(emp => !isValidEmployee(emp));
            if (invalidEmployees.length > 0) {
                throw new Error(`Found ${invalidEmployees.length} invalid employee records`);
            }
            
            if (confirm(`Import ${data.employees.length} employee records?\nThis will replace all current data.`)) {
                AppState.employees = data.employees;
                AppState.nextId = data.nextId || 1;
                AppState.dailyEntries = data.dailyEntries || {};
                if (saveData()) {
                    updateUI();
                    updateStats();
                    showToast(`Imported ${data.employees.length} employee records successfully`, 'success');
                }
            }
        } catch (error) {
            console.error('Import error:', error);
            showToast(`Error importing data: ${error.message}`, 'error');
        }
    };
    reader.onerror = () => {
        showToast('Error reading file', 'error');
    };
    reader.readAsText(file);
}

function updateStorageInfo() {
    try {
        const data = localStorage.getItem('garmentEmployees');
        const size = data ? (data.length / 1024).toFixed(2) : '0';
        if (DOM.settingsStorage) {
            DOM.settingsStorage.textContent = `${size} KB`;
        }
        
        const lastBackup = localStorage.getItem('lastBackup');
        if (lastBackup && DOM.settingsBackup) {
            DOM.settingsBackup.textContent = formatDateTime(lastBackup);
        }
        
        // Check storage usage
        const used = JSON.stringify(localStorage).length / 1024;
        const limit = 5120; // 5MB typical limit
        
        if (used > limit * 0.8) {
            showToast(`Storage is almost full (${(used/limit*100).toFixed(1)}%). Consider exporting data.`, 'warning');
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
    if (employee) {
        DOM.editId.value = employee.id;
        DOM.employeeName.value = employee.name;
        DOM.dailyClothes.value = employee.clothes;
        DOM.workDate.value = employee.date;
        DOM.startTime.value = employee.startTime;
        DOM.breakTime.value = employee.breakTime;
        DOM.endTime.value = employee.endTime;
        DOM.notes.value = employee.notes || '';
        
        // Reset all radio buttons first
        document.querySelectorAll('input[name="employeeType"]').forEach(radio => {
            radio.checked = false;
        });
        
        // Check the correct radio button
        const correctRadio = document.querySelector(`input[name="employeeType"][value="${employee.type}"]`);
        if (correctRadio) {
            correctRadio.checked = true;
        }
        
        DOM.submitForm.style.display = 'none';
        DOM.updateForm.style.display = 'block';
        DOM.cancelEdit.style.display = 'inline-flex';
        
        showSection('form');
        updateTimeSummary();
        
        showToast(`Editing ${employee.name}`, 'info');
    }
}

function cancelEditMode() {
    DOM.editId.value = '';
    DOM.submitForm.style.display = 'block';
    DOM.updateForm.style.display = 'none';
    DOM.cancelEdit.style.display = 'none';
    
    // Properly reset the form including radio buttons
    if (DOM.employeeForm) {
        DOM.employeeForm.reset();
    }
    
    // Manually uncheck radio buttons
    document.querySelectorAll('input[name="employeeType"]').forEach(radio => {
        radio.checked = false;
    });
    
    updateForm();
    showToast('Edit cancelled', 'info');
}

// ============================================
// Daily Entry System - COMPLETELY FIXED
// ============================================

function initDailyEntry() {
    const today = new Date().toISOString().split('T')[0];
    if (DOM.todayDate) {
        DOM.todayDate.textContent = formatDate(today);
    }
    if (DOM.dailyDate) {
        DOM.dailyDate.value = today;
        DOM.dailyDate.max = today;
        
        // Add event listener for date change
        DOM.dailyDate.addEventListener('change', handleDailyDateChange);
    }
    AppState.selectedDate = today;
    
    // Initialize daily entries for today if not exists
    if (!AppState.dailyEntries[today]) {
        AppState.dailyEntries[today] = {};
    }
    
    loadDailyEntries();
    createDailyModal();
}

function handleDailyDateChange() {
    AppState.selectedDate = DOM.dailyDate.value;
    loadDailyEntries();
}

function loadDailyEntries() {
    const date = DOM.dailyDate ? DOM.dailyDate.value : AppState.selectedDate;
    if (!date) return;
    
    // Ensure data structure exists for this date
    if (!AppState.dailyEntries[date]) {
        AppState.dailyEntries[date] = {};
    }
    
    updateDailyTable();
}

// FIXED: Daily table now correctly displays ALL unique employees
function updateDailyTable() {
    const date = DOM.dailyDate ? DOM.dailyDate.value : AppState.selectedDate;
    const dailyData = AppState.dailyEntries[date] || {};
    
    // FIX: Get ALL unique employee names from AppState.employees
    const allEmployees = [];
    AppState.employees.forEach(emp => {
        if (!allEmployees.includes(emp.name)) {
            allEmployees.push(emp.name);
        }
    });
    
    // Sort alphabetically
    allEmployees.sort();
    
    // Update "Add All" button state
    if (DOM.addAllToday) {
        if (allEmployees.length === 0) {
            DOM.addAllToday.disabled = true;
            DOM.addAllToday.title = 'No employees available';
        } else {
            DOM.addAllToday.disabled = false;
            DOM.addAllToday.title = `Add all ${allEmployees.length} employees`;
        }
    }
    
    // Update total employees count
    if (DOM.totalEmployees) {
        DOM.totalEmployees.textContent = allEmployees.length;
    }
    
    if (allEmployees.length === 0) {
        if (DOM.dailyEmpty) {
            DOM.dailyEmpty.classList.add('show');
        }
        if (DOM.dailyTableBody) {
            DOM.dailyTableBody.innerHTML = '';
        }
        updateDailyStats();
        return;
    }
    
    if (DOM.dailyEmpty) {
        DOM.dailyEmpty.classList.remove('show');
    }
    
    let html = '';
    allEmployees.forEach(employeeName => {
        const entry = dailyData[employeeName] || {
            clothes: 0,
            startTime: '09:00',
            breakTime: '13:00',
            endTime: '17:00',
            notes: ''
        };
        
        const netHours = calculateNetHours(entry.startTime, entry.breakTime, entry.endTime);
        const breakDuration = calculateActualBreakDuration(entry.startTime, entry.breakTime, entry.endTime);
        
        html += `
            <tr>
                <td>
                    <div class="employee-info">
                        <strong>${employeeName}</strong>
                    </div>
                </td>
                <td>
                    <span class="badge ${getEmployeeTypeClass(employeeName)}">${getEmployeeType(employeeName)}</span>
                </td>
                <td>
                    <input type="number" class="daily-input" 
                           value="${entry.clothes}" 
                           min="0" 
                           data-employee="${employeeName}"
                           placeholder="0"
                           aria-label="Garments for ${employeeName}">
                </td>
                <td>
                    <div class="time-cell">
                        <small>${formatTime(entry.startTime)} - ${formatTime(entry.endTime)}</small>
                        <div>Break: ${formatTime(entry.breakTime)} (${formatHours(breakDuration)}h)</div>
                    </div>
                </td>
                <td>
                    <span class="text-primary">${formatHours(netHours)}h</span>
                </td>
                <td>
                    <div class="actions">
                        <button class="action-btn edit" onclick="openDailyModal('${employeeName.replace(/'/g, "\\'")}')" 
                                title="Edit Times" aria-label="Edit times for ${employeeName}">
                            <i class="fas fa-clock"></i>
                        </button>
                        <button class="action-btn delete" onclick="removeDailyEntry('${employeeName.replace(/'/g, "\\'")}')" 
                                title="Remove" aria-label="Remove ${employeeName}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    if (DOM.dailyTableBody) {
        DOM.dailyTableBody.innerHTML = html;
    }
    
    // Add input change listeners
    document.querySelectorAll('.daily-input').forEach(input => {
        input.addEventListener('change', function() {
            const employeeName = this.getAttribute('data-employee');
            const clothes = parseInt(this.value) || 0;
            saveDailyGarment(employeeName, clothes);
        });
        
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                this.blur();
            }
        });
    });
    
    updateDailyStats();
}

function getEmployeeType(employeeName) {
    const employee = AppState.employees.find(emp => emp.name === employeeName);
    return employee ? employee.type.charAt(0).toUpperCase() + employee.type.slice(1) : 'Unknown';
}

function getEmployeeTypeClass(employeeName) {
    const employee = AppState.employees.find(emp => emp.name === employeeName);
    if (!employee) return '';
    return employee.type === 'weekly' ? 'weekly-badge' : 
           employee.type === 'monthly' ? 'monthly-badge' : '';
}

function updateDailyStats() {
    const date = DOM.dailyDate ? DOM.dailyDate.value : AppState.selectedDate;
    const dailyData = AppState.dailyEntries[date] || {};
    
    // FIX: Use all employees count
    const allEmployees = [];
    AppState.employees.forEach(emp => {
        if (!allEmployees.includes(emp.name)) {
            allEmployees.push(emp.name);
        }
    });
    const totalEmployees = allEmployees.length;
    
    let activeCount = 0;
    let totalGarments = 0;
    let totalHours = 0;
    let totalBreakHours = 0;
    
    Object.values(dailyData).forEach(entry => {
        if (entry.clothes > 0) {
            activeCount++;
            totalGarments += entry.clothes;
            totalHours += calculateNetHours(entry.startTime, entry.breakTime, entry.endTime);
            totalBreakHours += calculateActualBreakDuration(entry.startTime, entry.breakTime, entry.endTime);
        }
    });
    
    const avgGarments = activeCount > 0 ? (totalGarments / activeCount).toFixed(1) : '0';
    const efficiency = totalHours > 0 ? (totalGarments / totalHours).toFixed(2) : '0';
    
    if (DOM.totalEmployees) DOM.totalEmployees.textContent = totalEmployees;
    if (DOM.dailyActive) DOM.dailyActive.textContent = activeCount;
    if (DOM.dailyGarments) DOM.dailyGarments.textContent = totalGarments;
    if (DOM.dailyHours) DOM.dailyHours.textContent = formatHours(totalHours);
    if (DOM.dailyAvg) DOM.dailyAvg.textContent = avgGarments;
    
    // Update footer efficiency
    if (DOM.footerEfficiency) {
        DOM.footerEfficiency.textContent = efficiency;
    }
    
    if (DOM.navDaily) {
        DOM.navDaily.textContent = activeCount;
    }
}

function saveDailyGarment(employeeName, clothes) {
    const date = DOM.dailyDate ? DOM.dailyDate.value : AppState.selectedDate;
    if (!date) return;
    
    if (!AppState.dailyEntries[date]) {
        AppState.dailyEntries[date] = {};
    }
    
    if (!AppState.dailyEntries[date][employeeName]) {
        AppState.dailyEntries[date][employeeName] = {
            clothes: 0,
            startTime: '09:00',
            breakTime: '13:00',
            endTime: '17:00',
            notes: ''
        };
    }
    
    AppState.dailyEntries[date][employeeName].clothes = clothes;
    saveData();
    updateDailyStats();
}

// Daily Modal Functions
function createDailyModal() {
    if (document.getElementById('dailyTimeModal')) return;
    
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
                        <label for="modalGarments">
                            <i class="fas fa-tshirt"></i> Garments Produced
                        </label>
                        <input type="number" id="modalGarments" min="0" placeholder="Number of garments">
                    </div>
                    <div class="time-inputs">
                        <div class="time-input-group">
                            <label for="modalStartTime">Start Time</label>
                            <input type="time" id="modalStartTime">
                        </div>
                        <div class="time-input-group">
                            <label for="modalBreakTime">Lunch Break</label>
                            <input type="time" id="modalBreakTime">
                        </div>
                        <div class="time-input-group">
                            <label for="modalEndTime">End Time</label>
                            <input type="time" id="modalEndTime">
                        </div>
                    </div>
                    <div class="input-group">
                        <label for="modalNotes">
                            <i class="fas fa-sticky-note"></i> Notes
                        </label>
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
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeDailyModal();
        }
    });
    
    // Add keyboard navigation
    modal.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeDailyModal();
        }
        if (e.key === 'Enter' && e.ctrlKey) {
            saveDailyEntry();
        }
    });
}

function openDailyModal(employeeName) {
    const date = DOM.dailyDate ? DOM.dailyDate.value : AppState.selectedDate;
    const entry = AppState.dailyEntries[date]?.[employeeName] || {
        clothes: 0,
        startTime: '09:00',
        breakTime: '13:00',
        endTime: '17:00',
        notes: ''
    };
    
    AppState.editingDailyId = employeeName;
    
    document.getElementById('modalEmployeeName').textContent = employeeName;
    document.getElementById('modalGarments').value = entry.clothes;
    document.getElementById('modalStartTime').value = entry.startTime;
    document.getElementById('modalBreakTime').value = entry.breakTime;
    document.getElementById('modalEndTime').value = entry.endTime;
    document.getElementById('modalNotes').value = entry.notes || '';
    
    const modal = document.getElementById('dailyTimeModal');
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Focus first input
    setTimeout(() => {
        document.getElementById('modalGarments').focus();
    }, 100);
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
    
    // Validate times
    if (modalStartTime.value && modalEndTime.value && modalEndTime.value <= modalStartTime.value) {
        showToast('End time must be after start time', 'error');
        return;
    }
    
    if (!AppState.dailyEntries[date]) {
        AppState.dailyEntries[date] = {};
    }
    
    AppState.dailyEntries[date][AppState.editingDailyId] = {
        clothes: parseInt(modalGarments.value) || 0,
        startTime: modalStartTime.value,
        breakTime: modalBreakTime.value,
        endTime: modalEndTime.value,
        notes: modalNotes.value
    };
    
    saveData();
    updateDailyTable();
    closeDailyModal();
    
    showToast(`Daily entry saved for ${AppState.editingDailyId}`, 'success');
}

function removeDailyEntry(employeeName) {
    const date = DOM.dailyDate ? DOM.dailyDate.value : AppState.selectedDate;
    const entry = AppState.dailyEntries[date]?.[employeeName];
    
    if (!entry) {
        showToast('Entry not found', 'warning');
        return;
    }
    
    if (confirm(`Remove daily entry for ${employeeName}?\nGarments: ${entry.clothes}`)) {
        delete AppState.dailyEntries[date][employeeName];
        
        if (Object.keys(AppState.dailyEntries[date]).length === 0) {
            delete AppState.dailyEntries[date];
        }
        
        saveData();
        updateDailyTable();
        showToast(`Entry removed for ${employeeName}`, 'success');
    }
}

function closeDailyModal() {
    const modal = document.getElementById('dailyTimeModal');
    if (modal) {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = '';
    AppState.editingDailyId = null;
}

function saveAllDailyEntries() {
    const date = DOM.dailyDate ? DOM.dailyDate.value : AppState.selectedDate;
    const dailyData = AppState.dailyEntries[date] || {};
    
    if (Object.keys(dailyData).length === 0) {
        showToast('No daily entries to save', 'warning');
        return;
    }
    
    let entriesAdded = 0;
    let skippedEntries = 0;
    
    Object.keys(dailyData).forEach(employeeName => {
        const entry = dailyData[employeeName];
        if (entry.clothes > 0) {
            const employee = AppState.employees.find(emp => emp.name === employeeName);
            const type = employee ? employee.type : 'weekly';
            
            // Check if entry already exists for this date
            const existingEntry = AppState.employees.find(emp => 
                emp.name === employeeName && emp.date === date
            );
            
            if (existingEntry) {
                skippedEntries++;
                return;
            }
            
            const newEntry = {
                id: generateId(),
                name: employeeName,
                type: type,
                clothes: entry.clothes,
                date: date,
                startTime: entry.startTime,
                breakTime: entry.breakTime,
                endTime: entry.endTime,
                notes: entry.notes || '',
                createdAt: new Date().toISOString(),
                totalHours: calculateTimeDifference(entry.startTime, entry.endTime),
                netHours: calculateNetHours(entry.startTime, entry.breakTime, entry.endTime),
                breakDuration: calculateActualBreakDuration(entry.startTime, entry.breakTime, entry.endTime)
            };
            
            AppState.employees.unshift(newEntry);
            entriesAdded++;
        }
    });
    
    if (entriesAdded > 0) {
        delete AppState.dailyEntries[date];
        
        if (saveData()) {
            updateUI();
            updateStats();
            let message = `${entriesAdded} daily entries saved successfully`;
            if (skippedEntries > 0) {
                message += ` (${skippedEntries} duplicates skipped)`;
            }
            showToast(message, 'success');
        }
    } else if (skippedEntries > 0) {
        showToast(`All entries already exist in records (${skippedEntries} found)`, 'warning');
    } else {
        showToast('No valid entries to save (garments must be > 0)', 'warning');
    }
}

function addAllToday() {
    const date = DOM.dailyDate ? DOM.dailyDate.value : AppState.selectedDate;
    
    // FIX: Get ALL unique employee names
    const allEmployees = [];
    AppState.employees.forEach(emp => {
        if (!allEmployees.includes(emp.name)) {
            allEmployees.push(emp.name);
        }
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
    showToast(`Added all ${allEmployees.length} employees for ${formatDate(date)}`, 'success');
}

// ============================================
// Export Functions - COMPLETELY FIXED
// ============================================

// FIXED: Export dropdown functionality
function toggleDailyExportMenu() {
    if (!DOM.dailyExportMenu) return;
    
    const isShowing = DOM.dailyExportMenu.classList.contains('show');
    DOM.dailyExportMenu.classList.toggle('show');
    
    // Update aria-expanded
    if (DOM.dailyExportButton) {
        DOM.dailyExportButton.setAttribute('aria-expanded', isShowing ? 'false' : 'true');
    }
    
    if (!isShowing) {
        // Add click outside listener
        setTimeout(() => {
            document.addEventListener('click', closeExportMenuOnClickOutside);
        }, 10);
    } else {
        // Remove listener if closing
        document.removeEventListener('click', closeExportMenuOnClickOutside);
    }
}

function closeExportMenuOnClickOutside(e) {
    if (DOM.dailyExportMenu && !DOM.dailyExportMenu.contains(e.target)) {
        if (DOM.dailyExportButton && !DOM.dailyExportButton.contains(e.target)) {
            DOM.dailyExportMenu.classList.remove('show');
            if (DOM.dailyExportButton) {
                DOM.dailyExportButton.setAttribute('aria-expanded', 'false');
            }
            document.removeEventListener('click', closeExportMenuOnClickOutside);
        }
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
        let activeCount = 0;
        let totalGarments = 0;
        let totalHours = 0;
        let totalBreakHours = 0;
        
        const tableData = [];
        Object.keys(dailyData).forEach(employeeName => {
            const entry = dailyData[employeeName];
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
        doc.text(`Total Employees: ${Object.keys(dailyData).length}`, 70, yPos);
        doc.text(`Active Employees: ${activeCount}`, 130, yPos);
        
        yPos += 6;
        doc.text(`Total Garments: ${totalGarments}`, 10, yPos);
        doc.text(`Total Hours: ${formatHours(totalHours)}`, 70, yPos);
        doc.text(`Total Break: ${formatHours(totalBreakHours)}`, 130, yPos);
        
        yPos += 10;
        
        // Daily Table with dynamic column widths
        if (tableData.length > 0) {
            doc.autoTable({
                head: [['Employee', 'Type', 'Garments', 'Time', 'Hours', 'Break']],
                body: tableData,
                startY: yPos,
                theme: 'grid',
                headStyles: {
                    fillColor: [37, 99, 235],
                    textColor: 255,
                    fontStyle: 'bold',
                    fontSize: 8
                },
                bodyStyles: {
                    fontSize: 7,
                    cellPadding: 2,
                    overflow: 'linebreak'
                },
                margin: { left: 10, right: 10 },
                styles: {
                    fontSize: 7,
                    cellPadding: 2,
                    lineWidth: 0.1
                },
                columnStyles: {
                    0: { cellWidth: 35 },
                    1: { cellWidth: 20 },
                    2: { cellWidth: 20 },
                    3: { cellWidth: 40 },
                    4: { cellWidth: 20 },
                    5: { cellWidth: 20 }
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
        
        // Save PDF
        const fileName = `Daily_Report_${date.replace(/-/g, '_')}.pdf`;
        doc.save(fileName);
        
        showToast('Daily PDF report generated successfully!', 'success');
        
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
        
        let totalGarments = 0;
        let totalHours = 0;
        let totalBreakHours = 0;
        
        Object.keys(dailyData).forEach(employeeName => {
            const entry = dailyData[employeeName];
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
        
        dailyDataArray.push(['']);
        dailyDataArray.push(['SUMMARY']);
        dailyDataArray.push(['Total Employees', Object.keys(dailyData).length]);
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
        XLSX.writeFile(wb, fileName);
        
        showToast('Daily Excel report generated successfully!', 'success');
        
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
        
        // Summary Section
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
            
            const weeklyData = weekly.map(emp => [
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
                headStyles: {
                    fillColor: [37, 99, 235],
                    textColor: 255,
                    fontStyle: 'bold',
                    fontSize: 8
                },
                bodyStyles: {
                    fontSize: 7,
                    cellPadding: 2
                },
                margin: { left: 10, right: 10 },
                styles: {
                    fontSize: 7,
                    cellPadding: 2,
                    lineWidth: 0.1
                },
                columnStyles: {
                    0: { cellWidth: 35 },
                    1: { cellWidth: 25 },
                    2: { cellWidth: 20 },
                    3: { cellWidth: 35 },
                    4: { cellWidth: 20 },
                    5: { cellWidth: 20 }
                }
            });
            
            yPos = doc.lastAutoTable.finalY + 10;
        }
        
        // Monthly Employees Table
        if (monthly.length > 0) {
            if (yPos > 200) {
                doc.addPage();
                yPos = 20;
            }
            
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(124, 58, 237);
            doc.text('MONTHLY EMPLOYEES', 10, yPos);
            
            const monthlyData = monthly.map(emp => [
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
                headStyles: {
                    fillColor: [124, 58, 237],
                    textColor: 255,
                    fontStyle: 'bold',
                    fontSize: 8
                },
                bodyStyles: {
                    fontSize: 7,
                    cellPadding: 2
                },
                margin: { left: 10, right: 10 },
                styles: {
                    fontSize: 7,
                    cellPadding: 2,
                    lineWidth: 0.1
                },
                columnStyles: {
                    0: { cellWidth: 35 },
                    1: { cellWidth: 25 },
                    2: { cellWidth: 20 },
                    3: { cellWidth: 35 },
                    4: { cellWidth: 20 },
                    5: { cellWidth: 20 }
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
            doc.text('© Garment Management System v3.2.2', pageWidth / 2, 295, { align: 'center' });
        }
        
        const fileName = `Garment_Report_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);
        
        showToast('Complete PDF report generated successfully!', 'success');
        
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
        
        const weekly = AppState.employees.filter(e => e.type === 'weekly');
        const monthly = AppState.employees.filter(e => e.type === 'monthly');
        
        const wb = XLSX.utils.book_new();
        wb.Props = {
            Title: "Garment Worker Management Report",
            Author: "Garment Management System",
            CreatedDate: new Date()
        };
        
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
            
            // Summary row
            const weeklyTotalGarments = weekly.reduce((sum, emp) => sum + emp.clothes, 0);
            const weeklyTotalHours = weekly.reduce((sum, emp) => sum + (emp.netHours || 0), 0);
            weeklyData.push(['']);
            weeklyData.push(['WEEKLY SUMMARY']);
            weeklyData.push(['Total Employees', weekly.length]);
            weeklyData.push(['Total Garments', weeklyTotalGarments]);
            weeklyData.push(['Total Hours', parseFloat(weeklyTotalHours.toFixed(2))]);
            weeklyData.push(['Average Garments/Employee', parseFloat((weeklyTotalGarments / weekly.length).toFixed(1))]);
            weeklyData.push(['Efficiency', weeklyTotalHours > 0 ? parseFloat((weeklyTotalGarments / weeklyTotalHours).toFixed(2)) : 0]);
            
            const wsWeekly = XLSX.utils.aoa_to_sheet(weeklyData);
            
            // Auto-size columns
            const colWidths = weeklyData.reduce((widths, row) => {
                row.forEach((cell, colIndex) => {
                    const length = cell ? cell.toString().length : 0;
                    if (!widths[colIndex] || length > widths[colIndex]) {
                        widths[colIndex] = length;
                    }
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
            
            // Summary row
            const monthlyTotalGarments = monthly.reduce((sum, emp) => sum + emp.clothes, 0);
            const monthlyTotalHours = monthly.reduce((sum, emp) => sum + (emp.netHours || 0), 0);
            monthlyData.push(['']);
            monthlyData.push(['MONTHLY SUMMARY']);
            monthlyData.push(['Total Employees', monthly.length]);
            monthlyData.push(['Total Garments', monthlyTotalGarments]);
            monthlyData.push(['Total Hours', parseFloat(monthlyTotalHours.toFixed(2))]);
            monthlyData.push(['Average Garments/Employee', parseFloat((monthlyTotalGarments / monthly.length).toFixed(1))]);
            monthlyData.push(['Efficiency', monthlyTotalHours > 0 ? parseFloat((monthlyTotalGarments / monthlyTotalHours).toFixed(2)) : 0]);
            
            const wsMonthly = XLSX.utils.aoa_to_sheet(monthlyData);
            
            // Auto-size columns
            const colWidths = monthlyData.reduce((widths, row) => {
                row.forEach((cell, colIndex) => {
                    const length = cell ? cell.toString().length : 0;
                    if (!widths[colIndex] || length > widths[colIndex]) {
                        widths[colIndex] = length;
                    }
                });
                return widths;
            }, []);
            
            wsMonthly['!cols'] = colWidths.map(width => ({ wch: Math.min(width + 2, 50) }));
            
            XLSX.utils.book_append_sheet(wb, wsMonthly, "Monthly Employees");
        }
        
        const fileName = `Garment_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, fileName);
        
        showToast('Complete Excel report generated successfully!', 'success');
        
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
                version: '3.2.2'
            },
            employees: AppState.employees,
            nextId: AppState.nextId,
            dailyEntries: AppState.dailyEntries
        };
        
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `garment_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
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
    
    // Update sort indicators
    updateSortIndicators(type);
    
    const sortConfig = AppState.sortConfig[type];
    employees.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        if (sortConfig.key === 'date') {
            aValue = new Date(a.date);
            bValue = new Date(b.date);
        }
        
        if (sortConfig.key === 'clothes' || sortConfig.key === 'netHours' || sortConfig.key === 'breakDuration') {
            aValue = parseFloat(aValue) || 0;
            bValue = parseFloat(bValue) || 0;
        }
        
        if (sortConfig.direction === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });
    
    const currentPage = AppState.currentPage[type];
    const totalPages = Math.ceil(employees.length / AppState.itemsPerPage);
    const startIndex = (currentPage - 1) * AppState.itemsPerPage;
    const endIndex = startIndex + AppState.itemsPerPage;
    const pageEmployees = employees.slice(startIndex, endIndex);
    
    if (pageEmployees.length === 0) {
        tableBody.innerHTML = '';
        emptyState.classList.add('show');
        updatePaginationInfo(type, 0, employees.length, currentPage, totalPages);
        return;
    }
    
    emptyState.classList.remove('show');
    
    tableBody.innerHTML = pageEmployees.map(employee => `
        <tr>
            <td>
                <div class="employee-info">
                    <strong>${employee.name}</strong>
                    ${employee.notes ? `<small class="text-muted">${employee.notes}</small>` : ''}
                </div>
            </td>
            <td>${formatDate(employee.date)}</td>
            <td>
                <span class="badge ${type}-badge">${employee.clothes}</span>
            </td>
            <td>
                <span class="text-primary">${formatHours(employee.netHours || 0)}h</span>
                <small class="text-muted d-block">${formatTime(employee.startTime)} - ${formatTime(employee.endTime)}</small>
                ${employee.breakDuration ? `<small class="text-muted d-block">Break: ${formatHours(employee.breakDuration)}h</small>` : ''}
            </td>
            <td>
                <div class="actions">
                    <button class="action-btn edit" onclick="editEmployee('${employee.id}')" title="Edit" aria-label="Edit ${employee.name}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteEmployee('${employee.id}')" title="Delete" aria-label="Delete ${employee.name}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    updatePaginationInfo(type, pageEmployees.length, employees.length, currentPage, totalPages);
    updatePaginationButtons(type, currentPage, totalPages);
    
    // Update page info
    if (pageInfo) {
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    }
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
    
    if (prevBtn) {
        prevBtn.disabled = currentPage <= 1;
        prevBtn.setAttribute('aria-disabled', currentPage <= 1);
    }
    if (nextBtn) {
        nextBtn.disabled = currentPage >= totalPages;
        nextBtn.setAttribute('aria-disabled', currentPage >= totalPages);
    }
}

function updateForm() {
    const today = new Date().toISOString().split('T')[0];
    if (DOM.workDate && !DOM.workDate.value) {
        DOM.workDate.value = today;
    }
    if (DOM.workDate) {
        DOM.workDate.max = today;
    }
    
    if (DOM.startTime && !DOM.startTime.value) {
        DOM.startTime.value = '09:00';
        DOM.breakTime.value = '13:00';
        DOM.endTime.value = '17:00';
        updateTimeSummary();
    }
    
    // Set focus to first input for better UX
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
    
    if (DOM.weeklyCount) DOM.weeklyCount.textContent = weeklyEmployees.length;
    if (DOM.weeklyGarments) DOM.weeklyGarments.textContent = weeklyClothes;
    if (DOM.weeklyHours) DOM.weeklyHours.textContent = formatHours(weeklyHours);
    if (DOM.weeklyAvg) DOM.weeklyAvg.textContent = weeklyAvgClothes;
    
    const monthlyClothes = monthlyEmployees.reduce((sum, emp) => sum + emp.clothes, 0);
    const monthlyHours = monthlyEmployees.reduce((sum, emp) => sum + (emp.netHours || 0), 0);
    const monthlyAvgClothes = monthlyEmployees.length > 0 ? (monthlyClothes / monthlyEmployees.length).toFixed(1) : '0';
    
    if (DOM.monthlyCount) DOM.monthlyCount.textContent = monthlyEmployees.length;
    if (DOM.monthlyGarments) DOM.monthlyGarments.textContent = monthlyClothes;
    if (DOM.monthlyHours) DOM.monthlyHours.textContent = formatHours(monthlyHours);
    if (DOM.monthlyAvg) DOM.monthlyAvg.textContent = monthlyAvgClothes;
    
    const totalClothes = weeklyClothes + monthlyClothes;
    const totalHours = weeklyHours + monthlyHours;
    const efficiency = totalHours > 0 ? (totalClothes / totalHours).toFixed(2) : '0';
    
    if (DOM.desktopTotal) DOM.desktopTotal.textContent = AppState.employees.length;
    if (DOM.desktopGarments) DOM.desktopGarments.textContent = totalClothes;
    if (DOM.desktopHours) DOM.desktopHours.textContent = formatHours(totalHours);
    if (DOM.footerTotal) DOM.footerTotal.textContent = AppState.employees.length;
    if (DOM.footerGarments) DOM.footerGarments.textContent = totalClothes;
    if (DOM.footerEfficiency) DOM.footerEfficiency.textContent = efficiency;
    
    if (DOM.settingsTotal) DOM.settingsTotal.textContent = AppState.employees.length;
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
// Navigation Management - ACCESSIBILITY FIXED
// ============================================

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
    });
    
    // Update navigation links
    document.querySelectorAll('.nav-link, .nav-item, .desktop-nav-link').forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
    });
    
    // Show selected section
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');
        section.style.display = 'block';
        
        AppState.currentSection = sectionId;
        
        // Update active navigation links
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        const desktopNavLink = document.querySelector(`.desktop-nav-link[href="#${sectionId}"]`);
        const navItem = document.querySelector(`.nav-item[href="#${sectionId}"]`);
        
        if (navLink) {
            navLink.classList.add('active');
            navLink.setAttribute('aria-current', 'page');
        }
        if (desktopNavLink) {
            desktopNavLink.classList.add('active');
            desktopNavLink.setAttribute('aria-current', 'page');
        }
        if (navItem) {
            navItem.classList.add('active');
            navItem.setAttribute('aria-current', 'page');
        }
        
        // Hide mobile menu
        hideMobileMenu();
        
        // Close export menu if open
        if (DOM.dailyExportMenu) {
            DOM.dailyExportMenu.classList.remove('show');
            if (DOM.dailyExportButton) {
                DOM.dailyExportButton.setAttribute('aria-expanded', 'false');
            }
        }
        
        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Update URL hash without scrolling
        window.history.replaceState(null, null, `#${sectionId}`);
        
        // Update form for the new section
        if (sectionId === 'form') {
            updateForm();
        } else if (sectionId === 'daily') {
            updateDailyTable();
        }
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
    // Mobile menu toggle
    if (DOM.menuToggle) {
        DOM.menuToggle.addEventListener('click', showMobileMenu);
        DOM.menuToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                showMobileMenu();
            }
        });
    }
    
    if (DOM.closeNav) {
        DOM.closeNav.addEventListener('click', hideMobileMenu);
    }
    
    // Bottom navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                const sectionId = href.substring(1);
                showSection(sectionId);
                hideMobileMenu();
            }
        });
        
        // Keyboard navigation
        link.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                link.click();
            }
        });
    });
    
    // Side navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                const sectionId = href.substring(1);
                showSection(sectionId);
                hideMobileMenu();
            }
        });
        
        // Keyboard navigation
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                item.click();
            }
        });
    });
    
    // Desktop navigation
    if (DOM.desktopNavLinks) {
        DOM.desktopNavLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const href = this.getAttribute('href');
                if (href && href.startsWith('#')) {
                    const sectionId = href.substring(1);
                    showSection(sectionId);
                }
            });
            
            // Keyboard navigation
            link.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    link.click();
                }
            });
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (DOM.mobileNav && DOM.mobileNav.classList.contains('active') &&
            !DOM.mobileNav.contains(e.target) && 
            !DOM.menuToggle.contains(e.target)) {
            hideMobileMenu();
        }
    });
    
    // Theme toggle
    if (DOM.mobileThemeToggle) {
        DOM.mobileThemeToggle.addEventListener('click', toggleTheme);
        DOM.mobileThemeToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleTheme();
            }
        });
    }
    
    if (DOM.navThemeToggle) {
        DOM.navThemeToggle.addEventListener('click', toggleTheme);
    }
    
    if (DOM.desktopThemeToggle) {
        DOM.desktopThemeToggle.addEventListener('click', toggleTheme);
        DOM.desktopThemeToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleTheme();
            }
        });
    }
    
    // Handle hash change
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash.substring(1);
        if (hash && ['form', 'daily', 'weekly', 'monthly', 'export', 'settings'].includes(hash)) {
            setTimeout(() => showSection(hash), 100);
        }
    });
    
    // Handle initial hash
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        if (hash && ['form', 'daily', 'weekly', 'monthly', 'export', 'settings'].includes(hash)) {
            setTimeout(() => showSection(hash), 100);
        }
    }
    
    // Escape key to close modals/menus
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (DOM.dailyExportMenu && DOM.dailyExportMenu.classList.contains('show')) {
                DOM.dailyExportMenu.classList.remove('show');
                if (DOM.dailyExportButton) {
                    DOM.dailyExportButton.setAttribute('aria-expanded', 'false');
                }
            }
            closeDailyModal();
            hideMobileMenu();
        }
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
                // Manually reset radio buttons
                document.querySelectorAll('input[name="employeeType"]').forEach(radio => {
                    radio.checked = false;
                });
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
            if (DOM.employeeForm) {
                DOM.employeeForm.reset();
            }
            // Manually reset radio buttons
            document.querySelectorAll('input[name="employeeType"]').forEach(radio => {
                radio.checked = false;
            });
            updateForm();
            cancelEditMode();
            showToast('Form cleared', 'info');
        });
    }
    
    // Cancel edit
    if (DOM.cancelEdit) {
        DOM.cancelEdit.addEventListener('click', cancelEditMode);
    }
    
    // Time input changes
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
    
    // Add all today
    if (DOM.addAllToday) {
        DOM.addAllToday.addEventListener('click', addAllToday);
    }
    
    // Save all daily entries
    if (DOM.saveDailyEntries) {
        DOM.saveDailyEntries.addEventListener('click', saveAllDailyEntries);
    }
    
    // Import file
    const importFile = document.getElementById('importFile');
    if (importFile) {
        importFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 5 * 1024 * 1024) { // 5MB limit
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
    
    // Table sorting with visual feedback
    document.querySelectorAll('[data-sort]').forEach(th => {
        th.addEventListener('click', () => {
            const table = th.closest('.data-table').id;
            const type = table.includes('weekly') ? 'weekly' : 'monthly';
            const key = th.dataset.sort;
            
            if (AppState.sortConfig[type].key === key) {
                AppState.sortConfig[type].direction = 
                    AppState.sortConfig[type].direction === 'asc' ? 'desc' : 'asc';
            } else {
                AppState.sortConfig[type] = { key, direction: 'asc' };
            }
            
            AppState.currentPage[type] = 1; // Reset to first page when sorting
            updateTable(type);
        });
        
        // Keyboard support
        th.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                th.click();
            }
        });
    });
    
    // Set current year in footer
    const currentYear = document.getElementById('currentYear');
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
    
    // Auto-save indicator
    setInterval(() => {
        if (AppState.lastSaveTime && (new Date() - AppState.lastSaveTime) > 30000) {
            // Save every 30 seconds if there are changes
            saveData();
        }
    }, 30000);
    
    // Window resize handling
    window.addEventListener('resize', () => {
        // Update table responsiveness
        updateDailyTable();
    });
}

// ============================================
// Initialize Application
// ============================================

function init() {
    console.log('Initializing Garment Management System v3.2.2');
    
    // Initialize DOM cache
    initDOM();
    
    initTheme();
    setupNavigation();
    setupEventListeners();
    loadData();
    updateForm();
    initDailyEntry();
    
    // Create save indicator
    createSaveIndicator();
    
    // Initial section based on hash
    const hash = window.location.hash.substring(1);
    if (hash && ['form', 'daily', 'weekly', 'monthly', 'export', 'settings'].includes(hash)) {
        setTimeout(() => showSection(hash), 100);
    } else {
        showSection('form');
    }
    
    // Show welcome message
    setTimeout(() => {
        showToast('Garment Management System v3.2.2 loaded successfully', 'success', 3000);
    }, 1000);
    
    // Add keyboard shortcuts help
    document.addEventListener('keydown', function(e) {
        // Ctrl+S to save
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            saveData();
        }
        // Ctrl+E to export
        if (e.ctrlKey && e.key === 'e') {
            e.preventDefault();
            showSection('export');
        }
    });
}

function createSaveIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'saveIndicator';
    indicator.className = 'save-indicator';
    indicator.innerHTML = '<i class="fas fa-save"></i> <span>Auto-saved</span>';
    indicator.style.display = 'none';
    document.body.appendChild(indicator);
    
    DOM.saveIndicator = indicator;
}

// Start the application
document.addEventListener('DOMContentLoaded', init);

// Global functions for HTML onclick handlers
window.clearAllData = clearAllData;
window.clearDailyEntries = clearDailyEntries;
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

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AppState,
        calculateNetHours,
        calculateTimeDifference,
        formatDate,
        formatTime
    };
}
