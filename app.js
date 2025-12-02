// ============================================
// Garment Worker Management System
// Version 3.1.0 - Complete Production System
// ============================================

// Application State
const AppState = {
    employees: [],          // Permanent employee records
    dailyEntries: {},       // Temporary daily entries by date
    employeeList: [],       // List of all employee names
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
    editingId: null,        // For editing employee records
    selectedDate: null      // Current date for daily entries
};

// DOM Elements Cache
const DOM = {
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
    addAllToday: document.getElementById('addAllToday'),
    saveDailyEntries: document.getElementById('saveDailyEntries'),
    dailyTableBody: document.getElementById('dailyTableBody'),
    dailyEmpty: document.getElementById('dailyEmpty'),
    dailyTableContainer: document.getElementById('dailyTableContainer'),
    
    // Stats elements
    dailyActive: document.getElementById('dailyActive'),
    dailyGarments: document.getElementById('dailyGarments'),
    dailyHours: document.getElementById('dailyHours'),
    dailyAvg: document.getElementById('dailyAvg'),
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
    exportMenu: document.getElementById('exportMenu'),
    
    // Pagination elements
    prevWeekly: document.getElementById('prevWeekly'),
    nextWeekly: document.getElementById('nextWeekly'),
    prevMonthly: document.getElementById('prevMonthly'),
    nextMonthly: document.getElementById('nextMonthly'),
    weeklyShowing: document.getElementById('weeklyShowing'),
    weeklyTotal: document.getElementById('weeklyTotal'),
    monthlyShowing: document.getElementById('monthlyShowing'),
    monthlyTotal: document.getElementById('monthlyTotal'),
    
    // Time calculation elements
    totalHours: document.getElementById('totalHours'),
    netHours: document.getElementById('netHours'),
    breakDuration: document.getElementById('breakDuration')
};

// ============================================
// Core Utility Functions
// ============================================

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        weekday: 'short'
    });
}

function formatTime(timeString) {
    if (!timeString) return 'N/A';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes.padStart(2, '0')} ${ampm}`;
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
    const totalHours = calculateTimeDifference(startTime, endTime);
    
    if (breakTime && startTime && endTime) {
        const breakStart = new Date(`2000-01-01T${breakTime}`);
        const workStart = new Date(`2000-01-01T${startTime}`);
        const workEnd = new Date(`2000-01-01T${endTime}`);
        
        if (breakStart >= workStart && breakStart <= workEnd) {
            return Math.max(0, totalHours - 1);
        }
    }
    
    return totalHours;
}

function formatHours(hours) {
    return parseFloat(hours).toFixed(2);
}

// ============================================
// Toast Notification System
// ============================================

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    
    const titles = {
        success: 'Success',
        error: 'Error',
        warning: 'Warning',
        info: 'Information'
    };
    
    toast.innerHTML = `
        <i class="fas fa-${icons[type]} toast-icon"></i>
        <div class="toast-content">
            <h4>${titles[type]}</h4>
            <p>${message}</p>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(toast);
    
    // Show with animation
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode === container) {
                toast.remove();
            }
        }, 300);
    }, 5000);
}

// ============================================
// Theme Management
// ============================================

function initTheme() {
    const savedTheme = localStorage.getItem('garmentTheme');
    AppState.isDarkMode = savedTheme === 'dark';
    
    if (AppState.isDarkMode) {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.add('light-theme');
    }
    
    updateThemeButtons();
}

function toggleTheme() {
    AppState.isDarkMode = !AppState.isDarkMode;
    
    if (AppState.isDarkMode) {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
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
// Data Management
// ============================================

function loadData() {
    try {
        const saved = localStorage.getItem('garmentEmployees');
        if (saved) {
            const data = JSON.parse(saved);
            AppState.employees = data.employees || [];
            AppState.nextId = data.nextId || 1;
            AppState.employeeList = data.employeeList || [];
            AppState.dailyEntries = data.dailyEntries || {};
        }
        
        updateEmployeeList();
        updateUI();
        updateStats();
        updateDailyEntries();
        
    } catch (error) {
        console.error('Error loading data:', error);
        showToast('Error loading saved data', 'error');
    }
}

function saveData() {
    const data = {
        employees: AppState.employees,
        nextId: AppState.nextId,
        employeeList: AppState.employeeList,
        dailyEntries: AppState.dailyEntries,
        lastSaved: new Date().toISOString()
    };
    
    try {
        localStorage.setItem('garmentEmployees', JSON.stringify(data));
        updateStorageInfo();
        return true;
    } catch (error) {
        console.error('Error saving data:', error);
        showToast('Error saving data', 'error');
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
        netHours: calculateNetHours(formData.startTime, formData.breakTime, formData.endTime)
    };
    
    // Add to employee list if not already there
    if (!AppState.employeeList.includes(employee.name)) {
        AppState.employeeList.push(employee.name);
        AppState.employeeList.sort();
    }
    
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
            updatedAt: new Date().toISOString()
        };
        
        // Update employee list if name changed
        if (oldEmployee.name !== updatedEmployee.name) {
            const oldIndex = AppState.employeeList.indexOf(oldEmployee.name);
            if (oldIndex > -1) {
                AppState.employeeList.splice(oldIndex, 1);
            }
            if (!AppState.employeeList.includes(updatedEmployee.name)) {
                AppState.employeeList.push(updatedEmployee.name);
                AppState.employeeList.sort();
            }
        }
        
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
    const index = AppState.employees.findIndex(emp => emp.id === id);
    if (index !== -1) {
        const employee = AppState.employees[index];
        
        if (confirm(`Delete employee "${employee.name}"? This action cannot be undone.`)) {
            AppState.employees.splice(index, 1);
            
            // Check if this name is still used by other employees
            const nameStillUsed = AppState.employees.some(emp => emp.name === employee.name);
            if (!nameStillUsed) {
                const nameIndex = AppState.employeeList.indexOf(employee.name);
                if (nameIndex > -1) {
                    AppState.employeeList.splice(nameIndex, 1);
                }
            }
            
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

function updateEmployeeList() {
    // Extract unique employee names from existing data
    const uniqueNames = [...new Set(AppState.employees.map(emp => emp.name))];
    AppState.employeeList = uniqueNames.sort();
}

function updateStorageInfo() {
    const data = localStorage.getItem('garmentEmployees');
    const size = data ? (data.length / 1024).toFixed(2) : '0';
    DOM.settingsStorage.textContent = `${size} KB`;
    
    const lastBackup = localStorage.getItem('lastBackup');
    if (lastBackup) {
        DOM.settingsBackup.textContent = new Date(lastBackup).toLocaleDateString();
    } else {
        DOM.settingsBackup.textContent = 'Never';
    }
}

// ============================================
// Edit Functionality
// ============================================

function editEmployee(id) {
    const employee = AppState.employees.find(emp => emp.id === id);
    if (employee) {
        // Set form to edit mode
        DOM.editId.value = employee.id;
        DOM.employeeName.value = employee.name;
        DOM.dailyClothes.value = employee.clothes;
        DOM.workDate.value = employee.date;
        DOM.startTime.value = employee.startTime;
        DOM.breakTime.value = employee.breakTime;
        DOM.endTime.value = employee.endTime;
        DOM.notes.value = employee.notes || '';
        
        // Set employee type radio button
        document.querySelectorAll('input[name="employeeType"]').forEach(radio => {
            radio.checked = radio.value === employee.type;
        });
        
        // Show update button, hide submit button
        DOM.submitForm.style.display = 'none';
        DOM.updateForm.style.display = 'block';
        DOM.cancelEdit.style.display = 'block';
        
        // Scroll to form section
        showSection('form');
        
        // Update time summary
        updateTimeSummary();
        
        showToast(`Editing ${employee.name}`, 'info');
    }
}

function cancelEditMode() {
    DOM.editId.value = '';
    DOM.submitForm.style.display = 'block';
    DOM.updateForm.style.display = 'none';
    DOM.cancelEdit.style.display = 'none';
    DOM.employeeForm.reset();
    updateForm();
}

// ============================================
// Daily Entry System
// ============================================

function initDailyEntry() {
    // Set today's date
    const today = new Date().toISOString().split('T')[0];
    DOM.todayDate.textContent = formatDate(today);
    DOM.dailyDate.value = today;
    AppState.selectedDate = today;
    
    updateDailyEntries();
}

function updateDailyEntries() {
    const date = DOM.dailyDate.value || AppState.selectedDate;
    if (!date) return;
    
    // Get or create daily entries for this date
    if (!AppState.dailyEntries[date]) {
        AppState.dailyEntries[date] = {};
    }
    
    updateDailyTable();
    updateDailyStats();
}

function updateDailyTable() {
    const date = DOM.dailyDate.value || AppState.selectedDate;
    const dailyData = AppState.dailyEntries[date] || {};
    
    if (AppState.employeeList.length === 0) {
        DOM.dailyEmpty.classList.add('show');
        DOM.dailyTableBody.innerHTML = '';
        return;
    }
    
    DOM.dailyEmpty.classList.remove('show');
    
    let html = '';
    AppState.employeeList.forEach(employeeName => {
        const entry = dailyData[employeeName] || {
            clothes: 0,
            startTime: '09:00',
            breakTime: '13:00',
            endTime: '17:00',
            notes: ''
        };
        
        const netHours = calculateNetHours(entry.startTime, entry.breakTime, entry.endTime);
        const employee = AppState.employees.find(emp => emp.name === employeeName);
        const type = employee ? employee.type : 'weekly';
        const typeColor = type === 'weekly' ? 'var(--weekly-color)' : 'var(--monthly-color)';
        
        html += `
            <tr>
                <td>
                    <div class="employee-info">
                        <strong>${employeeName}</strong>
                        ${entry.notes ? `<small>${entry.notes}</small>` : ''}
                    </div>
                </td>
                <td>
                    <span class="badge" style="background: ${typeColor}">${type.charAt(0).toUpperCase() + type.slice(1)}</span>
                </td>
                <td>
                    <input type="number" class="daily-input garments-input" 
                           value="${entry.clothes}" 
                           min="0" 
                           data-employee="${employeeName}"
                           placeholder="0"
                           onchange="updateDailyGarment('${employeeName}', this.value)">
                </td>
                <td class="time-cell">
                    <input type="time" class="daily-input time-input start-time" 
                           value="${entry.startTime}"
                           data-employee="${employeeName}"
                           data-type="startTime"
                           onchange="updateDailyTime('${employeeName}', 'startTime', this.value)">
                    <small>to</small>
                    <input type="time" class="daily-input time-input end-time" 
                           value="${entry.endTime}"
                           data-employee="${employeeName}"
                           data-type="endTime"
                           onchange="updateDailyTime('${employeeName}', 'endTime', this.value)">
                </td>
                <td>
                    <span class="text-primary" style="font-weight: 600;">${formatHours(netHours)}h</span>
                </td>
                <td>
                    <div class="actions">
                        <button class="action-btn edit" onclick="editDailyEntry('${employeeName}')" title="Edit Notes">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="removeDailyEntry('${employeeName}')" title="Remove">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    DOM.dailyTableBody.innerHTML = html;
    
    // Update today's count in navigation
    const today = new Date().toISOString().split('T')[0];
    const todayEntries = Object.keys(AppState.dailyEntries[today] || {}).length;
    DOM.navDaily.textContent = todayEntries;
    DOM.totalEmployees.textContent = AppState.employeeList.length;
}

function updateDailyGarment(employeeName, clothes) {
    const date = DOM.dailyDate.value || AppState.selectedDate;
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
    
    AppState.dailyEntries[date][employeeName].clothes = parseInt(clothes) || 0;
    saveData();
    updateDailyStats();
    
    // Show toast for non-zero entries
    if (clothes > 0) {
        showToast(`Updated garments for ${employeeName}: ${clothes}`, 'info');
    }
}

function updateDailyTime(employeeName, timeType, timeValue) {
    const date = DOM.dailyDate.value || AppState.selectedDate;
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
    
    AppState.dailyEntries[date][employeeName][timeType] = timeValue;
    
    // Auto-set break time if it's not between start and end times
    if (timeType === 'startTime' || timeType === 'endTime') {
        const entry = AppState.dailyEntries[date][employeeName];
        const start = new Date(`2000-01-01T${entry.startTime}`);
        const end = new Date(`2000-01-01T${entry.endTime}`);
        const breakTime = new Date(`2000-01-01T${entry.breakTime}`);
        
        // If break time is not between start and end, set it to middle
        if (breakTime < start || breakTime > end) {
            const middle = new Date((start.getTime() + end.getTime()) / 2);
            const hours = middle.getHours().toString().padStart(2, '0');
            const minutes = middle.getMinutes().toString().padStart(2, '0');
            entry.breakTime = `${hours}:${minutes}`;
            
            // Update the break time input if it exists
            const breakInput = document.querySelector(`input[data-employee="${employeeName}"][data-type="breakTime"]`);
            if (breakInput) {
                breakInput.value = entry.breakTime;
            }
        }
    }
    
    saveData();
    updateDailyStats();
    updateDailyTable(); // Refresh to show updated hours
    
    showToast(`Updated ${timeType} for ${employeeName}`, 'info');
}

function editDailyEntry(employeeName) {
    const date = DOM.dailyDate.value || AppState.selectedDate;
    const entry = AppState.dailyEntries[date]?.[employeeName] || {
        clothes: 0,
        startTime: '09:00',
        breakTime: '13:00',
        endTime: '17:00',
        notes: ''
    };
    
    const notes = prompt(`Enter notes for ${employeeName}:`, entry.notes || '');
    if (notes !== null) {
        entry.notes = notes.trim();
        saveData();
        updateDailyTable();
        showToast(`Notes updated for ${employeeName}`, 'success');
    }
}

function removeDailyEntry(employeeName) {
    const date = DOM.dailyDate.value || AppState.selectedDate;
    
    if (confirm(`Remove ${employeeName} from today's entries?`)) {
        if (AppState.dailyEntries[date]) {
            delete AppState.dailyEntries[date][employeeName];
            
            // If no entries left for this date, remove the date
            if (Object.keys(AppState.dailyEntries[date]).length === 0) {
                delete AppState.dailyEntries[date];
            }
            
            saveData();
            updateDailyTable();
            updateDailyStats();
            showToast(`Removed ${employeeName} from today's entries`, 'success');
        }
    }
}

function updateDailyStats() {
    const date = DOM.dailyDate.value || AppState.selectedDate;
    const dailyData = AppState.dailyEntries[date] || {};
    
    let activeCount = 0;
    let totalGarments = 0;
    let totalHours = 0;
    
    Object.values(dailyData).forEach(entry => {
        if (entry.clothes > 0) {
            activeCount++;
            totalGarments += entry.clothes;
            totalHours += calculateNetHours(entry.startTime, entry.breakTime, entry.endTime);
        }
    });
    
    DOM.dailyActive.textContent = activeCount;
    DOM.dailyGarments.textContent = totalGarments;
    DOM.dailyHours.textContent = formatHours(totalHours);
    DOM.dailyAvg.textContent = activeCount > 0 ? Math.round(totalGarments / activeCount) : '0';
}

function addAllToday() {
    const date = DOM.dailyDate.value || AppState.selectedDate;
    
    if (AppState.employeeList.length === 0) {
        showToast('No employees added yet. Add employees first.', 'warning');
        return;
    }
    
    // Clear existing entries for this date
    AppState.dailyEntries[date] = {};
    
    // Add all employees with default values
    AppState.employeeList.forEach(employeeName => {
        AppState.dailyEntries[date][employeeName] = {
            clothes: 0,
            startTime: '09:00',
            breakTime: '13:00',
            endTime: '17:00',
            notes: ''
        };
    });
    
    saveData();
    updateDailyTable();
    showToast(`Added all ${AppState.employeeList.length} employees for today`, 'success');
}

function saveAllDailyEntries() {
    const date = DOM.dailyDate.value || AppState.selectedDate;
    const dailyData = AppState.dailyEntries[date] || {};
    
    let entriesAdded = 0;
    
    Object.keys(dailyData).forEach(employeeName => {
        const entry = dailyData[employeeName];
        if (entry.clothes > 0) {
            // Find employee type from existing records or default to weekly
            const employee = AppState.employees.find(emp => emp.name === employeeName);
            const type = employee ? employee.type : 'weekly';
            
            // Create new employee entry
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
                netHours: calculateNetHours(entry.startTime, entry.breakTime, entry.endTime)
            };
            
            AppState.employees.unshift(newEntry);
            entriesAdded++;
        }
    });
    
    if (entriesAdded > 0) {
        // Clear daily entries for this date after saving
        delete AppState.dailyEntries[date];
        
        if (saveData()) {
            updateUI();
            updateStats();
            showToast(`${entriesAdded} daily entries saved as permanent records`, 'success');
            
            // Clear the daily table
            updateDailyTable();
            updateDailyStats();
        }
    } else {
        showToast('No valid entries to save. Enter garment counts first.', 'warning');
    }
}

function clearDailyEntries() {
    const date = DOM.dailyDate.value || AppState.selectedDate;
    
    if (confirm(`Clear all entries for ${formatDate(date)}? This cannot be undone.`)) {
        delete AppState.dailyEntries[date];
        saveData();
        updateDailyTable();
        updateDailyStats();
        showToast('Daily entries cleared successfully', 'success');
    }
}

// ============================================
// Export Functions
// ============================================

function exportDailyToExcel() {
    try {
        const date = DOM.dailyDate.value || AppState.selectedDate;
        const dailyData = AppState.dailyEntries[date] || {};
        
        if (Object.keys(dailyData).length === 0) {
            showToast('No daily entries to export', 'warning');
            return;
        }
        
        const wb = XLSX.utils.book_new();
        wb.Props = {
            Title: "Daily Production Report",
            Subject: `Daily Production Data - ${date}`,
            Author: "Garment Pro Management System",
            CreatedDate: new Date()
        };
        
        // Summary data
        let activeCount = 0;
        let totalGarments = 0;
        let totalHours = 0;
        
        Object.values(dailyData).forEach(entry => {
            if (entry.clothes > 0) {
                activeCount++;
                totalGarments += entry.clothes;
                totalHours += calculateNetHours(entry.startTime, entry.breakTime, entry.endTime);
            }
        });
        
        const summaryData = [
            ['DAILY PRODUCTION REPORT'],
            [`Date: ${formatDate(date)}`],
            [`Total Employees: ${AppState.employeeList.length}`],
            [`Working Today: ${activeCount}`],
            [`Total Garments: ${totalGarments}`],
            [`Total Hours: ${formatHours(totalHours)}`],
            [`Average per Employee: ${activeCount > 0 ? Math.round(totalGarments / activeCount) : 0}`],
            [''],
            ['EMPLOYEE DETAILS']
        ];
        
        const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
        
        // Merge title cells
        wsSummary['!merges'] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
            { s: { r: 1, c: 0 }, e: { r: 1, c: 5 } },
            { s: { r: 8, c: 0 }, e: { r: 8, c: 5 } }
        ];
        
        // Main data sheet
        const data = [
            ['Employee', 'Type', 'Garments', 'Start Time', 'Break Time', 'End Time', 'Net Hours', 'Notes']
        ];
        
        Object.keys(dailyData).forEach(employeeName => {
            const entry = dailyData[employeeName];
            if (entry.clothes > 0) {
                const employee = AppState.employees.find(emp => emp.name === employeeName);
                const type = employee ? employee.type.charAt(0).toUpperCase() + employee.type.slice(1) : 'Weekly';
                const netHours = calculateNetHours(entry.startTime, entry.breakTime, entry.endTime);
                
                data.push([
                    employeeName,
                    type,
                    entry.clothes,
                    formatTime(entry.startTime),
                    formatTime(entry.breakTime),
                    formatTime(entry.endTime),
                    parseFloat(netHours.toFixed(2)),
                    entry.notes || ''
                ]);
            }
        });
        
        // Add summary at the end
        data.push(['']);
        data.push(['SUMMARY']);
        data.push(['Working Today', activeCount]);
        data.push(['Total Garments', totalGarments]);
        data.push(['Total Hours', parseFloat(totalHours.toFixed(2))]);
        data.push(['Average per Employee', activeCount > 0 ? parseFloat((totalGarments / activeCount).toFixed(1)) : 0]);
        data.push(['Efficiency (Garments/Hour)', totalHours > 0 ? parseFloat((totalGarments / totalHours).toFixed(2)) : 0]);
        
        const wsData = XLSX.utils.aoa_to_sheet(data);
        
        // Set column widths
        wsData['!cols'] = [
            { wch: 25 }, // Employee
            { wch: 15 }, // Type
            { wch: 12 }, // Garments
            { wch: 15 }, // Start Time
            { wch: 15 }, // Break Time
            { wch: 15 }, // End Time
            { wch: 12 }, // Net Hours
            { wch: 30 }  // Notes
        ];
        
        // Add sheets to workbook
        XLSX.utils.book_append_sheet(wb, wsSummary, "Report Summary");
        XLSX.utils.book_append_sheet(wb, wsData, "Daily Entries");
        
        // Save Excel file
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
        const doc = new jsPDF('landscape', 'mm', 'a4');
        
        // Page dimensions
        const pageWidth = 297; // A4 landscape width
        const pageHeight = 210; // A4 landscape height
        const margin = 10; // Margin on all sides
        const contentWidth = pageWidth - (2 * margin);
        
        // Header with gradient
        const gradient = doc.context2d.createLinearGradient(0, 0, pageWidth, 0);
        gradient.addColorStop(0, '#3b82f6');
        gradient.addColorStop(1, '#1d4ed8');
        
        doc.setFillColor(59, 130, 246);
        doc.rect(0, 0, pageWidth, 30, 'F');
        
        // Title
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('GARMENT PRODUCTION REPORT', pageWidth / 2, 18, { align: 'center' });
        
        // Subtitle
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Generated: ${new Date().toLocaleDateString()} | Total Employees: ${AppState.employees.length}`, pageWidth / 2, 25, { align: 'center' });
        
        let yPos = 40;
        
        // Summary Section
        const weekly = AppState.employees.filter(e => e.type === 'weekly');
        const monthly = AppState.employees.filter(e => e.type === 'monthly');
        const weeklyClothes = weekly.reduce((s, e) => s + e.clothes, 0);
        const monthlyClothes = monthly.reduce((s, e) => s + e.clothes, 0);
        const weeklyHours = weekly.reduce((s, e) => s + e.netHours, 0);
        const monthlyHours = monthly.reduce((s, e) => s + e.netHours, 0);
        
        // Summary Box
        doc.setFillColor(248, 250, 252);
        doc.rect(margin, yPos, contentWidth, 20, 'F');
        doc.setDrawColor(226, 232, 240);
        doc.rect(margin, yPos, contentWidth, 20);
        
        doc.setTextColor(30, 41, 59);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('PRODUCTION SUMMARY', margin + 10, yPos + 8);
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        const summaryY = yPos + 15;
        doc.text(`Total Employees: ${AppState.employees.length}`, margin + 10, summaryY);
        doc.text(`Weekly: ${weekly.length}`, margin + 70, summaryY);
        doc.text(`Monthly: ${monthly.length}`, margin + 110, summaryY);
        doc.text(`Total Garments: ${weeklyClothes + monthlyClothes}`, margin + 160, summaryY);
        doc.text(`Total Hours: ${formatHours(weeklyHours + monthlyHours)}`, margin + 220, summaryY);
        
        yPos += 30;
        
        // Weekly Employees Table - FIXED COLUMN WIDTHS
        if (weekly.length > 0) {
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(59, 130, 246);
            doc.text('WEEKLY EMPLOYEES', margin, yPos);
            
            const weeklyData = weekly.map(emp => [
                emp.name.length > 20 ? emp.name.substring(0, 20) + '...' : emp.name,
                formatDate(emp.date),
                emp.clothes.toString(),
                formatTime(emp.startTime),
                formatTime(emp.endTime),
                formatHours(emp.netHours),
                emp.notes && emp.notes.length > 20 ? emp.notes.substring(0, 20) + '...' : (emp.notes || '')
            ]);
            
            doc.autoTable({
                head: [['Name', 'Date', 'Garments', 'Start', 'End', 'Hours', 'Notes']],
                body: weeklyData,
                startY: yPos + 5,
                theme: 'grid',
                headStyles: {
                    fillColor: [59, 130, 246],
                    textColor: 255,
                    fontStyle: 'bold',
                    fontSize: 9
                },
                bodyStyles: {
                    fontSize: 8,
                    cellPadding: 2,
                    overflow: 'linebreak'
                },
                alternateRowStyles: {
                    fillColor: [240, 249, 255]
                },
                margin: { left: margin, right: margin },
                styles: {
                    fontSize: 8,
                    cellPadding: 2,
                    overflow: 'linebreak',
                    lineWidth: 0.1
                },
                columnStyles: {
                    0: { cellWidth: 30 },
                    1: { cellWidth: 25 },
                    2: { cellWidth: 20 },
                    3: { cellWidth: 20 },
                    4: { cellWidth: 20 },
                    5: { cellWidth: 18 },
                    6: { cellWidth: 35 }
                },
                tableWidth: contentWidth
            });
            
            yPos = doc.lastAutoTable.finalY + 15;
        }
        
        // Monthly Employees Table - FIXED COLUMN WIDTHS
        if (monthly.length > 0) {
            if (yPos > 160) {
                doc.addPage('landscape', 'a4');
                yPos = margin;
            }
            
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(139, 92, 246);
            doc.text('MONTHLY EMPLOYEES', margin, yPos);
            
            const monthlyData = monthly.map(emp => [
                emp.name.length > 20 ? emp.name.substring(0, 20) + '...' : emp.name,
                formatDate(emp.date),
                emp.clothes.toString(),
                formatTime(emp.startTime),
                formatTime(emp.endTime),
                formatHours(emp.netHours),
                emp.notes && emp.notes.length > 20 ? emp.notes.substring(0, 20) + '...' : (emp.notes || '')
            ]);
            
            doc.autoTable({
                head: [['Name', 'Date', 'Garments', 'Start', 'End', 'Hours', 'Notes']],
                body: monthlyData,
                startY: yPos + 5,
                theme: 'grid',
                headStyles: {
                    fillColor: [139, 92, 246],
                    textColor: 255,
                    fontStyle: 'bold',
                    fontSize: 9
                },
                bodyStyles: {
                    fontSize: 8,
                    cellPadding: 2,
                    overflow: 'linebreak'
                },
                alternateRowStyles: {
                    fillColor: [249, 240, 255]
                },
                margin: { left: margin, right: margin },
                styles: {
                    fontSize: 8,
                    cellPadding: 2,
                    overflow: 'linebreak',
                    lineWidth: 0.1
                },
                columnStyles: {
                    0: { cellWidth: 30 },
                    1: { cellWidth: 25 },
                    2: { cellWidth: 20 },
                    3: { cellWidth: 20 },
                    4: { cellWidth: 20 },
                    5: { cellWidth: 18 },
                    6: { cellWidth: 35 }
                },
                tableWidth: contentWidth
            });
            
            yPos = doc.lastAutoTable.finalY + 15;
        }
        
        // Performance Summary
        if (yPos > 150) {
            doc.addPage('landscape', 'a4');
            yPos = margin;
        }
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(16, 185, 129);
        doc.text('PERFORMANCE ANALYSIS', pageWidth / 2, yPos, { align: 'center' });
        
        yPos += 10;
        
        const performanceData = [
            ['Metric', 'Weekly', 'Monthly', 'Total'],
            ['Employees', weekly.length, monthly.length, AppState.employees.length],
            ['Garments Produced', weeklyClothes, monthlyClothes, weeklyClothes + monthlyClothes],
            ['Work Hours', formatHours(weeklyHours), formatHours(monthlyHours), formatHours(weeklyHours + monthlyHours)],
            ['Avg Garments/Employee', (weeklyClothes / weekly.length || 0).toFixed(1), (monthlyClothes / monthly.length || 0).toFixed(1), ((weeklyClothes + monthlyClothes) / AppState.employees.length || 0).toFixed(1)],
            ['Efficiency (Garments/Hour)', (weeklyClothes / weeklyHours || 0).toFixed(2), (monthlyClothes / monthlyHours || 0).toFixed(2), ((weeklyClothes + monthlyClothes) / (weeklyHours + monthlyHours) || 0).toFixed(2)]
        ];
        
        doc.autoTable({
            body: performanceData,
            startY: yPos,
            theme: 'grid',
            headStyles: {
                fillColor: [16, 185, 129],
                textColor: 255,
                fontStyle: 'bold',
                fontSize: 9
            },
            bodyStyles: {
                fontSize: 8,
                cellPadding: 3
            },
            alternateRowStyles: {
                fillColor: [236, 253, 245]
            },
            margin: { left: margin + 30, right: margin + 30 },
            styles: {
                fontSize: 8,
                cellPadding: 3,
                overflow: 'linebreak'
            },
            columnStyles: {
                0: { cellWidth: 60 },
                1: { cellWidth: 35 },
                2: { cellWidth: 35 },
                3: { cellWidth: 35 }
            },
            tableWidth: contentWidth - 60
        });
        
        // Footer on all pages
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            
            // Footer line
            doc.setDrawColor(226, 232, 240);
            doc.setLineWidth(0.5);
            doc.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);
            
            // Page number
            doc.setFontSize(8);
            doc.setTextColor(148, 163, 184);
            doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 15, { align: 'center' });
            
            // Copyright
            doc.text('© Garment Pro Management System - Confidential Report', pageWidth / 2, pageHeight - 10, { align: 'center' });
        }
        
        // Save PDF
        const fileName = `Garment_Production_Report_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);
        
        showToast('Professional PDF report generated successfully!', 'success');
        
    } catch (error) {
        console.error('PDF Export Error:', error);
        showToast(`Error generating PDF: ${error.message}`, 'error');
    }
}

function exportDailyToPDF() {
    try {
        const date = DOM.dailyDate.value || AppState.selectedDate;
        const dailyData = AppState.dailyEntries[date] || {};
        
        if (Object.keys(dailyData).length === 0) {
            showToast('No daily entries to export', 'warning');
            return;
        }
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('portrait', 'mm', 'a4');
        
        // Page dimensions
        const pageWidth = 210;
        const pageHeight = 297;
        const margin = 15;
        const contentWidth = pageWidth - (2 * margin);
        
        // Header
        doc.setFillColor(59, 130, 246);
        doc.rect(0, 0, pageWidth, 35, 'F');
        
        // Title
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('DAILY PRODUCTION REPORT', pageWidth / 2, 20, { align: 'center' });
        
        // Date
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text(`Date: ${formatDate(date)}`, pageWidth / 2, 28, { align: 'center' });
        
        let yPos = 45;
        
        // Daily Summary
        let activeCount = 0;
        let totalGarments = 0;
        let totalHours = 0;
        
        Object.values(dailyData).forEach(entry => {
            if (entry.clothes > 0) {
                activeCount++;
                totalGarments += entry.clothes;
                totalHours += calculateNetHours(entry.startTime, entry.breakTime, entry.endTime);
            }
        });
        
        // Summary Box
        doc.setFillColor(248, 250, 252);
        doc.rect(margin, yPos, contentWidth, 25, 'F');
        doc.setDrawColor(226, 232, 240);
        doc.rect(margin, yPos, contentWidth, 25);
        
        doc.setTextColor(30, 41, 59);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('DAILY SUMMARY', margin + 10, yPos + 10);
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        const summaryY = yPos + 18;
        doc.text(`Working Today: ${activeCount}`, margin + 10, summaryY);
        doc.text(`Total Garments: ${totalGarments}`, margin + 70, summaryY);
        doc.text(`Total Hours: ${formatHours(totalHours)}`, margin + 130, summaryY);
        doc.text(`Avg/Employee: ${activeCount > 0 ? Math.round(totalGarments / activeCount) : 0}`, margin + 180, summaryY);
        
        yPos += 35;
        
        // Daily Entries Table
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(59, 130, 246);
        doc.text('DAILY ENTRIES', margin, yPos);
        
        const tableData = [];
        Object.keys(dailyData).forEach(employeeName => {
            const entry = dailyData[employeeName];
            if (entry.clothes > 0) {
                const employee = AppState.employees.find(emp => emp.name === employeeName);
                const type = employee ? employee.type.charAt(0).toUpperCase() + employee.type.slice(1) : 'Weekly';
                const netHours = calculateNetHours(entry.startTime, entry.breakTime, entry.endTime);
                
                tableData.push([
                    employeeName.length > 20 ? employeeName.substring(0, 20) + '...' : employeeName,
                    type,
                    entry.clothes.toString(),
                    formatTime(entry.startTime),
                    formatTime(entry.endTime),
                    formatHours(netHours),
                    entry.notes && entry.notes.length > 25 ? entry.notes.substring(0, 25) + '...' : (entry.notes || '')
                ]);
            }
        });
        
        if (tableData.length > 0) {
            doc.autoTable({
                head: [['Employee', 'Type', 'Garments', 'Start', 'End', 'Hours', 'Notes']],
                body: tableData,
                startY: yPos + 5,
                theme: 'grid',
                headStyles: {
                    fillColor: [59, 130, 246],
                    textColor: 255,
                    fontStyle: 'bold',
                    fontSize: 9
                },
                bodyStyles: {
                    fontSize: 8,
                    cellPadding: 2,
                    overflow: 'linebreak'
                },
                alternateRowStyles: {
                    fillColor: [240, 249, 255]
                },
                margin: { left: margin, right: margin },
                styles: {
                    fontSize: 8,
                    cellPadding: 2,
                    overflow: 'linebreak',
                    lineWidth: 0.1
                },
                columnStyles: {
                    0: { cellWidth: 35 },
                    1: { cellWidth: 20 },
                    2: { cellWidth: 20 },
                    3: { cellWidth: 25 },
                    4: { cellWidth: 25 },
                    5: { cellWidth: 18 },
                    6: { cellWidth: 45 }
                },
                tableWidth: contentWidth
            });
            
            yPos = doc.lastAutoTable.finalY + 15;
        }
        
        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            
            // Footer line
            doc.setDrawColor(226, 232, 240);
            doc.setLineWidth(0.5);
            doc.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);
            
            // Page number
            doc.setFontSize(8);
            doc.setTextColor(148, 163, 184);
            doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 15, { align: 'center' });
            
            // Copyright
            doc.text('Daily Production Report | Garment Pro Management System', pageWidth / 2, pageHeight - 10, { align: 'center' });
        }
        
        // Save PDF
        const fileName = `Daily_Report_${date.replace(/-/g, '_')}.pdf`;
        doc.save(fileName);
        
        showToast('Daily report generated successfully!', 'success');
        
    } catch (error) {
        console.error('Daily PDF Export Error:', error);
        showToast(`Error generating daily report: ${error.message}`, 'error');
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
        
        // Create workbook
        const wb = XLSX.utils.book_new();
        wb.Props = {
            Title: "Garment Production Report",
            Subject: "Employee Performance Data",
            Author: "Garment Pro Management System",
            CreatedDate: new Date()
        };
        
        // Weekly Employees Sheet
        if (weekly.length > 0) {
            const weeklyData = [
                ['WEEKLY EMPLOYEES - PRODUCTION REPORT'],
                [`Report Date: ${new Date().toLocaleDateString()}`],
                [''],
                ['Name', 'Date', 'Garments', 'Start Time', 'Break Time', 'End Time', 'Net Hours', 'Notes']
            ];
            
            weekly.forEach(emp => {
                weeklyData.push([
                    emp.name,
                    formatDate(emp.date),
                    emp.clothes,
                    formatTime(emp.startTime),
                    formatTime(emp.breakTime),
                    formatTime(emp.endTime),
                    parseFloat(emp.netHours.toFixed(2)),
                    emp.notes || ''
                ]);
            });
            
            // Add summary
            const totalClothes = weekly.reduce((s, e) => s + e.clothes, 0);
            const totalHours = weekly.reduce((s, e) => s + e.netHours, 0);
            
            weeklyData.push(['']);
            weeklyData.push(['SUMMARY']);
            weeklyData.push(['Total Employees', weekly.length]);
            weeklyData.push(['Total Garments', totalClothes]);
            weeklyData.push(['Total Hours', parseFloat(totalHours.toFixed(2))]);
            weeklyData.push(['Average per Employee', parseFloat((totalClothes / weekly.length).toFixed(1))]);
            
            const wsWeekly = XLSX.utils.aoa_to_sheet(weeklyData);
            
            // Set column widths
            wsWeekly['!cols'] = [
                { wch: 25 },
                { wch: 15 },
                { wch: 12 },
                { wch: 12 },
                { wch: 12 },
                { wch: 12 },
                { wch: 12 },
                { wch: 30 }
            ];
            
            XLSX.utils.book_append_sheet(wb, wsWeekly, "Weekly Employees");
        }
        
        // Monthly Employees Sheet
        if (monthly.length > 0) {
            const monthlyData = [
                ['MONTHLY EMPLOYEES - PRODUCTION REPORT'],
                [`Report Date: ${new Date().toLocaleDateString()}`],
                [''],
                ['Name', 'Date', 'Garments', 'Start Time', 'Break Time', 'End Time', 'Net Hours', 'Notes']
            ];
            
            monthly.forEach(emp => {
                monthlyData.push([
                    emp.name,
                    formatDate(emp.date),
                    emp.clothes,
                    formatTime(emp.startTime),
                    formatTime(emp.breakTime),
                    formatTime(emp.endTime),
                    parseFloat(emp.netHours.toFixed(2)),
                    emp.notes || ''
                ]);
            });
            
            // Add summary
            const totalClothes = monthly.reduce((s, e) => s + e.clothes, 0);
            const totalHours = monthly.reduce((s, e) => s + e.netHours, 0);
            
            monthlyData.push(['']);
            monthlyData.push(['SUMMARY']);
            monthlyData.push(['Total Employees', monthly.length]);
            monthlyData.push(['Total Garments', totalClothes]);
            monthlyData.push(['Total Hours', parseFloat(totalHours.toFixed(2))]);
            monthlyData.push(['Average per Employee', parseFloat((totalClothes / monthly.length).toFixed(1))]);
            
            const wsMonthly = XLSX.utils.aoa_to_sheet(monthlyData);
            
            // Set column widths
            wsMonthly['!cols'] = [
                { wch: 25 },
                { wch: 15 },
                { wch: 12 },
                { wch: 12 },
                { wch: 12 },
                { wch: 12 },
                { wch: 12 },
                { wch: 30 }
            ];
            
            XLSX.utils.book_append_sheet(wb, wsMonthly, "Monthly Employees");
        }
        
        // Summary Sheet
        const summaryData = [
            ['GARMENT PRODUCTION - EXECUTIVE SUMMARY'],
            [`Generated: ${new Date().toLocaleDateString()}`],
            [''],
            ['METRIC', 'WEEKLY', 'MONTHLY', 'TOTAL'],
            ['Number of Employees', weekly.length, monthly.length, AppState.employees.length],
            ['Total Garments Produced', 
             weekly.reduce((s, e) => s + e.clothes, 0),
             monthly.reduce((s, e) => s + e.clothes, 0),
             weekly.reduce((s, e) => s + e.clothes, 0) + monthly.reduce((s, e) => s + e.clothes, 0)],
            ['Total Work Hours',
             parseFloat(weekly.reduce((s, e) => s + e.netHours, 0).toFixed(2)),
             parseFloat(monthly.reduce((s, e) => s + e.netHours, 0).toFixed(2)),
             parseFloat((weekly.reduce((s, e) => s + e.netHours, 0) + monthly.reduce((s, e) => s + e.netHours, 0)).toFixed(2))],
            ['Average Garments per Employee',
             parseFloat((weekly.reduce((s, e) => s + e.clothes, 0) / weekly.length || 0).toFixed(1)),
             parseFloat((monthly.reduce((s, e) => s + e.clothes, 0) / monthly.length || 0).toFixed(1)),
             parseFloat(((weekly.reduce((s, e) => s + e.clothes, 0) + monthly.reduce((s, e) => s + e.clothes, 0)) / AppState.employees.length || 0).toFixed(1))],
            ['Efficiency (Garments per Hour)',
             parseFloat((weekly.reduce((s, e) => s + e.clothes, 0) / (weekly.reduce((s, e) => s + e.netHours, 0) || 1)).toFixed(2)),
             parseFloat((monthly.reduce((s, e) => s + e.clothes, 0) / (monthly.reduce((s, e) => s + e.netHours, 0) || 1)).toFixed(2)),
             parseFloat(((weekly.reduce((s, e) => s + e.clothes, 0) + monthly.reduce((s, e) => s + e.clothes, 0)) / 
                        ((weekly.reduce((s, e) => s + e.netHours, 0) + monthly.reduce((s, e) => s + e.netHours, 0)) || 1)).toFixed(2))]
        ];
        
        const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
        
        // Merge title cells
        wsSummary['!merges'] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } },
            { s: { r: 1, c: 0 }, e: { r: 1, c: 3 } }
        ];
        
        // Set column widths
        wsSummary['!cols'] = [
            { wch: 35 },
            { wch: 15 },
            { wch: 15 },
            { wch: 15 }
        ];
        
        XLSX.utils.book_append_sheet(wb, wsSummary, "Executive Summary");
        
        // Save Excel file
        const fileName = `Garment_Production_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, fileName);
        
        showToast('Excel report generated successfully!', 'success');
        
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
                dailyEntries: Object.keys(AppState.dailyEntries).length,
                version: '3.1.0'
            },
            employees: AppState.employees,
            nextId: AppState.nextId,
            employeeList: AppState.employeeList,
            dailyEntries: AppState.dailyEntries
        };
        
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `garment_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        localStorage.setItem('lastBackup', new Date().toISOString());
        updateStorageInfo();
        
        showToast('Backup exported successfully', 'success');
    } catch (error) {
        console.error('Backup Export Error:', error);
        showToast(`Error exporting backup: ${error.message}`, 'error');
    }
}

function importData(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.employees && Array.isArray(data.employees)) {
                AppState.employees = data.employees;
                AppState.nextId = data.nextId || 1;
                AppState.employeeList = data.employeeList || [];
                AppState.dailyEntries = data.dailyEntries || {};
                if (saveData()) {
                    updateUI();
                    updateStats();
                    showToast('Data imported successfully', 'success');
                }
            } else {
                showToast('Invalid data format', 'error');
            }
        } catch (error) {
            showToast('Error importing data', 'error');
        }
    };
    reader.readAsText(file);
}

function clearAllData() {
    if (AppState.employees.length === 0 && Object.keys(AppState.dailyEntries).length === 0) {
        showToast('No data to clear', 'warning');
        return;
    }
    
    if (confirm(`Are you sure you want to delete ALL data?\n\nThis will delete:\n• ${AppState.employees.length} employee records\n• ${Object.keys(AppState.dailyEntries).length} days of daily entries\n\nThis action cannot be undone.`)) {
        AppState.employees = [];
        AppState.employeeList = [];
        AppState.dailyEntries = {};
        AppState.nextId = 1;
        if (saveData()) {
            updateUI();
            updateStats();
            showToast('All data cleared successfully', 'success');
        }
    }
}
function toggleDailyExportMenu() {
    const menu = document.getElementById('dailyExportMenu');
    menu.classList.toggle('show');
    
    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target) && !e.target.closest('.dropdown')) {
                menu.classList.remove('show');
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 0);
}

// ============================================
// UI Management
// ============================================

function updateUI() {
    updateNavigation();
    updateTables();
    updateForm();
    updateStats();
    updatePreview();
    updateDailyTable();
}

function updateNavigation() {
    const weeklyCount = AppState.employees.filter(e => e.type === 'weekly').length;
    const monthlyCount = AppState.employees.filter(e => e.type === 'monthly').length;
    const today = new Date().toISOString().split('T')[0];
    const todayEntries = Object.keys(AppState.dailyEntries[today] || {}).length;
    
    DOM.navWeekly.textContent = weeklyCount;
    DOM.navMonthly.textContent = monthlyCount;
    DOM.navDaily.textContent = todayEntries;
    DOM.mobileTotal.textContent = AppState.employees.length;
}

function updateTables() {
    updateTable('weekly');
    updateTable('monthly');
}

function updateTable(type) {
    const tableBody = type === 'weekly' ? DOM.weeklyTableBody : DOM.monthlyTableBody;
    const emptyState = type === 'weekly' ? DOM.weeklyEmpty : DOM.monthlyEmpty;
    
    let employees = AppState.employees.filter(emp => emp.type === type);
    
    const sortConfig = AppState.sortConfig[type];
    employees.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        if (sortConfig.key === 'date') {
            aValue = new Date(a.date);
            bValue = new Date(b.date);
        }
        
        if (sortConfig.key === 'clothes' || sortConfig.key === 'netHours') {
            aValue = parseFloat(aValue);
            bValue = parseFloat(bValue);
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
        updatePaginationInfo(type, 0, employees.length);
        return;
    }
    
    emptyState.classList.remove('show');
    
    tableBody.innerHTML = pageEmployees.map(employee => `
        <tr>
            <td>
                <div class="employee-info">
                    <strong>${employee.name}</strong>
                    ${employee.notes ? `<small>${employee.notes}</small>` : ''}
                </div>
            </td>
            <td>${formatDate(employee.date)}</td>
            <td>
                <span class="badge" style="background: ${employee.type === 'weekly' ? 'var(--weekly-color)' : 'var(--monthly-color)'}">
                    ${employee.clothes}
                </span>
            </td>
            <td>
                <span class="text-primary" style="font-weight: 600;">${formatHours(employee.netHours)}h</span>
                <small>${formatTime(employee.startTime)} - ${formatTime(employee.endTime)}</small>
            </td>
            <td>
                <div class="actions">
                    <button class="action-btn edit" onclick="editEmployee('${employee.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteEmployee('${employee.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    updatePaginationInfo(type, pageEmployees.length, employees.length);
    updatePaginationButtons(type, currentPage, totalPages);
}

function updatePaginationInfo(type, showing, total) {
    const showingElement = type === 'weekly' ? DOM.weeklyShowing : DOM.monthlyShowing;
    const totalElement = type === 'weekly' ? DOM.weeklyTotal : DOM.monthlyTotal;
    
    showingElement.textContent = showing;
    totalElement.textContent = total;
}

function updatePaginationButtons(type, currentPage, totalPages) {
    const prevBtn = type === 'weekly' ? DOM.prevWeekly : DOM.prevMonthly;
    const nextBtn = type === 'weekly' ? DOM.nextWeekly : DOM.nextMonthly;
    
    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= totalPages;
}

function updateForm() {
    const today = new Date().toISOString().split('T')[0];
    if (!DOM.workDate.value) {
        DOM.workDate.value = today;
    }
    DOM.workDate.max = today;
    
    if (!DOM.startTime.value) {
        DOM.startTime.value = '09:00';
        DOM.breakTime.value = '13:00';
        DOM.endTime.value = '17:00';
        updateTimeSummary();
    }
}

function updateTimeSummary() {
    const start = DOM.startTime.value;
    const breakTime = DOM.breakTime.value;
    const end = DOM.endTime.value;
    
    if (start && end) {
        const total = calculateTimeDifference(start, end);
        const net = calculateNetHours(start, breakTime, end);
        const breakDuration = total - net;
        
        DOM.totalHours.textContent = formatHours(total);
        DOM.netHours.textContent = formatHours(net);
        DOM.breakDuration.textContent = formatHours(breakDuration);
    }
}

function updateStats() {
    const weeklyEmployees = AppState.employees.filter(e => e.type === 'weekly');
    const monthlyEmployees = AppState.employees.filter(e => e.type === 'monthly');
    
    // Weekly stats
    const weeklyClothes = weeklyEmployees.reduce((sum, emp) => sum + emp.clothes, 0);
    const weeklyHours = weeklyEmployees.reduce((sum, emp) => sum + emp.netHours, 0);
    const weeklyAvgClothes = weeklyEmployees.length > 0 ? Math.round(weeklyClothes / weeklyEmployees.length) : 0;
    
    DOM.weeklyCount.textContent = weeklyEmployees.length;
    DOM.weeklyGarments.textContent = weeklyClothes;
    DOM.weeklyHours.textContent = formatHours(weeklyHours);
    DOM.weeklyAvg.textContent = weeklyAvgClothes;
    
    // Monthly stats
    const monthlyClothes = monthlyEmployees.reduce((sum, emp) => sum + emp.clothes, 0);
    const monthlyHours = monthlyEmployees.reduce((sum, emp) => sum + emp.netHours, 0);
    const monthlyAvgClothes = monthlyEmployees.length > 0 ? Math.round(monthlyClothes / monthlyEmployees.length) : 0;
    
    DOM.monthlyCount.textContent = monthlyEmployees.length;
    DOM.monthlyGarments.textContent = monthlyClothes;
    DOM.monthlyHours.textContent = formatHours(monthlyHours);
    DOM.monthlyAvg.textContent = monthlyAvgClothes;
    
    // Overall stats
    const totalClothes = weeklyClothes + monthlyClothes;
    const totalHours = weeklyHours + monthlyHours;
    const efficiency = totalHours > 0 ? (totalClothes / totalHours).toFixed(2) : 0;
    
    DOM.desktopTotal.textContent = AppState.employees.length;
    DOM.desktopGarments.textContent = totalClothes;
    DOM.desktopHours.textContent = formatHours(totalHours);
    DOM.footerTotal.textContent = AppState.employees.length;
    DOM.footerGarments.textContent = totalClothes;
    DOM.footerEfficiency.textContent = efficiency;
    
    // Settings
    DOM.settingsTotal.textContent = AppState.employees.length;
}

function updatePreview() {
    const weeklyEmployees = AppState.employees.filter(e => e.type === 'weekly');
    const monthlyEmployees = AppState.employees.filter(e => e.type === 'monthly');
    const today = new Date().toISOString().split('T')[0];
    const dailyData = AppState.dailyEntries[today] || {};
    
    const weeklyClothes = weeklyEmployees.reduce((s, e) => s + e.clothes, 0);
    const monthlyClothes = monthlyEmployees.reduce((s, e) => s + e.clothes, 0);
    const totalClothes = weeklyClothes + monthlyClothes;
    
    // Calculate today's garments from daily entries
    let todayGarments = 0;
    Object.values(dailyData).forEach(entry => {
        todayGarments += entry.clothes || 0;
    });
    
    const weeklyHours = weeklyEmployees.reduce((s, e) => s + e.netHours, 0);
    const monthlyHours = monthlyEmployees.reduce((s, e) => s + e.netHours, 0);
    const totalHours = weeklyHours + monthlyHours;
    
    DOM.previewWeekly.textContent = weeklyEmployees.length;
    DOM.previewWeeklyGarments.textContent = weeklyClothes;
    DOM.previewMonthly.textContent = monthlyEmployees.length;
    DOM.previewMonthlyGarments.textContent = monthlyClothes;
    DOM.previewToday.textContent = Object.keys(dailyData).length;
    DOM.previewTodayGarments.textContent = todayGarments;
    DOM.previewTotal.textContent = AppState.employees.length;
    DOM.previewHours.textContent = formatHours(totalHours);
}
