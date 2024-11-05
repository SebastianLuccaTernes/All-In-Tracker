function updateFormAction() {
    const selectElement = document.getElementById('select-player');
    const selectedPlayer = selectElement.value;
    const form = document.getElementById('delete-player-form');
    form.action = `/add-player/${selectedPlayer}/delete`;
}