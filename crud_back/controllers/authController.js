const crypto = require("crypto");
const db = require("../db");

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hashed = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hashed}`;
}

function verifyPassword(password, stored) {
  const [salt, original] = stored.split(":");
  const hashed = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(original, "hex"), Buffer.from(hashed, "hex"));
}

exports.signup = function (req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "username and password required" });
  }

  db.query("SELECT id FROM users WHERE username = ?", [username], function (err, result) {
    if (err) return res.status(500).json({ error: err });
    if (result.length > 0) return res.status(409).json({ error: "user exists" });

    const password_hash = hashPassword(password);
    db.query(
      "INSERT INTO users (username, password_hash) VALUES (?, ?)",
      [username, password_hash],
      function (err, insertResult) {
        if (err) return res.status(500).json({ error: err });
        res.json({ id: insertResult.insertId, username });
      }
    );
  });
};

exports.login = function (req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "username and password required" });
  }

  db.query("SELECT id, password_hash FROM users WHERE username = ?", [username], function (err, result) {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0) return res.status(401).json({ error: "invalid credentials" });

    const user = result[0];
    const ok = verifyPassword(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "invalid credentials" });

    res.json({ id: user.id, username });
  });
};

