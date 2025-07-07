document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("timeForm");
  const clockOutSpan = document.getElementById("clockOutTime");
  const totalHoursSpan = document.getElementById("totalHours");
  const modal = document.getElementById("resultModal");
  const closeModalBtn = document.getElementById("closeModal");

  ["clockIn", "intervalStart", "intervalEnd"].forEach((id) => {
    const input = document.getElementById(id);
    input.maxLength = 5;                      // HH:MM

    input.addEventListener("input", (e) => {
      let digits = e.target.value.replace(/\D/g, "").slice(0, 4); // máx 4 números

      /* 1º dígito precisa ser 0‑2  -------------------------------------- */
      if (digits.length >= 1 && parseInt(digits[0], 10) > 2) {
        digits = digits.slice(1);   // remove o que não presta
      }

      let formatted = digits;

      if (digits.length >= 3) {                      // já temos HHM ou HHMM
        const h = parseInt(digits.slice(0, 2), 10);
        const m = parseInt(digits.slice(2), 10);

        if (h > 23 || m > 59) return;               // bloqueia valores inválidos
        formatted = `${digits.slice(0, 2)}:${digits.slice(2)}`;
      }
      e.target.value = formatted;
    });

    // Se o usuário sair do campo com 4 dígitos, garante o ':'
    input.addEventListener("blur", () => {
      const raw = input.value.replace(/\D/g, "");
      if (raw.length === 4) {
        const h = parseInt(raw.slice(0, 2), 10);
        const m = parseInt(raw.slice(2), 10);
        if (h <= 23 && m <= 59) input.value = `${raw.slice(0, 2)}:${raw.slice(2)}`;
        else input.value = "";
      }
    });
  });

  /* --------------------------- CÁLCULO --------------------------- */
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const clockIn       = document.getElementById("clockIn").value;
    const intervalStart = document.getElementById("intervalStart").value;
    const intervalEnd   = document.getElementById("intervalEnd").value;

    if (![clockIn, intervalStart, intervalEnd].every(isValidTime)) {
      alert("Preencha horários válidos no formato HH:MM.");
      return;
    }

    const clockInMin       = toMinutes(clockIn);
    const intervalStartMin = toMinutes(intervalStart);
    const intervalEndMin   = toMinutes(intervalEnd);

    if (intervalEndMin <= intervalStartMin) {
      alert("O fim do intervalo deve ser depois do início.");
      return;
    }

    const totalRequired = 6 * 60;                            // 6h
    const clockOutMin   = clockInMin + totalRequired + (intervalEndMin - intervalStartMin);

    clockOutSpan.textContent = formatTime(clockOutMin);
    totalHoursSpan.textContent = formatDuration(totalRequired);
    modal.classList.remove("hidden");
  });

  closeModalBtn.onclick = () => modal.classList.add("hidden");
  window.onclick = (e) => { if (e.target === modal) modal.classList.add("hidden"); };

  /* ----------------------- UTILIDADES ----------------------- */
  const isValidTime = (t) => /^([01]\d|2[0-3]):[0-5]\d$/.test(t);
  const toMinutes   = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
  const formatTime  = (min) => `${String(Math.floor(min / 60) % 24).padStart(2,"0")}:${String(min % 60).padStart(2,"0")}`;
  const formatDuration = (min) => `${Math.floor(min / 60)}h ${min % 60}min`;
});
