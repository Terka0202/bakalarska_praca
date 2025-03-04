document.addEventListener("DOMContentLoaded", () => {
    const openModalBtn = document.getElementById("openModalBtn");
    const closeAndSaveModalBtn = document.getElementById("closeAndSaveModalBtn");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const editModal = document.getElementById("editModal");

    const openModalHeslo = document.getElementById("openModalHeslo");
    const closeSaveModalHeslo = document.getElementById("closeSaveModalHeslo");
    const closeModalHeslo = document.getElementById("closeModalHeslo");
    const editModalHeslo = document.getElementById("editModalHeslo");

    // Otvorenie modalu
    openModalBtn.addEventListener("click", () => {
        editModal.classList.remove("hidden");
        editModal.classList.add("flex");
    });

    // Zatvorenie modalu a uloženie zmien
    closeAndSaveModalBtn.addEventListener("click", () => {
        editModal.classList.add("hidden");
        editModal.classList.remove("flex");
    });

    // Zatvorenie modalu
    closeModalBtn.addEventListener("click", () => {
        editModal.classList.add("hidden");
        editModal.classList.remove("flex");
    });



    //HESLO

    // Otvorenie modalu
    openModalHeslo.addEventListener("click", () => {
        editModalHeslo.classList.remove("hidden");
        editModalHeslo.classList.add("flex");
    });

    // Zatvorenie modalu a uloženie zmien
    closeSaveModalHeslo.addEventListener("click", () => {
        editModalHeslo.classList.add("hidden");
        editModalHeslo.classList.remove("flex");
    });

    // Zatvorenie modalu
    closeModalHeslo.addEventListener("click", () => {
        editModalHeslo.classList.add("hidden");
        editModalHeslo.classList.remove("flex");
    });


});
