<script>
    export let font;
    export let updateConfig;
</script>

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

<style>
    .slider-container {
        display: flex;
        align-items: center;
        margin-top: 10px;
    }
    .slider-container label {
        flex: 1;
    }
    .slider-container select {
        flex: 2;
    }
</style>
