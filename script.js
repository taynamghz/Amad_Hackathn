// Initialize the dashboard when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Set current date
    setCurrentDate();
    
    // Initialize charts
    initializeSpendingChart();
    initializeTrendsChart();
    
    // Add event listeners for interactive elements
    addEventListeners();
    
    // Animate elements on scroll
    animateOnScroll();
    
    // Handle window resize for responsive charts
    window.addEventListener('resize', handleWindowResize);
});

// Handle window resize for better mobile responsiveness
function handleWindowResize() {
    // Reinitialize charts on resize for better mobile experience
    const charts = Chart.getChart('spendingChart');
    if (charts) {
        charts.destroy();
    }
    
    const trendsChart = Chart.getChart('trendsChart');
    if (trendsChart) {
        trendsChart.destroy();
    }
    
    // Small delay to ensure proper resize
    setTimeout(() => {
        initializeSpendingChart();
        initializeTrendsChart();
    }, 100);
}

// Set current date in Arabic
function setCurrentDate() {
    const dateElement = document.getElementById('current-date');
    const now = new Date();
    
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    
    // Convert to Arabic locale
    const arabicDate = now.toLocaleDateString('ar-SA', options);
    dateElement.textContent = arabicDate;
}

// Initialize spending pie chart
function initializeSpendingChart() {
    const ctx = document.getElementById('spendingChart').getContext('2d');
    
    // Check if device is mobile
    const isMobile = window.innerWidth <= 768;
    
    const spendingChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['الطعام والمطاعم', 'المواصلات', 'التسوق', 'الترفيه', 'الفواتير'],
            datasets: [{
                data: [4200, 2100, 1800, 1500, 2850],
                backgroundColor: [
                    '#c36b4e',
                    '#8980bc',
                    '#042341',
                    '#f3f3f3',
                    '#6b4ec3'
                ],
                borderWidth: 0,
                hoverOffset: isMobile ? 5 : 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value.toLocaleString()} ريال (${percentage}%)`;
                        }
                    },
                    titleFont: {
                        size: isMobile ? 12 : 14
                    },
                    bodyFont: {
                        size: isMobile ? 11 : 13
                    }
                }
            },
            cutout: isMobile ? '70%' : '60%'
        }
    });
}

// Initialize trends line chart
function initializeTrendsChart() {
    const ctx = document.getElementById('trendsChart').getContext('2d');
    
    // Check if device is mobile
    const isMobile = window.innerWidth <= 768;
    
    // Generate sample data for the last 30 days
    const days = [];
    const spendingData = [];
    const savingsData = [];
    
    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        days.push(date.getDate());
        
        // Generate realistic spending data
        const baseSpending = 400;
        const variation = Math.random() * 200 - 100;
        spendingData.push(Math.max(200, baseSpending + variation));
        
        // Generate savings data (inverse relationship)
        const baseSavings = 100;
        const savingsVariation = Math.random() * 50 - 25;
        savingsData.push(Math.max(0, baseSavings + savingsVariation));
    }
    
    const trendsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: days,
            datasets: [
                {
                    label: 'الإنفاق اليومي',
                    data: spendingData,
                    borderColor: '#c36b4e',
                    backgroundColor: 'rgba(195, 107, 78, 0.1)',
                    borderWidth: isMobile ? 1.5 : 2,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'المدخرات اليومية',
                    data: savingsData,
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    borderWidth: isMobile ? 1.5 : 2,
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: isMobile ? 15 : 20,
                        font: {
                            family: 'Cairo',
                            size: isMobile ? 10 : 12
                        }
                    }
                },
                tooltip: {
                    titleFont: {
                        size: isMobile ? 11 : 13
                    },
                    bodyFont: {
                        size: isMobile ? 10 : 12
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + ' ريال';
                        },
                        font: {
                            size: isMobile ? 9 : 11
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: isMobile ? 9 : 11
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// Add event listeners for interactive elements
function addEventListeners() {
    // Quick action buttons
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.querySelector('span').textContent;
            handleQuickAction(action);
        });
    });
    
    // Bill items for detailed view
    const billItems = document.querySelectorAll('.bill-item');
    billItems.forEach(item => {
        item.addEventListener('click', function() {
            showBillDetails(this);
        });
    });
    
    // Category items for detailed analysis
    const categoryItems = document.querySelectorAll('.category-item');
    categoryItems.forEach(item => {
        item.addEventListener('click', function() {
            showCategoryDetails(this);
        });
    });
}

// Handle quick action button clicks
function handleQuickAction(action) {
    const actions = {
        'إضافة معاملة': () => showNotification('سيتم فتح نموذج إضافة معاملة جديدة', 'info'),
        'تعديل الميزانية': () => showNotification('سيتم فتح صفحة تعديل الميزانية', 'info'),
        'تحميل التقرير': () => showNotification('جاري تحضير التقرير...', 'success'),
        'الإعدادات': () => showNotification('سيتم فتح صفحة الإعدادات', 'info')
    };
    
    if (actions[action]) {
        actions[action]();
    }
}

// Show bill details modal
function showBillDetails(billItem) {
    const billName = billItem.querySelector('h4').textContent;
    const billAmount = billItem.querySelector('.bill-amount').textContent;
    const billDate = billItem.querySelector('.bill-date').textContent;
    
    showNotification(`تفاصيل ${billName}: ${billAmount} - ${billDate}`, 'info');
}

// Show category details
function showCategoryDetails(categoryItem) {
    const categoryName = categoryItem.querySelector('span').textContent;
    const categoryAmount = categoryItem.querySelector('.amount').textContent;
    
    showNotification(`تحليل ${categoryName}: ${categoryAmount}`, 'info');
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#042341'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        font-family: 'Cairo', sans-serif;
        font-size: 0.9rem;
        transform: translateX(-100%);
        transition: transform 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(-100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Animate elements on scroll
function animateOnScroll() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe dashboard cards
    const cards = document.querySelectorAll('.dashboard-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Update real-time data (simulated)
function updateRealTimeData() {
    // Simulate real-time updates
    setInterval(() => {
        // Update spending amounts with small variations
        const spendingElements = document.querySelectorAll('.stat-value');
        spendingElements.forEach(element => {
            if (element.textContent.includes('ريال')) {
                const currentValue = parseInt(element.textContent.replace(/[^\d]/g, ''));
                const variation = Math.floor(Math.random() * 10) - 5;
                const newValue = Math.max(0, currentValue + variation);
                element.textContent = newValue.toLocaleString() + ' ريال';
            }
        });
    }, 30000); // Update every 30 seconds
}

// Initialize real-time updates
updateRealTimeData();

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + S for settings
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleQuickAction('الإعدادات');
    }
    
    // Ctrl/Cmd + N for new transaction
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        handleQuickAction('إضافة معاملة');
    }
});

// Add smooth scrolling for better UX
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading animation for charts
function showChartLoading(chartId) {
    const canvas = document.getElementById(chartId);
    const ctx = canvas.getContext('2d');
    
    // Create loading animation
    let angle = 0;
    const loadingAnimation = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(angle);
        
        ctx.beginPath();
        ctx.arc(0, 0, 30, 0, Math.PI * 1.5);
        ctx.strokeStyle = '#042341';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        ctx.restore();
        
        angle += 0.1;
    }, 50);
    
    return loadingAnimation;
}

// Export dashboard data
function exportDashboardData() {
    const dashboardData = {
        totalSpending: 12450,
        savings: 3200,
        savingsPercentage: 25.7,
        categories: [
            { name: 'الطعام والمطاعم', amount: 4200, color: '#c36b4e' },
            { name: 'المواصلات', amount: 2100, color: '#8980bc' },
            { name: 'التسوق', amount: 1800, color: '#042341' },
            { name: 'الترفيه', amount: 1500, color: '#f3f3f3' },
            { name: 'الفواتير', amount: 2850, color: '#6b4ec3' }
        ],
        bills: [
            { name: 'فاتورة الكهرباء', amount: 450, status: 'paid', date: '15/12/2024' },
            { name: 'فاتورة المياه', amount: 120, status: 'paid', date: '12/12/2024' },
            { name: 'فاتورة الإنترنت', amount: 200, status: 'upcoming', date: '25/12/2024' },
            { name: 'فاتورة الهاتف', amount: 150, status: 'overdue', date: '10/12/2024' }
        ],
        behaviorScore: 78,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(dashboardData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'ala-madark-dashboard-data.json';
    link.click();
    
    showNotification('تم تصدير بيانات لوحة التحكم بنجاح', 'success');
}

// Add export functionality to download button
document.addEventListener('DOMContentLoaded', function() {
    const downloadBtn = document.querySelector('.action-btn:has(.fa-download)');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            exportDashboardData();
        });
    }
}); 