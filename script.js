const TABLE_LAYOUT = [
    { number: 1, seats: 8 },
    { number: 2, seats: 8 },
    { number: 3, seats: 16 },
    { number: 4, seats: 8 },
    { number: 5, seats: 8 },
    { number: 6, seats: 8 },
    { number: 7, seats: 8 },
    { number: 8, seats: 8 },
    { number: 9, seats: 8 },
    { number: 10, seats: 16 },
    { number: 11, seats: 16 },
    { number: 12, seats: 8 },
    { number: 13, seats: 8 },
    { number: 14, seats: 8 },
    { number: 15, seats: 16 },
    { number: 16, seats: 16 },
    { number: 17, seats: 16 },
    { number: 18, seats: 16 },
    { number: 19, seats: 16 },
    { number: 20, seats: 16 },
    { number: 21, seats: 16 },
    { number: 22, seats: 8 },
    { number: 23, seats: 8 },
    { number: 24, seats: 8 },
];

function createSeat(tableId, seatIndex, occupied) {
  return `<div class="seat ${occupied ? 'occupied' : ''}" data-seat="${seatIndex}" data-table="${tableId}"></div>`;
}

function createTable(tableId, seatCount) {
  const seatsHtml = Array.from({ length: seatCount }, (_, i) =>
    createSeat(tableId, i, false)
  ).join("");

  return `
    <div class="table ${seatCount === 16 ? 'large' : 'small'}" data-id="${tableId}" data-total="${seatCount}">
      <div class="table-header">
        <div class="table-name">${tableId}</div>
        <div class="table-counter">0 / ${seatCount}</div>
      </div>
      <div class="seat-grid">${seatsHtml}</div>
    </div>
  `;
}

function generateTables() {
  const container = document.getElementById("tables");
  container.innerHTML = "";
  TABLE_LAYOUT.forEach(t => {
    const id = `Tavolo ${t.number}`;
    container.innerHTML += createTable(id, t.seats);
  });
  attachSeatHandlers();
  enableSeatDrag();
  enableSeatTouch();
  updateCounter();
}

function attachSeatHandlers() {
  document.querySelectorAll(".seat").forEach(seat => {
    seat.addEventListener("click", () => {
      seat.classList.toggle("occupied");
      updateTableCounter(seat.closest(".table"));
      updateCounter();
    });
  });
}

let isDragging = false;

function enableSeatDrag() {
  document.querySelectorAll(".seat").forEach(seat => {
    seat.addEventListener("mousedown", () => isDragging = true);
    seat.addEventListener("mouseup", () => isDragging = false);
    seat.addEventListener("mouseenter", () => {
      if (isDragging) {
        seat.classList.toggle("occupied");
        updateTableCounter(seat.closest(".table"));
        updateCounter();
      }
    });
  });

  document.addEventListener("mouseup", () => isDragging = false);
}

function enableSeatTouch() {
  document.querySelectorAll(".seat").forEach(seat => {
    seat.addEventListener("touchstart", e => {
      e.preventDefault();
      seat.classList.toggle("occupied");
      updateTableCounter(seat.closest(".table"));
      updateCounter();
    });
    seat.addEventListener("touchmove", e => {
      const touch = e.touches[0];
      const el = document.elementFromPoint(touch.clientX, touch.clientY);
      if (el?.classList.contains("seat")) {
        el.classList.toggle("occupied");
        updateTableCounter(el.closest(".table"));
        updateCounter();
      }
    });
  });
}

function updateTableCounter(tableEl) {
  const total = parseInt(tableEl.getAttribute("data-total"));
  const occupied = tableEl.querySelectorAll(".seat.occupied").length;
  tableEl.querySelector(".table-counter").textContent = `${occupied} / ${total}`;
}

function updateCounter() {
  const tables = document.querySelectorAll(".table");
  let totalFree = 0;

  tables.forEach(table => {
    const total = parseInt(table.getAttribute("data-total"));
    const occupied = table.querySelectorAll(".seat.occupied").length;
    totalFree += (total - occupied);
  });

  document.getElementById("counter").textContent = totalFree;
}

document.addEventListener("DOMContentLoaded", () => {
  generateTables();

  document.querySelector(".buttonReset").addEventListener("click", () => {
    if (confirm("Sei sicuro di voler resettare tutti i tavoli?")) {
      document.querySelectorAll(".seat").forEach(seat => seat.classList.remove("occupied"));
      document.querySelectorAll(".table").forEach(updateTableCounter);
      updateCounter();
    }
  });
});
