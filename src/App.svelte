<script>
    import Timer from './components/Timer.svelte';
    import Modal from './components/Modal.svelte';
    import { v4 as uuidv4 } from 'uuid';
    import { loop_guard } from 'svelte/internal';

    let timers = [];
    let showAddTimerForm = false;
    let showConfigModal = false;
    let newTimerDuration = 60;
    let newTimerShape = 'bar';
    let newTimerName = '';
    let newTimerFont = 'Arial';
    let showTimerControls = false;
    let showAddSaveControls = false;

    // Load configurations on startup
    loadConfig();

    function addTimer() {
        timers = [...timers, { 
            id: uuidv4(), 
            TimerConfiguration: {
                name: newTimerName,
                duration: newTimerDuration, 
                shape: newTimerShape, 
                backgroundColor: '#e0e0e0', 
                progressBarColor: '#76c7c0', 
                borderRadius: 50, 
                containerWidth: 100, 
                containerHeight: 100, 
                circleRadius: 45, 
                circleStrokeWidth: 10,
                padding: 10,
                font: newTimerFont,
                messagePadding: 10,
                timerMargin: 10,
                timerTextColor: '#000',
                timerTextFontSize: 16,
                messageTextFontSize: 16
            } 
        }];
        saveConfig(); // Save config after adding a new timer
        showAddTimerForm = false; // Hide the form after adding the timer
    }

    function deleteTimer(event) {
        timers = timers.filter(timer => timer.id !== event.detail.id);
        saveConfig(); // Save config after deleting a timer
    }

    function saveConfig() {
        localStorage.setItem('timers', JSON.stringify(timers));
    }

    function loadConfig() {
        const savedTimers = localStorage.getItem('timers');
        if (savedTimers) {
            timers = JSON.parse(savedTimers);
        }
    }

    function saveConfigToFile(filename) {
        saveConfig(); // Ensure the latest config is saved to local storage
        const blob = new Blob([JSON.stringify(timers)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${filename}.json`;
        a.click();
    }

    function loadConfigFromFile(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            timers = JSON.parse(e.target.result);
            saveConfig(); // Save loaded config to local storage
            event.target.value = ''; // Reset the file input element
        };
        reader.readAsText(file);
    }

    function updateTimer(id, newConfig) {
        timers = timers.map(timer =>
            timer.id === id ? { ...timer, TimerConfiguration: newConfig } : timer
        );
        saveConfig(); // Save config after updating a timer
    }

    function toggleTimerControls() {
    showTimerControls = !showTimerControls;
    if (!showTimerControls) {
        timers.forEach(timer => {
            timer.showConfig = false; // Hide config for all timers
        });
    }
}
    function toggleAddSaveControls() {
        showAddSaveControls = !showAddSaveControls;
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 't') {
            toggleTimerControls();
        } else if (event.key === 's') {
            toggleAddSaveControls();
        }
    });
</script>

{#each timers as timer (timer.id)}
    <Timer 
        id={timer.id} 
        TimerConfiguration={timer.TimerConfiguration} 
        on:delete={deleteTimer} 
        on:configChange={(e) => updateTimer(timer.id, e.detail)} 
        showControls={showTimerControls}
    />
{/each}

<Modal show={showAddTimerForm} title="Add Timer" onClose={() => showAddTimerForm = false}>
    <div class="add-timer-form">
        <label for="name">Name (optional):</label>
        <input type="text" id="name" bind:value={newTimerName} />

        <label for="duration">Duration (seconds):</label>
        <input type="number" id="duration" bind:value={newTimerDuration} min="1" />

        <label for="shape">Shape:</label>
        <select id="shape" bind:value={newTimerShape}>
            <option value="bar">Bar</option>
            <option value="circle">Circle</option>
        </select>

        <label for="font">Font:</label>
        <select id="font" bind:value={newTimerFont}>
            <option value="Arial">Arial</option>
            <option value="Courier New">Courier New</option>
            <option value="Georgia">Georgia</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Verdana">Verdana</option>
        </select>

        <button on:click={addTimer}>Create Timer</button>
    </div>
</Modal>

<Modal show={showConfigModal} title="Configuration" onClose={() => showConfigModal = false}>
    <!-- Configuration content goes here -->
</Modal>

<div class="bottom-controls" style="display: {showAddSaveControls || timers.length === 0 ? 'flex' : 'none'};">
    <button on:click={() => showAddTimerForm = true}>Add Timer</button>
    <button on:click={saveConfig}>Save Default Config</button>
    <button on:click={() => saveConfigToFile('timers_config')}>Save Config to File</button>
    <input type="file" accept=".json" on:change={loadConfigFromFile} />
</div>

<style>
    .add-timer-form {
        margin-top: 10px;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
    }

    .add-timer-form label {
        margin-top: 5px;
    }

    .add-timer-form input,
    .add-timer-form select {
        margin-top: 5px;
        padding: 5px;
        border: 1px solid #ccc;
        border-radius: 5px;
    }

    .add-timer-form button {
        margin-top: 10px;
        padding: 5px 10px;
        border: none;
        border-radius: 5px;
        background-color: #0078d4;
        color: white;
        cursor: pointer;
    }

    .add-timer-form button:hover {
        background-color: #005a9e;
    }

    .bottom-controls {
        position: fixed;
        bottom: 10px;
        width: 100%;
        display: flex;
        justify-content: center;
        gap: 10px;
    }
</style>
