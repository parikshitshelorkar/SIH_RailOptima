const trainsets = [
    { id: 'TS-01', status: 'ready', fitness: { rollingStock: true, signalling: true, telecom: true }, 
      jobCard: 'Closed', branding: 'High', mileage: 4500, cleaning: 'Completed', stabling: 'A-12' },
    { id: 'TS-02', status: 'ready', fitness: { rollingStock: true, signalling: true, telecom: true }, 
      jobCard: 'Closed', branding: 'Medium', mileage: 5200, cleaning: 'Completed', stabling: 'B-07' },
    { id: 'TS-03', status: 'ready', fitness: { rollingStock: true, signalling: true, telecom: true }, 
      jobCard: 'Closed', branding: 'High', mileage: 3800, cleaning: 'Completed', stabling: 'C-03' },
    { id: 'TS-04', status: 'standby', fitness: { rollingStock: true, signalling: true, telecom: true }, 
      jobCard: 'Closed', branding: 'Low', mileage: 6100, cleaning: 'Scheduled', stabling: 'A-09' },
    { id: 'TS-05', status: 'maintenance', fitness: { rollingStock: true, signalling: true, telecom: false }, 
      jobCard: 'Open #4872', branding: 'Medium', mileage: 5700, cleaning: 'Overdue', stabling: 'IBL-02' },
    { id: 'TS-06', status: 'ready', fitness: { rollingStock: true, signalling: true, telecom: true }, 
      jobCard: 'Closed', branding: 'High', mileage: 4200, cleaning: 'Completed', stabling: 'B-11' }
];

document.addEventListener('DOMContentLoaded', function() {
    renderTrainsets();
    updateTime();
    setupThemeToggle();
    setupFeatureTabs();
    initMileageChart();
    simulateUrgentMaintenance();
    setInterval(updateTime, 60000);
    
    // Initialize new features
    initStaggeredAnimations();
    initScenarioSliders();
    initVoiceCommands();
    initARView();
    initPresentationMode();
    
    // Request notification permission
    requestNotificationPermission();
});

function renderTrainsets() {
    const container = document.getElementById('trainset-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    trainsets.forEach(trainset => {
        const card = document.createElement('div');
        card.className = 'trainset-card tilt-card';
        
        let statusClass = '';
        let statusText = '';
        if (trainset.status === 'ready') {
            statusClass = 'status-ready';
            statusText = 'Ready';
        } else if (trainset.status === 'maintenance') {
            statusClass = 'status-maintenance';
            statusText = 'Maintenance';
        } else {
            statusClass = 'status-standby';
            statusText = 'Standby';
        }
        
        const fitnessValues = Object.values(trainset.fitness);
        const fitnessPercent = (fitnessValues.filter(v => v).length / fitnessValues.length) * 100;
        
        const mileagePercent = (trainset.mileage / 8000) * 100;
        let mileageClass = 'progress-high';
        if (mileagePercent > 70) mileageClass = 'progress-medium';
        if (mileagePercent > 90) mileageClass = 'progress-low';
        
        card.innerHTML = `
            <div class="card-header">
                <div class="trainset-id">${trainset.id}</div>
                <div class="status-badge ${statusClass}">${statusText}</div>
            </div>
            <div class="card-body">
                <div class="attribute">
                    <span class="attr-name">Fitness Certificate</span>
                    <span class="attr-value">${fitnessPercent}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill ${fitnessPercent === 100 ? 'progress-high' : 'progress-low'}" 
                         style="width: ${fitnessPercent}%"></div>
                </div>
                
                <div class="attribute">
                    <span class="attr-name">Job Card</span>
                    <span class="attr-value">${trainset.jobCard}</span>
                </div>
                
                <div class="attribute">
                    <span class="attr-name">Branding Priority</span>
                    <span class="attr-value">${trainset.branding}</span>
                </div>
                
                <div class="attribute">
                    <span class="attr-name">Mileage</span>
                    <span class="attr-value">${trainset.mileage} km</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill ${mileageClass}" style="width: ${mileagePercent}%"></div>
                </div>
                
                <div class="attribute">
                    <span class="attr-name">Cleaning</span>
                    <span class="attr-value">${trainset.cleaning}</span>
                </div>
                
                <div class="attribute">
                    <span class="attr-name">Stabling Position</span>
                    <span class="attr-value">${trainset.stabling}</span>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
    
    initTiltEffect();
}

function initTiltEffect() {
    const tiltCards = document.querySelectorAll('.tilt-card');
    
    tiltCards.forEach(card => {
        const height = card.clientHeight;
        const width = card.clientWidth;
        
        card.addEventListener('mousemove', (e) => {
            const x = e.offsetX;
            const y = e.offsetY;
            
            const rotateY = ((x - width / 2) / width) * 10;
            const rotateX = ((y - height / 2) / height) * -10;
            
            card.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.boxShadow = `0 20px 30px rgba(0, 0, 0, 0.15)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateY(0deg) rotateX(0deg)';
            card.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
        });
    });
}

function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: 'Asia/Kolkata'
    });
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        timeElement.textContent = `${timeString} IST`;
    }
}

function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    const icon = themeToggle.querySelector('i');
    
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-mode');
        if (icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            if (icon) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
        } else {
            localStorage.setItem('theme', 'light');
            if (icon) {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        }
    });
}

function setupFeatureTabs() {
    const tabs = document.querySelectorAll('.feature-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.feature-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.feature-content').forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            const contentId = `${tab.dataset.tab}-content`;
            const content = document.getElementById(contentId);
            if (content) {
                content.classList.add('active');
            }
        });
    });
}

function initMileageChart() {
    const ctx = document.getElementById('mileageChart');
    if (!ctx) return;
    
    const data = {
        labels: ['TS-01', 'TS-02', 'TS-03', 'TS-04', 'TS-05', 'TS-06', 'TS-07'],
        datasets: [
            {
                label: 'This Week (km)',
                data: [420, 380, 450, 320, 0, 390, 410],
                backgroundColor: '#0057b8',
                borderColor: '#0057b8',
                borderWidth: 1
            },
            {
                label: 'Last Week (km)',
                data: [450, 410, 480, 350, 120, 420, 440],
                backgroundColor: '#00a651',
                borderColor: '#00a651',
                borderWidth: 1
            },
            {
                label: 'Average (km)',
                data: [400, 400, 400, 400, 400, 400, 400],
                backgroundColor: '#ff7f00',
                borderColor: '#ff7f00',
                borderWidth: 1,
                type: 'line',
                fill: false,
                pointRadius: 0,
                pointHoverRadius: 0
            }
        ]
    };
    
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Mileage (km)'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Trainset ID'
                }
            }
        },
        plugins: {
            legend: {
                display: false
            }
        }
    };
    
    new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
    });
}

function simulateUrgentMaintenance() {
    setTimeout(() => {
        showNotification('Urgent Maintenance Required', 'Trainset TS-05 has critical braking system issues');
    }, 10000);
}

function showNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { 
            body: body,
            icon: '/favicon.ico'
        });
    }
}

function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        const permissionElement = document.getElementById('notification-permission');
        if (permissionElement) {
            permissionElement.style.display = 'block';
            
            const enableBtn = document.getElementById('enable-notifications');
            if (enableBtn) {
                enableBtn.addEventListener('click', () => {
                    Notification.requestPermission().then(permission => {
                        permissionElement.style.display = 'none';
                    });
                });
            }
        }
    }
}

function initStaggeredAnimations() {
    const elements = document.querySelectorAll('.animated-entry');
    elements.forEach((el, i) => {
        el.style.animationDelay = `${i * 0.1}s`;
    });
}

function initScenarioSliders() {
    const crewSlider = document.getElementById('crew-slider');
    const frequencySlider = document.getElementById('frequency-slider');
    const deliverySlider = document.getElementById('delivery-slider');
    
    const crewValue = document.getElementById('crew-value');
    const frequencyValue = document.getElementById('frequency-value');
    const deliveryValue = document.getElementById('delivery-value');
    
    if (crewSlider && crewValue) {
        crewSlider.addEventListener('input', () => {
            crewValue.textContent = `${crewSlider.value} teams`;
            updateSimulationResults();
        });
    }
    
    if (frequencySlider && frequencyValue) {
        frequencySlider.addEventListener('input', () => {
            frequencyValue.textContent = `${frequencySlider.value} mins`;
            updateSimulationResults();
        });
    }
    
    if (deliverySlider && deliveryValue) {
        deliverySlider.addEventListener('input', () => {
            deliveryValue.textContent = `${deliverySlider.value} hrs`;
            updateSimulationResults();
        });
    }
}

function updateSimulationResults() {
    const crew = document.getElementById('crew-slider')?.value || 5;
    const frequency = document.getElementById('frequency-slider')?.value || 5;
    const delivery = document.getElementById('delivery-slider')?.value || 24;
    
    const reliability = 95 + (crew/10) + (10-frequency) - (delivery/24);
    const reduction = 10 + (crew/2) - (delivery/12);
    const utilization = 75 + (crew*2) - (frequency*1.5);
    
    const resultsEl = document.getElementById('simulation-results');
    if (resultsEl) {
        resultsEl.innerHTML = `
            <p>With current parameters, predicted service reliability: <strong>${Math.min(99.9, reliability.toFixed(1))}%</strong></p>
            <p>Expected maintenance backlog reduction: <strong>${Math.max(0, reduction.toFixed(0))}%</strong> in next 7 days</p>
            <p>Optimal trainset utilization: <strong>${Math.min(95, utilization.toFixed(0))}%</strong></p>
        `;
    }
}

function initVoiceCommands() {
    const voiceBtn = document.getElementById('voice-command');
    if (!voiceBtn) return;
    
    let recognition;
    
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.continuous = false;
        recognition.lang = 'en-US';
        
        recognition.onstart = function() {
            voiceBtn.classList.add('listening');
        };
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript.toLowerCase();
            processVoiceCommand(transcript);
            voiceBtn.classList.remove('listening');
        };
        
        recognition.onerror = function() {
            voiceBtn.classList.remove('listening');
        };
        
        recognition.onend = function() {
            voiceBtn.classList.remove('listening');
        };
        
        voiceBtn.addEventListener('click', () => {
            if (voiceBtn.classList.contains('listening')) {
                recognition.stop();
            } else {
                recognition.start();
            }
        });
    } else {
        voiceBtn.style.display = 'none';
    }
}

function processVoiceCommand(command) {
    if (command.includes('show') || command.includes('display')) {
        if (command.includes('maintenance')) {
            const tab = document.querySelector('[data-tab="maintenance-timeline"]');
            if (tab) tab.click();
            showNotification("Showing Maintenance Timeline", "Displaying maintenance schedule");
        } else if (command.includes('depot')) {
            const tab = document.querySelector('[data-tab="depot-map"]');
            if (tab) tab.click();
            showNotification("Showing Depot Map", "Displaying depot layout");
        } else if (command.includes('mileage')) {
            const tab = document.querySelector('[data-tab="mileage-trends"]');
            if (tab) tab.click();
            showNotification("Showing Mileage Trends", "Displaying mileage analytics");
        }
    } else if (command.includes('refresh')) {
        const refreshBtn = document.getElementById('refresh-data');
        if (refreshBtn) refreshBtn.click();
        showNotification("Data Refreshed", "Latest data loaded");
    } else if (command.includes('dark mode') || command.includes('light mode')) {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) themeToggle.click();
    }
}

function initARView() {
    const arBtn = document.getElementById('ar-view');
    const arModal = document.getElementById('ar-modal');
    
    if (!arBtn || !arModal) return;
    
    const closeArModal = arModal.querySelector('.close-modal');
    
    arBtn.addEventListener('click', () => {
        arModal.style.display = 'flex';
    });
    
    if (closeArModal) {
        closeArModal.addEventListener('click', () => {
            arModal.style.display = 'none';
        });
    }
}

function initPresentationMode() {
    const toggleBtn = document.getElementById('presentation-toggle');
    if (!toggleBtn) return;
    
    let isPresentationMode = false;
    let presentationInterval;
    
    toggleBtn.addEventListener('click', () => {
        isPresentationMode = !isPresentationMode;
        
        if (isPresentationMode) {
            document.body.classList.add('presentation-mode');
            toggleBtn.innerHTML = '<i class="fas fa-times"></i> Exit Presentation';
            startPresentationCycle();
        } else {
            document.body.classList.remove('presentation-mode');
            toggleBtn.innerHTML = '<i class="fas fa-desktop"></i> Presentation Mode';
            stopPresentationCycle();
        }
    });
    
    function startPresentationCycle() {
        const tabs = document.querySelectorAll('.feature-tab');
        let currentTab = 0;
        
        presentationInterval = setInterval(() => {
            if (tabs.length > 0) {
                tabs[currentTab].click();
                currentTab = (currentTab + 1) % tabs.length;
            }
        }, 10000);
    }
    
    function stopPresentationCycle() {
        if (presentationInterval) {
            clearInterval(presentationInterval);
        }
    }
}

// QR Scanner functionality
function initQRScanner() {
    const qrBtn = document.getElementById('qr-scanner');
    const qrModal = document.getElementById('qr-modal');
    const qrVideo = document.getElementById('qr-video');
    const qrResult = document.getElementById('qr-result');
    const closeModal = qrModal?.querySelector('.close-modal');
    
    if (!qrBtn || !qrModal) return;
    
    qrBtn.addEventListener('click', () => {
        qrModal.style.display = 'flex';
        startQRScanner();
    });
    
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            qrModal.style.display = 'none';
            stopQRScanner();
        });
    }
    
    function startQRScanner() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            qrResult.textContent = 'Camera not supported on this device';
            return;
        }
        
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            .then(stream => {
                qrVideo.srcObject = stream;
                qrVideo.play();
                scanQRCode();
            })
            .catch(err => {
                qrResult.textContent = 'Camera access denied';
            });
    }
    
    function stopQRScanner() {
        if (qrVideo.srcObject) {
            qrVideo.srcObject.getTracks().forEach(track => track.stop());
        }
    }
    
    function scanQRCode() {
        if (qrVideo.readyState === qrVideo.HAVE_ENOUGH_DATA) {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = qrVideo.videoWidth;
            canvas.height = qrVideo.videoHeight;
            context.drawImage(qrVideo, 0, 0, canvas.width, canvas.height);
            
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            
            if (typeof jsQR !== 'undefined') {
                const code = jsQR(imageData.data, imageData.width, imageData.height);
                if (code) {
                    qrResult.textContent = `QR Code detected: ${code.data}`;
                    stopQRScanner();
                    return;
                }
            }
        }
        
        requestAnimationFrame(scanQRCode);
    }
}

// Initialize QR Scanner when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    initQRScanner();
});