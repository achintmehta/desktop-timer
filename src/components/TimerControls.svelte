<script>
    import { createEventDispatcher } from 'svelte';
    import { tweened } from 'svelte/motion';
    import { quintOut } from 'svelte/easing';
    import '../styles/TimerControls.css'; 
    import FontSelection from './FontSelection.svelte';

    export let circleStrokeWidth;
    export let message;
    export let duration;
    export let shape;
    export let backgroundColor;
    export let progressBarColor;
    export let borderRadius;
    export let containerWidth;
    export let containerHeight;
    export let circleRadius;
    export let padding;
    export let font;
    export let messageColor;
    export let messagePadding;
    export let timerMargin;
    export let timerTextColor;
    export let timerTextFontSize;
    export let messageTextFontSize;
    const dispatch = createEventDispatcher();

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
            messagePadding,
            timerMargin,
            timerTextColor,
            timerTextFontSize,
            messageTextFontSize 
        });
    }

    let showAppearanceSettings = false;
    let showFontSettings = false;
    let showPaddingSettings = false;

    const appearanceHeight = tweened(0, { duration: 300, easing: quintOut });
    const fontHeight = tweened(0, { duration: 300, easing: quintOut });
    const paddingHeight = tweened(0, { duration: 300, easing: quintOut });

    function toggleAppearanceSettings() {
        showAppearanceSettings = !showAppearanceSettings;
        appearanceHeight.set(showAppearanceSettings ? 150 : 0);
    }

    function toggleFontSettings() {
        showFontSettings = !showFontSettings;
        fontHeight.set(showFontSettings ? 150 : 0);
    }

    function togglePaddingSettings() {
        showPaddingSettings = !showPaddingSettings;
        paddingHeight.set(showPaddingSettings ? 150 : 0);
    }
</script>

<div class="config-section">
    <button class="config-toggle" on:click={toggleAppearanceSettings}>
        <span class="symbol">{showAppearanceSettings ? '-' : '+'}</span>
        Appearance Settings
    </button>
    <div style="overflow: hidden; height: {appearanceHeight}px;">
        {#if showAppearanceSettings}
            <div class="slider-container">
                <label for="backgroundColor">Background:</label>
                <input type="color" id="backgroundColor" bind:value={backgroundColor} on:change={updateConfig} />
            </div>
            <div class="slider-container">
                <label for="progressBarColor">Progress Bar:</label>
                <input type="color" id="progressBarColor" bind:value={progressBarColor} on:change={updateConfig} />
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
            {#if shape === 'circle'}
                <div class="slider-container">
                    <label for="circleRadius">Circle Radius:</label>
                    <input type="range" id="circleRadius" min="20" max="250" bind:value={circleRadius} on:input={updateConfig} />
                </div>
            {/if}
            {#if shape === 'circle'}
             <div class="slider-container"> <label for="circleRadius">Circle Radius:</label> <input type="range" id="circleRadius" min="20" max="250" bind:value={circleRadius} on:input={updateConfig} /> </div> <div class="slider-container"> <label for="circleStrokeWidth">Circle Stroke Width:</label> <input type="range" id="circleStrokeWidth" min="1" max="20" bind:value={circleStrokeWidth} on:input={updateConfig} /> <!-- New --> </div>
              {/if}
        {/if}
    </div>
</div>

<div class="config-section">
    <button class="config-toggle" on:click={toggleFontSettings}>
        <span class="symbol">{showFontSettings ? '-' : '+'}</span>
        Font Settings
    </button>
    <div style="overflow: hidden; height: {fontHeight}px;">
        {#if showFontSettings}
            <FontSelection bind:font={font} {updateConfig} />
            <div class="slider-container">
                <label for="message">Message:</label>
                <input type="text" id="message" bind:value={message} on:input={updateConfig} />
            </div>
            <div class="slider-container">
                <label for="messageColor">Message Color:</label>
                <input type="color" id="messageColor" bind:value={messageColor} on:change={updateConfig} />
            </div>
            <div class="slider-container">
                <label for="messageTextFontSize">Message Font Size:</label>
                <input type="range" id="messageTextFontSize" min="10" max="50" bind:value={messageTextFontSize} on:input={updateConfig} />
            </div>
            <div class="slider-container">
                <label for="timerTextColor">Timer Text Color:</label>
                <input type="color" id="timerTextColor" bind:value={timerTextColor} on:change={updateConfig} />
            </div>
            <div class="slider-container">
                <label for="timerTextFontSize">Timer Text Size:</label>
                <input type="range" id="timerTextFontSize" min="10" max="50" bind:value={timerTextFontSize} on:input={updateConfig} />
            </div>
        {/if}
    </div>
</div>

<div class="config-section">
    <button class="config-toggle" on:click={togglePaddingSettings}>
        <span class="symbol">{showPaddingSettings ? '-' : '+'}</span>
        Padding Settings
    </button>
    <div style="overflow: hidden; height: {paddingHeight}px;">
        {#if showPaddingSettings}
            {#if shape === 'circle'}
                <div class="slider-container">
                    <label for="padding">Padding:</label>
                    <input type="range" id="padding" min="0" max="20" bind:value={padding} on:input={updateConfig} />
                </div>
            {/if}
            <div class="slider-container">
                <label for="messagePadding">Message Padding:</label>
                <input type="range" id="messagePadding" min="0" max="250" bind:value={messagePadding} on:input={updateConfig} />
            </div>
            <div class="slider-container">
                <label for="timerMargin">Timer Margin:</label>
                <input type="range" id="timerMargin" min="0" max="200" bind:value={timerMargin} on:input={updateConfig} />
            </div>
        {/if}
    </div>
</div>
