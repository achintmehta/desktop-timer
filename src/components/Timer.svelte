<script>
    import { onMount, createEventDispatcher } from 'svelte';
    import '../styles/Timer.css';

    export let TimerConfiguration = {
        message: '',
        duration: 60,
        shape: 'bar',
        backgroundColor: '#e0e0e0',
        progressBarColor: '#76c7c0',
        borderRadius: 50,
        containerWidth: 100,
        containerHeight: 100,
        circleRadius: 45,
        padding: 10,
        font: 'Arial',
        messageColor: '#000', 
        messagePadding: 10
    };
    export let id;
    export let showControls = false;

    const dispatch = createEventDispatcher();

    let { message, duration, shape, backgroundColor, progressBarColor, borderRadius, containerWidth, containerHeight, circleRadius, padding, font, messageColor, messagePadding } = TimerConfiguration;

    let timeLeft = duration;
    let interval;
    let showConfig = false;
    let isRunning = false;

    function startTimer() {
        clearInterval(interval);
        interval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft -= 1;
            } else {
                clearInterval(interval);
                isRunning = false;
            }
        }, 1000);
        isRunning = true;
    }

    function stopTimer() {
        clearInterval(interval);
        isRunning = false;
    }

    function resetTimer() {
        clearInterval(interval);
        timeLeft = duration;
        isRunning = false;
    }

    function deleteTimer() {
        dispatch('delete', { id });
    }

    function updateConfig() {
        dispatch('configChange', { 
            message,
            duration, 
            shape, 
            backgroundColor, 
            progressBarColor, 
            borderRadius, 
            containerWidth, 
            containerHeight, 
            circleRadius, 
            padding,
            font,
            messageColor,
            messagePadding
        });
    }

    onMount(() => {
        startTimer();
        return () => {
            clearInterval(interval);
        };
    });

    $: progress = (timeLeft / duration) * 100;
    $: circumference = 2 * Math.PI * circleRadius;
    $: dashOffset = circumference - (circumference * progress) / 100;

    $: formattedTime = (timeLeft > 60 
        ? `${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, '0')}` 
        : timeLeft);
</script>

<div class="controls">
    {#if message}
        <div class="message-text" style="font-family: {font}; color: {messageColor}; padding: {messagePadding};">{message}</div> <!-- Moved message above the progress bar -->
    {/if}

    <div class="outer-container" style="--background-color: {backgroundColor}; --container-width: {containerWidth}%; --container-height: {containerHeight}px; --circle-radius: {circleRadius}px; --border-radius: {borderRadius}px; --padding: {padding}px;">
        <div class="inner-container">
            {#if shape === 'bar'}
                <div class="progress-bar" style="width: {progress}%; background-color: {progressBarColor};"></div>
                <p class="timer-text" style="font-family: {font};">{formattedTime}</p>
            {:else if shape === 'circle'}
                <div class="circle-container">
                    <svg width="100%" height="100%" viewBox="0 0 {2 * circleRadius + padding} {2 * circleRadius + padding}">
                        <circle cx="50%" cy="50%" r="{circleRadius}" fill="none" stroke="#e0e0e0" stroke-width="10" />
                        <circle cx="50%" cy="50%" r="{circleRadius}" fill="none" stroke="{progressBarColor}" stroke-width="10" class="circle" style="stroke-dasharray: {circumference}; stroke-dashoffset: {dashOffset};" />
                    </svg>
                    <div class="circle-text" style="font-family: {font};">{formattedTime}</div>
                </div>
            {/if}
        </div>
    </div>
</div>


{#if showControls}
    <div class="controls">
        <div class="left-buttons-container">
            <div class="left-buttons">
                {#if isRunning}
                    <button class="icon-button" on:click={stopTimer} title="Pause">❚❚</button>
                {:else}
                    <button class="icon-button" on:click={startTimer} title="Start">►</button>
                {/if}
                <button class="icon-button" on:click={resetTimer} title="Reset">↻</button>
            </div>
        </div>
        <div class="right-buttons">
            <button class="icon-button" on:click={deleteTimer} title="Delete">❌</button>
            <button class="icon-button" on:click={() => showConfig = !showConfig} title="Settings">⚙️</button>
        </div>
    </div>
{/if}

{#if showConfig}
    <div class="config-section">
        <div class="slider-container">
            <label for="message">Message:</label>
            <input type="text" id="message" bind:value={message} on:input={updateConfig} />
        </div>
        <div class="slider-container">
            <label for="backgroundColor">Background:</label>
            <input type="color" id="backgroundColor" bind:value={backgroundColor} on:change={updateConfig} />
        </div>
        <div class="slider-container">
            <label for="progressBarColor">Progress Bar:</label>
            <input type="color" id="progressBarColor" bind:value={progressBarColor} on:change={updateConfig} />
        </div>
        <div class="slider-container">
            <label for="messageColor">Message Color:</label>
            <input type="color" id="messageColor" bind:value={messageColor} on:change={updateConfig} />
        </div>
        <div class="slider-container">
            <label for="messagePadding">Message Padding:</label>
            <input type="range" id="messagePadding"  min="0" max="250" bind:value={messagePadding} on:change={updateConfig} />
        </div>
        <div class="slider-container">
            <label for="borderRadius">Border Radius:</label>
            <input type="range" id="borderRadius" min="0" max="250" bind:value={borderRadius} on:input={updateConfig} />
        </div>
        <div class="slider-container">
            <label for="containerWidth">Width:</label>
            <input type="range" id="containerWidth" min={Math.ceil((2 * circleRadius + padding) / window.innerWidth * 100)} max="100" bind:value={containerWidth} on:input={updateConfig} />
        </div>
        <div class="slider-container">
            <label for="containerHeight">Height:</label>
            <input type="range" id="containerHeight" min="50" max="250" bind:value={containerHeight} on:input={updateConfig} />
        </div>
        <div class="slider-container">
            <label for="circleRadius">Circle Radius:</label>
            <input type="range" id="circleRadius" min="20" max="250" bind:value={circleRadius} on:input={updateConfig} />
        </div>
        <div class="slider-container">
            <label for="padding">Padding:</label>
            <input type="range" id="padding" min="0" max="20" bind:value={padding} on:input={updateConfig} />
        </div>
        <div class="slider-container">
            <label for="font">Font:</label>
            <select id="font" bind:value={font} on:change={updateConfig}>
                <option value="Arial">Arial</option>
                <option value="Courier New">Courier New</option>
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Verdana">Verdana</option>
                <option value="'Henny Penny', sans-serif">Henny Penny</option>
                <option value="'Eater', sans-serif">Eater</option>
                <option value="'Gugi', sans-serif">Gugi</option>
                <option value="'HomemadeApple', sans-serif">Homemade Apple</option>
                <option value="'Kalam', sans-serif">Kalam</option>
                <option value="'KeaniaOne', sans-serif">Keania One</option>
                <option value="'Knewave', sans-serif">Knewave</option>
                <option value="'Kranky', sans-serif">Kranky</option>
                <option value="'Leckerli', sans-serif">Leckerli</option>
                <option value="'MacondoSwashCaps', sans-serif">Macondo Swash Caps</option>
                <option value="'Monoton', sans-serif">Monoton</option>
                <option value="'MrsSaintDelafield', sans-serif">Mrs Saint Delafield</option>
                <option value="'MsMadi', sans-serif">Ms Madi</option>
                <option value="'Nosifer', sans-serif">Nosifer</option>
                <option value="'Orbitron', sans-serif">Orbitron</option>
                <option value="'PermanentMarker', sans-serif">Permanent Marker</option>
                <option value="'PinyonScript', sans-serif">Pinyon Script</option>
                <option value="'Qwigley', sans-serif">Qwigley</option>
                <option value="'ReenieBeanie', sans-serif">Reenie Beanie</option>
                <option value="'Revalia', sans-serif">Revalia</option>
                <option value="'Rubiks80sFade', sans-serif">Rubiks 80s Fade</option>
                <option value="'Silkscreen', sans-serif">Silkscreen</option>
                <option value="'SpecialElite', sans-serif">Special Elite</option>
                <option value="'Tourney', sans-serif">Tourney</option>
                <option value="'TrainOne', sans-serif">Train One</option>
                <option value="'TulpenOne', sans-serif">Tulpen One</option>
            </select>
        </div>
    </div>
{/if}
