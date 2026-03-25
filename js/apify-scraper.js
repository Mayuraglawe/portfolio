/* ========================================
   APIFY SCRAPER - Admin Logic
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. ADMIN AUTHENTICATION CHECK
    const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
    const unauthorizedSect = document.getElementById('unauthorized');
    const scraperBody = document.querySelector('.scraper-section');
    const navbar = document.getElementById('navbar');

    if (!isAdmin) {
        if (unauthorizedSect) unauthorizedSect.classList.remove('hidden');
        if (scraperBody) scraperBody.style.display = 'none';
        if (navbar) navbar.style.display = 'none';
        document.body.classList.remove('is-admin');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
        return;
    }

    // 2. STATE & ELEMENT REFERENCES
    let currentRunId = null;
    let pollInterval = null;
    let apifyToken = localStorage.getItem('apify_token') || '';
    let lastActorId = localStorage.getItem('apify_actor_id') || '';

    const scraperForm = document.getElementById('scraperForm');
    const tokenInput = document.getElementById('apiToken');
    const actorInput = document.getElementById('actorId');
    const configInput = document.getElementById('actorInput');
    const prioritySelect = document.getElementById('priority');
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const logPanel = document.getElementById('logPanel');
    const runIdDisplay = document.getElementById('runIdDisplay');
    const statusBadge = document.getElementById('statusBadge');
    const progressBar = document.getElementById('progressBar');
    const progressFill = document.getElementById('progressFill');
    const dataOutput = document.getElementById('dataOutput');
    const dataViewer = document.getElementById('dataViewer');
    const downloadResults = document.getElementById('downloadResults');
    const logoutBtn = document.getElementById('logoutBtn');

    // Pre-fill fields
    if (apifyToken) tokenInput.value = apifyToken;
    if (lastActorId) actorInput.value = lastActorId;
    if (!configInput.value) {
        configInput.value = JSON.stringify({
            "search": "Systems Architects in India",
            "maxItems": 10
        }, null, 2);
    }

    // 3. LOGGING SYSTEM
    const addLog = (message, type = 'info') => {
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        const time = new Date().toLocaleTimeString();
        entry.innerHTML = `<span class="log-entry time">[${time}]</span> ${message}`;
        logPanel.appendChild(entry);
        logPanel.scrollTop = logPanel.scrollHeight;
    };

    // 4. UI STATE MANAGER
    const updateUIState = (status) => {
        statusBadge.textContent = status;
        statusBadge.className = `status-badge status-${status.toLowerCase()}`;
        
        const isRunning = (status === 'RUNNING' || status === 'QUEUED' || status === 'STARTING');
        
        startBtn.disabled = isRunning;
        startBtn.innerHTML = isRunning ? 
            '<span>Running Instance...</span> <i class="fas fa-spinner fa-spin"></i>' : 
            '<span>Initialize Actor</span> <i class="fas fa-play"></i>';
        
        stopBtn.disabled = !isRunning;
        progressBar.style.display = isRunning ? 'block' : 'none';
        
        if (status === 'COMPLETED' || status === 'FAILED') {
            downloadResults.disabled = false;
        }
    };

    // 5. API SCRAPER ACTIONS
    const startScraper = async (e) => {
        e.preventDefault();
        
        // Save preferences
        apifyToken = tokenInput.value;
        lastActorId = actorInput.value;
        localStorage.setItem('apify_token', apifyToken);
        localStorage.setItem('apify_actor_id', lastActorId);

        // Auto-correct slash to tilde if present (common mistake)
        if (lastActorId.includes('/') && !lastActorId.startsWith('http')) {
            lastActorId = lastActorId.replace('/', '~');
            actorInput.value = lastActorId;
            addLog(`Note: Auto-corrected Actor ID format to ${lastActorId}`, 'info');
        }

        let inputData;
        try {   
            inputData = JSON.parse(configInput.value);
        } catch (err) {
            addLog('Invalid JSON input: ' + err.message, 'error');
            return;
        }

        addLog(`Initiating Actor: ${lastActorId}...`, 'info');
        updateUIState('STARTING');
        dataOutput.style.display = 'none';
        logPanel.innerHTML = '';
        progressFill.style.width = '10%';

        try {
            const response = await fetch(`https://api.apify.com/v2/acts/${lastActorId}/runs?token=${apifyToken}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inputData)
            });

            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error?.message || 'Failed to start actor run');
            }

            currentRunId = result.data.id;
            runIdDisplay.textContent = `Run ID: ${currentRunId}`;
            addLog(`Run started successfully. ID: ${currentRunId}`, 'success');
            addLog(`Waiting for results... (Polling every 3s)`, 'info');
            
            startPollingStatus();
        } catch (err) {
            addLog('API Error: ' + err.message, 'error');
            updateUIState('FAILED');
        }
    };

    const startPollingStatus = () => {
        if (pollInterval) clearInterval(pollInterval);
        
        pollInterval = setInterval(async () => {
            try {
                const response = await fetch(`https://api.apify.com/v2/actor-runs/${currentRunId}?token=${apifyToken}`);
                const result = await response.json();
                
                const status = result.data.status;
                updateUIState(status);
                
                if (status === 'RUNNING') {
                    progressFill.style.width = '60%';
                    addLog('System processing... extractor active.', 'info');
                } else if (status === 'SUCCEEDED') {
                    clearInterval(pollInterval);
                    progressFill.style.width = '100%';
                    addLog('Execution completed successfully!', 'success');
                    updateUIState('COMPLETED');
                    fetchResults();
                } else if (status === 'FAILED' || status === 'ABORTED' || status === 'TIMED-OUT') {
                    clearInterval(pollInterval);
                    addLog(`Execution ended with status: ${status}`, 'error');
                    updateUIState('FAILED');
                }
            } catch (err) {
                addLog('Polling Error: ' + err.message, 'error');
                clearInterval(pollInterval);
            }
        }, 3000);
    };

    const fetchResults = async () => {
        addLog('Fetching extracted dataset...', 'info');
        try {
            const response = await fetch(`https://api.apify.com/v2/actor-runs/${currentRunId}/dataset/items?token=${apifyToken}&format=json`);
            const items = await response.json();
            
            addLog(`Successfully retrieved ${items.length} items.`, 'success');
            renderData(items);
        } catch (err) {
            addLog('Result Fetching Error: ' + err.message, 'error');
        }
    };

    const renderData = (data) => {
        if (!data || data.length === 0) {
            dataViewer.innerHTML = '<p style="color: grey;">No data returned from actor.</p>';
            return;
        }
        
        dataOutput.style.display = 'block';
        
        // Create a simple table preview
        const headers = Object.keys(data[0]).slice(0, 5); // Limit columns
        let html = '<table><thead><tr>';
        headers.forEach(h => html += `<th>${h}</th>`);
        html += '</tr></thead><tbody>';
        
        data.slice(0, 10).forEach(row => {
            html += '<tr>';
            headers.forEach(h => {
                const val = typeof row[h] === 'object' ? JSON.stringify(row[h]).substring(0, 50) + '...' : row[h];
                html += `<td>${val || '-'}</td>`;
            });
            html += '</tr>';
        });
        
        html += '</tbody></table>';
        if (data.length > 10) html += `<p style="margin-top:10px; font-size: 0.8rem; color: #aaa;">Showing first 10 rows of ${data.length} total.</p>`;
        
        dataViewer.innerHTML = html;

        // Custom styling for data viewer table since it's injected
        const style = document.createElement('style');
        style.innerHTML = `
            #dataViewer table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            #dataViewer th { text-align: left; padding: 12px; border-bottom: 2px solid var(--border); color: var(--primary-light); font-size: 0.85rem; text-transform: uppercase; }
            #dataViewer td { padding: 12px; border-bottom: 1px solid var(--border); font-size: 0.9rem; color: var(--text-secondary); }
            #dataViewer tr:hover { background: rgba(255,255,255,0.02); }
        `;
        document.head.appendChild(style);
    };

    const stopScraper = async () => {
        if (!currentRunId) return;
        addLog('Sending abort signal...', 'error');
        try {
            await fetch(`https://api.apify.com/v2/actor-runs/${currentRunId}/abort?token=${apifyToken}`, { method: 'POST' });
            addLog('Abort signal sent.', 'info');
        } catch (err) {
            addLog('Abort Error: ' + err.message, 'error');
        }
    };

    const downloadJson = () => {
        if (!currentRunId) return;
        window.open(`https://api.apify.com/v2/actor-runs/${currentRunId}/dataset/items?token=${apifyToken}&format=json&clean=true&attachment=true`, '_blank');
    };

    // 6. EVENT LISTENERS
    scraperForm.addEventListener('submit', startScraper);
    stopBtn.addEventListener('click', stopScraper);
    downloadResults.addEventListener('click', downloadJson);
    
    document.getElementById('clearPanel').addEventListener('click', () => {
        logPanel.innerHTML = '<div class="log-entry info">Panel cleared. Ready.</div>';
    });

    document.getElementById('copyLogs').addEventListener('click', () => {
        const text = logPanel.innerText;
        navigator.clipboard.writeText(text).then(() => {
            const original = statusBadge.textContent;
            statusBadge.textContent = 'COPIED!';
            setTimeout(() => statusBadge.textContent = original, 1000);
        });
    });

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('isAdmin');
            window.location.href = 'index.html';
        });
    }

    // Export CSV
    document.getElementById('exportCsv').addEventListener('click', () => {
        if (!currentRunId) return;
        window.open(`https://api.apify.com/v2/actor-runs/${currentRunId}/dataset/items?token=${apifyToken}&format=csv&clean=true&attachment=true`, '_blank');
    });
});
