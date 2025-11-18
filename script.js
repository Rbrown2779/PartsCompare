document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelector(".compareButton")
    .addEventListener("click", compareParts);
});

const prettyNames = {
  model: "Model",
  printMethod: "Print Method",
  resolution: "Resolution",
  printSpeed: "Print Speed",
  maxWidth: "Max Width",
  interface: "Interface",
  display: "Display",
  cutter: "Cutter",
  peeler: "Peeler",
  rewind: "Rewind",
};

async function compareParts() {
  // Get input values and remove empty ones
  const partNumbers = [
    document.getElementById("part1").value.trim(),
    document.getElementById("part2").value.trim(),
    document.getElementById("part3").value.trim(),
    document.getElementById("part4").value.trim(),
  ].filter(Boolean);

  try {
    // Fetch the JSON
    const response = await fetch("printers.json");
    const data = await response.json();

    // Find matching parts in the printers array
    const selectedParts = partNumbers
      .map((num) => data.printers.find((p) => p.partNumber === num))
      .filter(Boolean);

    // Clear previous table
    const tableHeader = document.getElementById("tableHeader");
    const tableBody = document.getElementById("tableBody");
    tableHeader.innerHTML = "";
    tableBody.innerHTML = "";

    if (selectedParts.length === 0) {
      tableBody.innerHTML =
        "<tr><td colspan='5'>No matching parts found</td></tr>";
      return;
    }

    // Build table headers (first column = Spec, others = part numbers)
    tableHeader.innerHTML =
      "<th>Spec</th>" +
      selectedParts.map((p) => `<th>${p.partNumber}</th>`).join("");

    // Get all keys (specs) from the first selected part
    const specs = Object.keys(selectedParts[0]).filter(
      (k) => k !== "partNumber"
    );

    specs.forEach((spec) => {
      const row = document.createElement("tr");
      const specCell = document.createElement("td");
      specCell.textContent = prettyNames[spec] || spec;
      row.appendChild(specCell);

      const values = selectedParts.map((p) => p[spec]);
      const allSame = values.every((v) => v === values[0]);

      values.forEach((val) => {
        const cell = document.createElement("td");
        cell.textContent = val || "—";
        if (!allSame) cell.classList.add("highlight"); // optional styling
        row.appendChild(cell);
      });

      tableBody.appendChild(row);
    });
    //scroll to table after its built
    document
      .getElementById("comparisonTable")
      .scrollIntoView({ behavior: "smooth" });
  } catch (error) {
    console.error("Error loading JSON:", error);
    alert("Error loading JSON. Check console for details.");
  }
}
