let currentPage = 0; // Začneme od 2 stránky (0 znamená prvé 3 divy, 1 dalsie 3 div, atd)
const divCount = 3; // Počet divov, ktoré chceme zobraziť na stránku
const excursions = document.querySelectorAll('.divko'); // Získame všetky divy


function updateDisplay() {

    excursions.forEach(function(div, index) {
        
        if (index >= currentPage * divCount && index < (currentPage + 1) * divCount) {
            div.style.display = 'block'; 
        } else {                              
            div.style.display = 'none'; 
        }
    });

    document.getElementById('prev-page').disabled = currentPage === 0; // Zakážeme tlačidlo, keď sme na prvej stránke
    document.getElementById('next-page').disabled = (currentPage + 1) * divCount >= excursions.length; // Zakážeme tlačidlo, keď sme na poslednej stránke
}



// "Nasledujúce"
document.getElementById('next-page').addEventListener('click', function() {
    if ((currentPage + 1) * divCount < excursions.length) {
        currentPage++; // Prejdi na ďalšiu stránku
        updateDisplay(); // Aktualizuj zobrazenie
    }
});

// "Predchádzajúce"
document.getElementById('prev-page').addEventListener('click', function() {
    if (currentPage > 0) {
        currentPage--; // Prejdi na predchádzajúcu stránku
        updateDisplay(); // Aktualizuj zobrazenie
    }
});

updateDisplay();