document.addEventListener('DOMContentLoaded', function() {
    // Modal elements
    const addContributionBtn = document.getElementById('add-contribution-btn');
    const addContributionModal = document.getElementById('add-contribution-modal');
    const cancelAddBtn = document.getElementById('cancel-add');
    const contributionForm = document.getElementById('contribution-form');
    const contributionTable = document.getElementById('contribution-table').getElementsByTagName('tbody')[0];
    
    // Sample data
    const sampleData = [
        {
            place: "Forgotten Labyrinth",
            level: "8",
            statusCommon: "Complete",
            statusElite: "Complete",
            date: new Date().toISOString().split('T')[0], // Today's date
            continent: "Ciderlands"
        },
        {
            place: "Valley Area",
            level: "7",
            statusCommon: "9,598 / 19,000",
            statusElite: "602 / 1,200",
            date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday's date
            continent: "Moonlight Ravigne"
        }
    ];

    // Open add contribution modal
    if (addContributionBtn) {
        addContributionBtn.addEventListener('click', function() {
            contributionForm.reset();
            addContributionModal.style.display = 'block';
        });
    }

    // Close modals
    function closeModal(modal) {
        modal.style.display = 'none';
    }

    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', function() {
            closeModal(this.closest('.modal'));
        });
    });

    if (cancelAddBtn) {
        cancelAddBtn.addEventListener('click', function() {
            closeModal(addContributionModal);
        });
    }

    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });

    // Calculate percentage helper
    function calculatePercentage(status) {
        if (!status || status === "Complete") return 100;
        const match = status.match(/(\d+,\d+|\d+)\s*\/\s*(\d+,\d+|\d+)/);
        if (match) {
            const current = parseFloat(match[1].replace(/,/g, ''));
            const total = parseFloat(match[2].replace(/,/g, ''));
            if (total > 0) return Math.round((current / total) * 100 * 100) / 100;
        }
        return null;
    }

    // Format date for display
    function formatDisplayDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    // Get status class based on percentage
    function getStatusClass(percentage) {
        if (percentage === 100) return 'status-complete';
        if (percentage >= 50) return 'status-high';
        return 'status-low';
    }

    // Populate table
    function populateTable(data = sampleData) {
        contributionTable.innerHTML = '';
        data.forEach((item, index) => {
            const row = contributionTable.insertRow();
            
            const commonPercentage = calculatePercentage(item.statusCommon);
            const elitePercentage = calculatePercentage(item.statusElite);
            
            row.innerHTML = `
                <td>${item.place}</td>
                <td>${item.level}</td>
                <td class="${getStatusClass(commonPercentage)}">
                    ${item.statusCommon}
                    ${commonPercentage !== null && item.statusCommon !== "Complete" ? 
                      `<span class="status-progress">(${commonPercentage}%)</span>` : ''}
                </td>
                <td class="${getStatusClass(elitePercentage)}">
                    ${item.statusElite}
                    ${elitePercentage !== null && item.statusElite !== "Complete" ? 
                      `<span class="status-progress">(${elitePercentage}%)</span>` : ''}
                </td>
                <td>${formatDisplayDate(item.date)}</td>
                <td>${item.continent}</td>
                <td>
                    <button class="btn btn-edit" data-index="${index}">Edit</button>
                    <button class="btn btn-delete" data-index="${index}">Delete</button>
                </td>
            `;
        });

        // Add event listeners to buttons
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', editContribution);
        });
        
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', deleteContribution);
        });
    }

    // Add new contribution
    contributionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newContribution = {
            place: document.getElementById('place').value,
            level: document.getElementById('level').value,
            statusCommon: document.getElementById('status-common').value,
            statusElite: document.getElementById('status-elite').value,
            date: document.getElementById('date').value,
            continent: document.getElementById('continent').value
        };
        
        sampleData.push(newContribution);
        populateTable();
        renderCalendar();
        this.reset();
        closeModal(addContributionModal);
    });

    // Edit contribution
    function editContribution(e) {
        const index = e.target.getAttribute('data-index');
        const item = sampleData[index];
        
        document.getElementById('place').value = item.place;
        document.getElementById('level').value = item.level;
        document.getElementById('status-common').value = item.statusCommon;
        document.getElementById('status-elite').value = item.statusElite;
        document.getElementById('date').value = item.date;
        document.getElementById('continent').value = item.continent;
        
        sampleData.splice(index, 1);
        addContributionModal.style.display = 'block';
    }
    
    // Delete contribution
    function deleteContribution(e) {
        const index = e.target.getAttribute('data-index');
        sampleData.splice(index, 1);
        populateTable();
        renderCalendar();
    }

    // Calendar functionality
    let currentDate = new Date();
    
    function renderCalendar() {
        const monthNames = ["January", "February", "March", "April", "May", "June",
                          "July", "August", "September", "October", "November", "December"];
        
        document.getElementById('current-month').textContent = 
            `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
        
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();
        
        const calendarGrid = document.getElementById('calendar-days');
        calendarGrid.innerHTML = '';
        
        // Add day headers
        ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            calendarGrid.appendChild(emptyDay);
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            dayElement.dataset.date = dateStr;
            
            // Check if this date has data
            const hasData = sampleData.some(item => item.date === dateStr);
            if (hasData) {
                dayElement.classList.add('has-data');
            }
            
            dayElement.addEventListener('click', function() {
                filterByDate(dateStr);
            });
            
            calendarGrid.appendChild(dayElement);
        }
    }
    
    function filterByDate(date) {
        const filteredData = sampleData.filter(item => item.date === date);
        if (filteredData.length > 0) {
            populateTable(filteredData);
            
            // Add a button to clear the filter
            const clearFilter = document.createElement('button');
            clearFilter.className = 'btn clear-filter';
            clearFilter.textContent = 'Show All';
            clearFilter.style.margin = '10px 0';
            clearFilter.addEventListener('click', function() {
                populateTable();
                this.remove();
            });
            
            const existingClear = document.querySelector('.clear-filter');
            if (existingClear) existingClear.remove();
            
            document.getElementById('contribution').insertBefore(clearFilter, document.querySelector('.table-container'));
        }
    }
    
    // Initialize calendar navigation
    document.getElementById('prev-month').addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
    
    document.getElementById('next-month').addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    // Initialize
    renderCalendar();
    populateTable();
});