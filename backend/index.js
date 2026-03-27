const path = require('path');
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, 'db.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) throw err;
  console.log('SQLite database ready:', dbPath);
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS deliveries (
    id TEXT PRIMARY KEY,
    order_number TEXT NOT NULL,
    tracking_code TEXT UNIQUE NOT NULL,
    customer_name TEXT,
    pickup_address TEXT,
    dropoff_address TEXT,
    driver_name TEXT,
    status TEXT NOT NULL,
    eta TEXT,
    created_at TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS tracking_points (
    id TEXT PRIMARY KEY,
    delivery_id TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    status TEXT,
    timestamp TEXT NOT NULL,
    FOREIGN KEY(delivery_id) REFERENCES deliveries(id)
  )`);
});

// helper: generate tracking code
const generateTrackingCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'TRK-';
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    if (i < 2) code += '-';
  }
  return code;
};

// health
app.get('/api/health', (req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));

// create delivery
app.post('/api/deliveries', (req, res) => {
  const { order_number, customer_name, pickup_address, dropoff_address, driver_name, eta } = req.body;
  const id = uuidv4();
  const tracking_code = generateTrackingCode();
  const created_at = new Date().toISOString();
  const status = 'pending';

  const stmt = db.prepare(`INSERT INTO deliveries
      (id, order_number, tracking_code, customer_name, pickup_address, dropoff_address, driver_name, status, eta, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  stmt.run(id, order_number, tracking_code, customer_name, pickup_address, dropoff_address, driver_name, status, eta, created_at, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id, order_number, tracking_code, customer_name, pickup_address, dropoff_address, driver_name, status, eta, created_at });
  });
  stmt.finalize();
});

// get all deliveries
app.get('/api/deliveries', (req, res) => {
  db.all('SELECT * FROM deliveries ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// get single delivery
app.get('/api/deliveries/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM deliveries WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Not found' });
    db.all('SELECT * FROM tracking_points WHERE delivery_id = ? ORDER BY timestamp ASC', [id], (err2, points) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ ...row, tracking: points });
    });
  });
});

// update status
app.patch('/api/deliveries/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  db.run('UPDATE deliveries SET status = ? WHERE id = ?', [status, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ id, status });
  });
});

// add GPS point
app.post('/api/deliveries/:id/tracking', (req, res) => {
  const { id } = req.params;
  const { latitude, longitude, status } = req.body;
  const pointId = uuidv4();
  const timestamp = new Date().toISOString();

  const stmt = db.prepare(`INSERT INTO tracking_points
    (id, delivery_id, latitude, longitude, status, timestamp)
    VALUES (?, ?, ?, ?, ?, ?)`);

  stmt.run(pointId, id, latitude, longitude, status, timestamp, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: pointId, delivery_id: id, latitude, longitude, status, timestamp });
  });
  stmt.finalize();
});

// simulate GPS movement
app.post('/api/deliveries/:id/simulate', (req, res) => {
  const { id } = req.params;
  const baseLat = 51.5074 + (Math.random() - 0.5) * 0.1;
  const baseLng = -0.1278 + (Math.random() - 0.5) * 0.1;
  
  db.run('UPDATE deliveries SET status = ? WHERE id = ?', ['in-transit', id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    
    const points = [];
    for (let i = 0; i < 5; i++) {
      const pointId = uuidv4();
      const lat = baseLat + (Math.random() - 0.5) * 0.05;
      const lng = baseLng + (Math.random() - 0.5) * 0.05;
      const timestamp = new Date(Date.now() + i * 5000).toISOString();
      
      db.run(
        `INSERT INTO tracking_points (id, delivery_id, latitude, longitude, status, timestamp) VALUES (?, ?, ?, ?, ?, ?)`,
        [pointId, id, lat, lng, 'in-transit', timestamp],
        (err) => { if (err) console.error(err); }
      );
      points.push({ lat, lng, timestamp });
    }
    
    res.json({ id, status: 'in-transit', simulated_points: points });
  });
});

// simple static fallback for frontend in same project
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
