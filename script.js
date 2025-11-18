document
  .querySelector(".compareButton")
  .addEventListener("click", compareParts);

async function compareParts() {
  // Get input values
  const partNumbers = [
    document.getElementById("part1").value.trim(),
    document.getElementById("part2").value.trim(),
    document.getElementById("part3").value.trim(),
    document.getElementById("part4").value.trim(),
  ].filter(Boolean); // removes empty ones

  // Fetch your fake database
  const response = await fetch("printers.json");
  const data = await response.json();

  // Filter for matching parts
  const selectedParts = partNumbers.map((num) => data[num]).filter(Boolean);

  // Clear existing table
  const tableHeader = document.getElementById("tableHeader");
  const tableBody = document.getElementById("tableBody");
  tableHeader.innerHTML = "";
  tableBody.innerHTML = "";

  if (selectedParts.length === 0) {
    tableBody.innerHTML =
      "<tr><td colspan='5'>No matching parts found</td></tr>";
    return;
  }

  // Build table headers (part numbers)
  tableHeader.innerHTML =
    "<th>Spec</th>" + partNumbers.map((p) => `<th>${p}</th>`).join("");

  // Get all unique spec keys
  const specs = Object.keys(selectedParts[0]);

  specs.forEach((spec) => {
    const row = document.createElement("tr");
    const values = selectedParts.map((p) => p[spec]);
    const allSame = values.every((v) => v === values[0]);

    // Build spec name cell
    const specCell = document.createElement("td");
    specCell.textContent = spec;
    row.appendChild(specCell);

    // Build value cells
    values.forEach((val) => {
      const cell = document.createElement("td");
      cell.textContent = val || "—";
      if (!allSame) cell.classList.add("highlight");
      row.appendChild(cell);
    });

    tableBody.appendChild(row);
  });

  document.querySelector(".compareButton").addEventListener("click", () => {
    const part1 = document.getElementById("part1").value.trim();
    const part2 = document.getElementById("part2").value.trim();

    // fetch the JSON file
    fetch("printers.json")
      .then((response) => response.json())
      .then((data) => {
        const printers = data.printers;

        // find the printer objects that match the part numbers
        const printer1 = printers.find((p) => p.partNumber === part1);
        const printer2 = printers.find((p) => p.partNumber === part2);

        if (!printer1 || !printer2) {
          alert("One or both part numbers not found. Check your input.");
          return;
        }

        // build table header
        const tableHeader = document.getElementById("tableHeader");
        tableHeader.innerHTML = `
        <th>Specification</th>
        <th>${printer1.partNumber}</th>
        <th>${printer2.partNumber}</th>
      `;

        // build table body
        const tableBody = document.getElementById("tableBody");
        tableBody.innerHTML = "";

        // get all keys except partNumber
        const keys = Object.keys(printer1).filter(
          (key) => key !== "partNumber"
        );

        keys.forEach((key) => {
          const row = document.createElement("tr");
          const labelCell = document.createElement("td");
          labelCell.textContent = key;

          const val1Cell = document.createElement("td");
          val1Cell.textContent = printer1[key];

          const val2Cell = document.createElement("td");
          val2Cell.textContent = printer2[key];

          // highlight differences
          if (printer1[key] !== printer2[key]) {
            val1Cell.style.backgroundColor = "#ffcccc";
            val2Cell.style.backgroundColor = "#ffcccc";
          }

          row.appendChild(labelCell);
          row.appendChild(val1Cell);
          row.appendChild(val2Cell);
          tableBody.appendChild(row);
        });
      })
      .catch((error) => console.error("Error loading JSON:", error));
  });
}
