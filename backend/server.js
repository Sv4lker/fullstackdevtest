const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

// Список чисел от 1 до 1 млн
let dataList = Array.from({ length: 1_000_000 }, (_, i) => i + 1);

// Массив избранных значений
let selectedItems = [];

app.use(express.json());
app.use(cors()); // CORS для фронтенда

// GET /data - получаем набор данных, начиная с определенного индекса
app.get("/api/data", (req, res) => {
  const { startIndex = 0 } = req.query;
  const pageSize = 20;

  const endIndex = Math.min(startIndex + pageSize, dataList.length);
  const result = dataList
    .slice(startIndex, endIndex)
    .map((item) => ({ id: item }));

  return res.json(result);
});

// POST /search - фильтруем данные по строке поиска
app.post("/api/search", (req, res) => {
  const searchQuery = req.body.searchTerm.toLowerCase().trim();
  if (!searchQuery) return res.json([]);

  let filteredResults = dataList.filter((item) =>
    String(item).toLowerCase().includes(searchQuery)
  );

  // Ограничиваем вывод первых 20-ти элементов
  filteredResults = filteredResults.slice(0, 20);

  return res.json(filteredResults.map((i) => ({ id: i })));
});

// PUT /sort - сохраняем новую последовательность номеров
app.put("/api/sort", (req, res) => {
  const newOrder = req.body.newOrder;
  dataList = newOrder;
  return res.sendStatus(200); // Обновили порядок успешно
});

// POST /select - добавляем элемент в избранные
app.post("/api/selected", (req, res) => {
  const { id } = req.body;
  if (!selectedItems.includes(id)) {
    selectedItems.push(id);
  }
  return res.status(200).json(selectedItems);
});

// DELETE /unselect - удаляет номер из избранных
app.delete("/api/unselect/:id", (req, res) => {
  const indexToRemove = selectedItems.indexOf(Number(req.params.id));
  if (indexToRemove > -1) {
    selectedItems.splice(indexToRemove, 1);
  }
  return res.status(200).send();
});

// Запускаем сервер
app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`)
);
