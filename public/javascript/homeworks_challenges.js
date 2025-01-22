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