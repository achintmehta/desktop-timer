<!-- App.svelte -->
<script>
    import Timer from './components/Timer.svelte';
    import { v4 as uuidv4 } from 'uuid';

    let timers = [];

    function addTimer() {
        timers = [...timers, { id: uuidv4(), duration: 10, shape: 'bar' }];
    }

    function deleteTimer(event) {
        timers = timers.filter(timer => timer.id !== event.detail.id);
    }
</script>

<button on:click={addTimer}>Add Timer</button>

<Timer id=10 duration=120 shape="circle" on:delete={deleteTimer} />
<Timer id=20 duration=20 shape="bar" on:delete={deleteTimer} />

{#each timers as timer (timer.id)}
    <Timer id={timer.id} duration={timer.duration} shape={timer.shape} on:delete={deleteTimer} />
{/each}
