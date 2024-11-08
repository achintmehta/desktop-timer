<!-- Timer.svelte -->
<script>
    import { onMount } from 'svelte';
    import { createEventDispatcher } from 'svelte';

    export let duration;
    export let shape = 'bar'; // 'bar' or 'circle'
    export let id;

    const dispatch = createEventDispatcher();

    let timeLeft = duration;
    let interval;
    let borderRadius = 50; // Default border radius
    let containerWidth = 100; // Default container width percentage
    let containerHeight = 100; // Default container height
    let circleRadius = 45; // Default circle radius
    let padding = 10; // Default padding
    let showConfig = false; // Toggle for configuration section

    function startTimer() {
        clearInterval(interval);
        interval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft -= 1;
            } else {
                clearInterval(interval);
            }
        }, 1000);
    }

    function stopTimer() {
        clearInterval(interval);
    }

    function resetTimer() {
        clearInterval(interval);
        timeLeft = duration;
    }

    function deleteTimer() {
        dispatch('delete', { id });
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
        background-color: #e0e0e0;
        overflow: hidden;
        margin-bottom: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        height: var(--container-height, 100px); /* Default height */
        min-width: calc(2 * var(--circle-radius, 45px) + var(--padding, 10px)); /* Ensure it doesn't go smaller than the circle */
        width: var(--container-width, 80%); /* Default width */
        border-radius: var(--border-radius, 10px); /* Rounded corners */
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
        background-color: #76c7c0;
        transition: width 1s linear;
    }

    .timer-text {
        position: relative;
        z-index: 1;
        text-align: center;
        padding: 10px;
        font-size: 1.5em;
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
    }

    .circle-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 1.5em;
        text-align: center;
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
</style>

<div class="outer-container" style="--container-width: {containerWidth}%; --container-height: {containerHeight}px; --circle-radius: {circleRadius}px; --border-radius: {borderRadius}px; --padding: {padding}px;">
    <div class="inner-container">
        {#if shape === 'bar'}
            <div class="progress-bar" style="width: {progress}%;"></div>
            <p class="timer-text">{formattedTime}</p>
        {:else if shape === 'circle'}
            <div class="circle-container">
                <svg width="100%" height="100%" viewBox="0 0 {2 * circleRadius + padding} {2 * circleRadius + padding}">
                    <circle cx="50%" cy="50%" r="{circleRadius}" fill="none" stroke="#e0e0e0" stroke-width="10" />
                    <circle cx="50%" cy="50%" r="{circleRadius}" fill="none" stroke="#76c7c0" stroke-width="10" class="circle" style="stroke-dasharray: {circumference}; stroke-dashoffset: {dashOffset};" />
                </svg>
                <div class="circle-text">{formattedTime}</div>
            </div>
        {/if}
    </div>
</div>

<div>
    <button class="icon-button" on:click={stopTimer} title="Pause">❚❚</button>
    <button class="icon-button" on:click={startTimer} title="Start">►</button>
    <button class="icon-button" on:click={resetTimer} title="Reset">↻</button>
    <button class="icon-button" on:click={deleteTimer} title="Delete">❌</button>
</div>

<button class="config-toggle" on:click={() => showConfig = !showConfig}>
    {showConfig ? 'Hide Configuration' : 'Show Configuration'}
</button>

{#if showConfig}
    <div class="config-section">
        <div class="slider-container">
            <label for="borderRadius">Border Radius: {borderRadius}px</label>
            <input type="range" id="borderRadius" min="0" max="250" bind:value={borderRadius} />
        </div>
        <div class="slider-container">
            <label for="containerWidth">Container Width: {containerWidth}%</label>
            <input type="range" id="containerWidth" min={Math.ceil((2 * circleRadius + padding) / window.innerWidth * 100)} max="100" bind:value={containerWidth} />
        </div>
        <div class="slider-container">
            <label for="containerHeight">Container Height: {containerHeight}px</label>
            <input type="range" id="containerHeight" min="50" max="250" bind:value={containerHeight} />
        </div>
        <div class="slider-container">
            <label for="circleRadius">Circle Radius: {circleRadius}px</label>
            <input type="range" id="circleRadius" min="20" max="250" bind:value={circleRadius} />
        </div>
        <div class="slider-container">
            <label for="padding">Padding: {padding}px</label>
            <input type="range" id="padding" min="0" max="20" bind:value={padding} />
        </div>
    </div>
{/if}
