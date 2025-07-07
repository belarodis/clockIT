document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("timeForm");
  const clockOutSpan = document.getElementById("clockOutTime");
  const totalHoursSpan = document.getElementById("totalHours");

  const modal = document.getElementById("resultModal");
  const closeModalBtn = document.getElementById("closeModal");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const clockIn = document.getElementById("clockIn").value;
    const intervalStart = document.getElementById("intervalStart").value;
    const intervalEnd = document.getElementById("intervalEnd").value;

    if (!clockIn || !intervalStart || !intervalEnd) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const clockInMin = toMinutes(clockIn);
    const intervalStartMin = toMinutes(intervalStart);
    const intervalEndMin = toMinutes(intervalEnd);

    const intervalDuration = intervalEndMin - intervalStartMin;
    const totalRequiredMinutes = 6 * 60;
    const clockOutMin = clockInMin + totalRequiredMinutes + intervalDuration;

    const totalWorkedMinutes = totalRequiredMinutes;

    clockOutSpan.textContent = formatTime(clockOutMin);
    totalHoursSpan.textContent = formatDuration(totalWorkedMinutes);

    modal.classList.remove("hidden");
  });

  closeModalBtn.addEventListener("click", function () {
    modal.classList.add("hidden");
  });

  window.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  });

  function toMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  }

  function formatTime(minutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }

  function formatDuration(minutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}min`;
  }
});
