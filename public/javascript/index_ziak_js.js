// "kalendar"

const datum = document.getElementById("date_");
const akt_rok = document.getElementById("year");
const akt_cas = document.getElementById("current_time");
const akt_den = document.getElementById("days");

const mesiace = ["Január", "Február", "Marec", "Apríl", "Máj", "Jún", "Júľ", "August", "September", "Oktobér", "November", "December"];
const dni_tyzden = ["nedeľa", "pondelok", "utorok", "streda", "štvrtok", "piatok", "sobota"];

function renderDate() {
    let aktualne = new Date();

    const rok = aktualne.getFullYear();
    const den = aktualne.getDate();
    const mesiac = aktualne.getMonth();
    const nazov_den = aktualne.getDay();

    const hodiny = String(aktualne.getHours()).padStart(2, '0'); // Formátovanie hodín
    const minuty = String(aktualne.getMinutes()).padStart(2, '0'); // Formátovanie minút

    datum.textContent = `${den}. ${mesiace[mesiac]}`;
    akt_rok.textContent = `${rok}`;
    akt_cas.textContent = `${hodiny}:${minuty}`;
    akt_den.textContent = `${dni_tyzden[nazov_den]}`;

};
renderDate();
setInterval(renderDate, 1000);


// NACITAVANIE MENINY

 const vypisMeniny = async () => {

    // Zavoláme endpoint, ktorý nám vráti meniny
    try {
        const response = await fetch("/meniny");

        if(response.ok) {
            const data = await response.json();
            const meniny_dnes = document.getElementById("nameday");
            meniny_dnes.textContent = data.meno;
        } else {
            alert("Error");
        }

    } catch (error) {
        console.error("Chyba pri získavaní dát:", error);
    }
};

document.addEventListener("DOMContentLoaded", vypisMeniny);



