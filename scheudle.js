// 1) Данные курсов. Можно вынести в /data/courses.json и fetch-нуть.
const courses = [ /* === твой массив "courses" без изменений === */ ];

// 2) Вспомогательные функции
const dayIdx = d => ({
  "Воскресенье": 0, "Понедельник": 1, "Вторник": 2,
  "Среда": 3, "Четверг": 4, "Пятница": 5, "Суббота": 6
}[d]);

const nextDate = (weekDay, time) => {
  // time ⇒ "9:00 – 10:30"  → берём левую часть
  const [h, m] = time.split("–")[0].trim().split(":").map(Number);
  const now = new Date();
  const target = new Date(now);
  target.setHours(h, m, 0, 0);

  // сдвиг до нужного дня недели
  const diff = (7 + weekDay - now.getDay()) % 7;
  target.setDate(now.getDate() + diff);

  // если уже прошло – на следующую неделю
  if (target <= now) target.setDate(target.getDate() + 7);
  return target;
};

// 3) Собираем все сессии
const sessions = [];
courses.forEach(c =>
  (c.schedule || []).forEach(s => {
    sessions.push({
      date: nextDate(dayIdx(s.day), s.time),
      day:  s.day,
      time: s.time,
      title: c.title,
      instructor: s.instructor
    });
  })
);

// 4) Сортируем по дате
sessions.sort((a, b) => a.date - b.date);

// 5) Рендер в таблицу
const tbody = document.getElementById("scheduleBody");
sessions.forEach(sess => {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${sess.date.toLocaleDateString("ru-RU")}</td>
    <td>${sess.day}</td>
    <td>${sess.time}</td>
    <td>${sess.title}</td>
    <td>${sess.instructor}</td>
  `;
  tbody.appendChild(tr);
});

// 6) Подзаголовок: через сколько дней ближайшее занятие
if (sessions.length) {
  const diffMS = sessions[0].date - Date.now();
  const days = Math.ceil(diffMS / 86_400_000);         // 1000*60*60*24
  document.getElementById("subHeader").textContent =
    `Ближайший класс начнётся через ${days} ${days === 1 ? "день" : "дня"}.`;
}
