const dropdownItem = document.querySelectorAll(".dropdown-item");
const rows = document.querySelectorAll("[data-status]"); // berie všetky riadky tabuľky podla statusu

const filter = () => {
    for (const item of dropdownItem) {
        item.addEventListener("click", () => {
       
            for (const row of rows) {
                const status = row.getAttribute("data-status");
         
                if (item.id === "1") {
                    row.style.display = "table-row"; // nemozem dat block, lebo mi to rozhadze strukturu tabulky, preto table-row
                } else if (item.id === "2" && status === "odovzdane") {
                    row.style.display = "table-row";
                } else if (item.id === "3" && status === "neodovzdane"){
                    row.style.display = "table-row";
                } else if (item.id === "4" && status === "oneskorene odovzdanie"){
                    row.style.display = "table-row";
                } else {
                    row.style.display = "none";
                }
            };
        });
    };
};
filter();



// sipky na posuvanie pre ULOHY

let currentPage = 0; // Začneme od 2 stránky (0 znamená prvé 3 divy, 1 dalsie 3 div, atd)
const rowCount = 7; // Počet divov, ktoré chceme zobraziť na stránku
const homeworks = document.querySelectorAll('.tr_riadok'); // Získame všetky riadky
const challenges = document.querySelectorAll('.tr_riadok_ch'); // Získame všetky riadky


function updateDisplayHomework() {

    homeworks.forEach(function(row, index) {
        
        if (index >= currentPage * rowCount && index < (currentPage + 1) * rowCount) {
            row.style.display = 'table-row'; 
        } else {                              
            row.style.display = 'none'; 
        }
    });

    document.getElementById('prev-page').disabled = currentPage === 0; // Zakážeme tlačidlo, keď sme na prvej stránke
    document.getElementById('next-page').disabled = (currentPage + 1) * rowCount >= homeworks.length; // Zakážeme tlačidlo, keď sme na poslednej stránke
}



// "Nasledujúce"
document.getElementById('next-page').addEventListener('click', function() {
    if ((currentPage + 1) * rowCount < homeworks.length) {
        currentPage++; // Prejdi na ďalšiu stránku
        updateDisplayHomework(); // Aktualizuj zobrazenie
    }
});

// "Predchádzajúce"
document.getElementById('prev-page').addEventListener('click', function() {
    if (currentPage > 0) {
        currentPage--; // Prejdi na predchádzajúcu stránku
        updateDisplayHomework(); // Aktualizuj zobrazenie
    }
});

updateDisplayHomework();



// sipky na posuvanie pre VYZVY

function updateDisplayChallenge() {

    challenges.forEach(function(row, index) {
        
        if (index >= currentPage * rowCount && index < (currentPage + 1) * rowCount) {
            row.style.display = 'table-row'; 
        } else {                              
            row.style.display = 'none'; 
        }
    });

    document.getElementById('prev-page_ch').disabled = currentPage === 0; // Zakážeme tlačidlo, keď sme na prvej stránke
    document.getElementById('next-page_ch').disabled = (currentPage + 1) * rowCount >= challenges.length; // Zakážeme tlačidlo, keď sme na poslednej stránke
}



// "Nasledujúce"
document.getElementById('next-page_ch').addEventListener('click', function() {
    if ((currentPage + 1) * rowCount < challenges.length) {
        currentPage++; // Prejdi na ďalšiu stránku
        updateDisplayChallenge(); // Aktualizuj zobrazenie
    }
});

// "Predchádzajúce"
document.getElementById('prev-page_ch').addEventListener('click', function() {
    if (currentPage > 0) {
        currentPage--; // Prejdi na predchádzajúcu stránku
        updateDisplayChallenge(); // Aktualizuj zobrazenie
    }
});

updateDisplayChallenge();