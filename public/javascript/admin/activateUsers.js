const dropdownItem = document.querySelectorAll(".dropdown-item");
const rows = document.querySelectorAll("tr[data-status][data-role]");

const filter = () => {
    for (const item of dropdownItem) {
        item.addEventListener("click", () => {

            console.log(`Klikol si na filter s ID: ${item.id}`);
       
            for (const row of rows) {
                const status = row.getAttribute("data-status");
                const role = row.getAttribute("data-role");
         
                console.log(`Riadok - status: ${status}, role: ${role}`);

                if (item.id === "1") {
                    row.style.display = "table-row";
                } else if (item.id === "2" && status === "1") {
                    row.style.display = "table-row";
                } else if (item.id === "3" && status === "0"){
                    row.style.display = "table-row";
                } else if (item.id === "4" && role === "0"){
                    row.style.display = "table-row";
                } else if (item.id === "5" && role === "1"){
                    row.style.display = "table-row";
                } else {
                    row.style.display = "none";
                }
            };
        });
    };
};
filter();