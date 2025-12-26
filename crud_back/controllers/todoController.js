const db = require("../db");

exports.getAllTodos = function (req, res) {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: "userId is required" });

  db.query("SELECT * FROM todos WHERE user_id = ? ORDER BY id", [userId], function (err, result) {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
};

exports.getActiveTodos = function (req, res) {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: "userId is required" });

  db.query("SELECT * FROM todos WHERE is_deleted = 0 AND user_id = ? ORDER BY id", [userId], function (err, result) {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
};

exports.addTodo = function (req, res) {
  const title = req.body.title;
  const priority = req.body.priority || "medium";
  const userId = req.body.userId;
  if (!userId) return res.status(400).json({ error: "userId is required" });

  db.query(
    "INSERT INTO todos (user_id, title, priority) VALUES (?, ?, ?)",
    [userId, title, priority],
    function (err, result) {
    if (err) return res.status(500).json({ error: err });
      res.json({ id: result.insertId, user_id: userId, title: title, priority: priority, completed: false });
    }
  );
};

exports.updateTodo = function (req, res) {
  const id = req.params.id;
  const completed = req.body.completed;
  const userId = req.body.userId;
  if (!userId) return res.status(400).json({ error: "userId is required" });

  db.query("UPDATE todos SET completed = ? WHERE id = ? AND user_id = ?", [completed, id, userId], function (err, result) {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Updated" });
  });
};

exports.deleteTodo = function (req, res) {
  const id = req.params.id;
  const userId = req.body.userId;
  if (!userId) return res.status(400).json({ error: "userId is required" });

  db.query("UPDATE todos SET is_deleted = 1 WHERE id = ? AND user_id = ?", [id, userId], function (err, result) {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Not found" });
    res.json({ message: "sent to the void" });
  });
};
