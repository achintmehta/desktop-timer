<script>
    import { onMount, createEventDispatcher } from 'svelte';

    export let TimerConfiguration = {
        name: '',
        duration: 60,
        shape: 'bar',
        backgroundColor: '#e0e0e0',
        progressBarColor: '#76c7c0',
        borderRadius: 50,
        containerWidth: 100,
        containerHeight: 100,
        circleRadius: 45,
        padding: 10,
        font: 'Arial'
    };
    export let id;
    export let showControls = false;

    const dispatch = createEventDispatcher();

    let { name, duration, shape, backgroundColor, progressBarColor, borderRadius, containerWidth, containerHeight, circleRadius, padding, font } = TimerConfiguration;

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
            name,
            duration, 
            shape, 
            backgroundColor, 
            progressBarColor, 
            borderRadius, 
            containerWidth, 
            containerHeight, 
            circleRadius, 
            padding,
            font
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

    $: formattedTime = timeLeft > 60 
        ? `${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, '0')}` 
        : timeLeft;
</script>

<style>
    .outer-container {
        position: relative;
        background-color: var(--background-color, #e0e0e0);
        overflow: hidden;
        margin-bottom: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        height: var(--container-height, 100px);
        min-width: calc(2 * var(--circle-radius, 45px) + var(--padding, 10px));
        width: var(--container-width, 80%);
        border-radius: var(--border-radius, 10px);
    }

    .inner-container {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .progress-bar {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        background-color: var(--progress-bar-color, #76c7c0);
        transition: width 1s linear;
    }

    .timer-text {
        position: relative;
        z-index: 1;
        text-align: center;
        padding: 10px;
        font-size: 1.5em;
        font-family: var(--font, Arial);
    }

    .circle-container {
        display: flex;
        justify-content: center;
        align-items: center;
        width: calc(2 * var(--circle-radius, 45px));
        height: calc(2 * var(--circle-radius, 45px));
    }

    .circle {
        transition: stroke-dashoffset 1s linear;
        stroke: var(--progress-bar-color, #76c7c0);
    }

    .circle-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 1.5em;
        text-align: center;
        font-family: var(--font, Arial);
    }

    .slider-container {
        margin-top: 10px;
    }

    .config-section {
        margin-top: 10px;
        border: 1px solid #ccc;
        padding: 10px;
        border-radius: 5px;
    }

    .config-toggle {
        cursor: pointer;
        background-color: #f0f0f0;
        border: none;
        padding: 5px 10px;
        border-radius: 5px;
        margin-top: 10px;
    }

    .config-toggle:hover {
        background-color: #e0e0e0;
    }

    .icon-button {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.5em;
        margin: 0 5px;
    }

    .icon-button:hover {
        color: #0078d4;
    }

    .controls-left {
        display: flex;
        justify-content: flex-start;
    }

    .controls-right {
        display: flex;
        justify-content: flex-end;
        margin-left: auto;
    }
</style>

<div class="outer-container" style="--background-color: {backgroundColor}; --container-width: {containerWidth}%; --container-height: {containerHeight}px; --circle-radius: {circleRadius}px; --border-radius: {borderRadius}px; --padding: {padding}px;">
    <div class="inner-container">
        {#if name}
            <div class="timer-name" style="font-family: {font};">{name}</div>
        {/if}
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

{#if showControls}
    <div class="controls-left">
        {#if isRunning}
            <button class="icon-button" on:click={stopTimer} title="Pause">❚❚</button>
        {:else}
            <button class="icon-button" on:click={startTimer} title="Start">►</button>
        {/if}
        <button class="icon-button" on:click={resetTimer} title="Reset">↻</button>
    </div>
    <div class="controls-right">
        <button class="icon-button" on:click={deleteTimer} title="Delete">❌</button>
        <button class="icon-button" on:click={() => showConfig = !showConfig} title="Settings">⚙️</button>
    </div>
{/if}

{#if showConfig}
    <div class="config-section">
        <div class="slider-container">
            <label for="backgroundColor">Background Color:</label>
            <input type="color" id="backgroundColor" bind:value={backgroundColor} on:change={updateConfig} />
        </div>
        <div class="slider-container">
            <label for="progressBarColor">Progress Bar Color:</label>
            <input type="color" id="progressBarColor" bind:value={progressBarColor} on:change={updateConfig} />
        </div>
        <div class="slider-container">
            <label for="borderRadius">Border Radius: {borderRadius}px</label>
            <input type="range" id="borderRadius" min="0" max="250" bind:value={borderRadius} on:input={updateConfig} />
        </div>
        <div class="slider-container">
            <label for="containerWidth">Container Width: {containerWidth}%</label>
            <input type="range" id="containerWidth" min={Math.ceil((2 * circleRadius + padding) / window.innerWidth * 100)} max="100" bind:value={containerWidth} on:input={updateConfig} />
        </div>
        <div class="slider-container">
            <label for="containerHeight">Container Height: {containerHeight}px</label>
            <input type="range" id="containerHeight" min="50" max="250" bind:value={containerHeight} on:input={updateConfig} />
        </div>
        <div class="slider-container">
            <label for="circleRadius">Circle Radius: {circleRadius}px</label>
            <input type="range" id="circleRadius" min="20" max="250" bind:value={circleRadius} on:input={updateConfig} />
        </div>
        <div class="slider-container">
            <label for="padding">Padding: {padding}px</label>
            <input type="range" id="padding" min="0" max="20" bind:value={padding} on:input={updateConfig} />
        </div>
    </div>
{/if}
