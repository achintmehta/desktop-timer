<script>
    import { onMount, createEventDispatcher } from "svelte";
    import TimerControls from "./TimerControls.svelte";
    import "../styles/Timer.css";

    export let TimerConfiguration = {
        message: "",
        duration: 60,
        shape: "bar",
        backgroundColor: "#e0e0e0",
        progressBarColor: "#76c7c0",
        borderRadius: 50,
        containerWidth: 100,
        containerHeight: 100,
        circleRadius: 45,
        circleStrokeWidth: 10,
        padding: 10,
        font: "Arial",
        messageColor: "#000",
        messagePadding: 10,
        timerMargin: 10,
        timerTextColor: "#000",
        timerTextFontSize: 16,
        messageTextFontSize: 16,
    };
    export let id;
    export let showControls = false;

    const dispatch = createEventDispatcher();

    let {
        message,
        duration,
        shape,
        backgroundColor,
        progressBarColor,
        borderRadius,
        containerWidth,
        containerHeight,
        circleRadius,
        circleWidth,
        circleStrokeWidth,
        padding,
        font,
        messageColor,
        messagePadding,
        timerMargin,
        timerTextColor,
        timerTextFontSize,
        messageTextFontSize,
    } = TimerConfiguration;

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
        dispatch("delete", { id });
    }

    function updateConfig() {
        dispatch("configChange", {
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

    onMount(() => {
        startTimer();
        return () => {
            clearInterval(interval);
        };
    });

    $: progress = (timeLeft / duration) * 100;
    $: circumference = 2 * Math.PI * circleRadius;
    $: dashOffset = circumference - (circumference * progress) / 100;
    $: if (!showControls) showConfig = false; // Close config if controls are hidden
    $: formattedTime =
        timeLeft > 60
            ? `${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, "0")}`
            : timeLeft;
</script>

<div style=" margin-bottom: {timerMargin}px;">
    <div class="controls">
        {#if message}
            <div
                class="message-text"
                style="font-family: {font}; color: {messageColor}; padding: {messagePadding}px; font-size: {messageTextFontSize}px;"
            >
                {message}
            </div>
        {/if}

        <div
            class="outer-container"
            style="--background-color: {backgroundColor}; --progress-bar-color: {progressBarColor}; --container-width: {containerWidth}%; --container-height: {containerHeight}px; --circle-radius: {circleRadius}px; --border-radius: {borderRadius}px; --padding: {padding}px; --circle-width: {circleWidth}px; --circle-stroke-width: {circleStrokeWidth}px; margin-bottom: {timerMargin}px;"
        >
            <div class="inner-container">
                {#if shape === "bar"}
                    <div
                        class="progress-bar"
                        style="width: {progress}%; background-color: var(--progress-bar-color);"
                    ></div>
                    <p
                        class="timer-text"
                        style="font-family: {font}; color: {timerTextColor}; font-size: {timerTextFontSize}px;"
                    >
                        {formattedTime}
                    </p>
                {:else if shape === "circle"}
                    <div class="circle-container">
                        <svg
                            width={circleWidth}
                            height="100%"
                            viewBox="0 0 {2 * circleRadius + padding} {2 *
                                circleRadius +
                                padding}"
                        >
                            <circle
                                cx="50%"
                                cy="50%"
                                r={circleRadius}
                                fill="none"
                                stroke="var(--progress-bar-color)"
                                stroke-width={circleStrokeWidth}
                                class="circle"
                                style="stroke-dasharray: {circumference}; stroke-dashoffset: {dashOffset};"
                            />
                        </svg>
                        <div
                            class="circle-text"
                            style="font-family: {font}; color: {timerTextColor}; font-size: {timerTextFontSize}px;"
                        >
                            {formattedTime}
                        </div>
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
                        <button
                            class="icon-button"
                            on:click={stopTimer}
                            title="Pause">❚❚</button
                        >
                    {:else}
                        <button
                            class="icon-button"
                            on:click={startTimer}
                            title="Start">►</button
                        >
                    {/if}
                    <button
                        class="icon-button"
                        on:click={resetTimer}
                        title="Reset">↻</button
                    >
                </div>
            </div>
            <div class="right-buttons">
                <button
                    class="icon-button"
                    on:click={deleteTimer}
                    title="Delete">❌</button
                >
                <button
                    class="icon-button"
                    on:click={() => (showConfig = !showConfig)}
                    title="Settings">⚙️</button
                >
            </div>
        </div>
    {/if}

    {#if showConfig}
        <TimerControls
            bind:message
            bind:duration
            bind:shape
            bind:backgroundColor
            bind:progressBarColor
            bind:borderRadius
            bind:containerWidth
            bind:containerHeight
            bind:circleRadius
            bind:circleStrokeWidth
            bind:padding
            bind:font
            bind:messageColor
            bind:messagePadding
            bind:timerMargin
            bind:timerTextColor
            bind:timerTextFontSize
            bind:messageTextFontSize
            on:configChange={updateConfig}
        />
    {/if}
</div>
