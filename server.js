const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3000;
const USERS_FILE = path.join(__dirname, 'users.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Basahin ang users.json
function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE));
}

// I-save ang users.json
function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// LOGIN endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();
  const user = users.find(u => u.username === username);

  if (!user) return res.json({ ok: false, message: 'User not found' });
  const match = bcrypt.compareSync(password, user.password);
  if (!match) return res.json({ ok: false, message: 'Wrong password' });

  res.json({ ok: true, message: 'Login successful' });
});

// REGISTER endpoint
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();

  if (users.find(u => u.username === username)) {
    return res.json({ ok: false, message: 'Username already exists' });
  }

  const hashed = bcrypt.hashSync(password, 10);
  users.push({ username, password: hashed });
  saveUsers(users);

  res.json({ ok: true, message: 'Registered successfully' });
});
app.get('/', (req, res) => {
  res.send('✅ Backend is running successfully!');
});
// RUN SERVER
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});