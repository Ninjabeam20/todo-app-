const db = require("../db");

exports.getAllTodos = function (req, res) {
  db.query("SELECT * FROM todos ORDER BY id", function (err, result) {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
};

exports.getActiveTodos = function (req, res) {
  db.query("SELECT * FROM todos WHERE is_deleted = 0 ORDER BY id", function (err, result) {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
};

exports.addTodo = function (req, res) {
  const title = req.body.title;
  db.query("INSERT INTO todos (title) VALUES (?)", [title], function (err, result) {
    if (err) return res.status(500).json({ error: err });
    res.json({ id: result.insertId, title: title, completed: false });
  });
};

exports.updateTodo = function (req, res) {
  const id = req.params.id;
  const completed = req.body.completed;
  db.query("UPDATE todos SET completed = ? WHERE id = ?", [completed, id], function (err) {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Updated" });
  });
};

exports.deleteTodo = function (req, res) {
  const id = req.params.id;
  db.query("UPDATE todos SET is_deleted = 1 WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "sent to the void" });
  });
};
