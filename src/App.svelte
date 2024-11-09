<script>
    import Timer from './components/Timer.svelte';
    import { v4 as uuidv4 } from 'uuid';

    let timers = [];
    let showAddTimerForm = false;
    let newTimerDuration = 60;
    let newTimerShape = 'bar';

    // Load configurations on startup
    loadConfig();

    function addTimer() {
        timers = [...timers, { 
            id: uuidv4(), 
            TimerConfiguration: {
                duration: newTimerDuration, 
                shape: newTimerShape, 
                backgroundColor: '#e0e0e0', 
                progressBarColor: '#76c7c0', 
                borderRadius: 50, 
                containerWidth: 100, 
                containerHeight: 100, 
                circleRadius: 45, 
                padding: 10 
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
</script>

<button on:click={() => showAddTimerForm = !showAddTimerForm}>
    {showAddTimerForm ? 'Cancel' : 'Add Timer'}
</button>

{#if showAddTimerForm}
    <div class="add-timer-form">
        <label for="duration">Duration (seconds):</label>
        <input type="number" id="duration" bind:value={newTimerDuration} min="1" />

        <label for="shape">Shape:</label>
        <select id="shape" bind:value={newTimerShape}>
            <option value="bar">Bar</option>
            <option value="circle">Circle</option>
        </select>

        <button on:click={addTimer}>Create Timer</button>
    </div>
{/if}

<button on:click={saveConfig}>Save Default Config</button>
<button on:click={() => saveConfigToFile('timers_config')}>Save Config to File</button>
<input type="file" accept=".json" on:change={loadConfigFromFile} />

{#each timers as timer (timer.id)}
    <Timer 
        id={timer.id} 
        TimerConfiguration={timer.TimerConfiguration} 
        on:delete={deleteTimer} 
        on:configChange={(e) => updateTimer(timer.id, e.detail)} 
    />
{/each}

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
</style>
