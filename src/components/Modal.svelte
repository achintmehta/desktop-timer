<script>
    export let show = false;
    export let title = '';
    export let onClose;

    function closeModal() {
        if (onClose) onClose();
    }
</script>

<style>
    .modal {
        display: none;
        position: fixed;
        z-index: 1;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgb(0,0,0);
        background-color: rgba(0,0,0,0.4);
    }

    .modal.show {
        display: block;
    }

    .modal-content {
        background-color: #fefefe;
        margin: 15% auto;
        padding: 20px;
        border: 1px solid #888;
        width: 80%;
    }

    .close {
        color: #aaa;
        float: right;
        font-size: 28px;
        font-weight: bold;
    }

    .close:hover,
    .close:focus {
        color: black;
        text-decoration: none;
        cursor: pointer;
    }
</style>

<div class="modal {show ? 'show' : ''}">
    <div class="modal-content">
        <span class="close" on:click={closeModal}>×</span>
        <h2>{title}</h2>
        <slot></slot>
    </div>
</div>
