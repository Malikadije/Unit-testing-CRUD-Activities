const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const filePath = path.join(__dirname, 'data.json');

const readData = () => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(filePath));
};

const writeData = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data));
};

// Endpoint untuk mendapatkan semua kegiatan
app.get('/api/activities', (req, res) => {
  res.json(readData());
});

// Endpoint untuk menambah kegiatan
app.post('/api/activities', (req, res) => {
  const activities = readData();
  const newActivity = req.body;
  activities.push(Object.assign(newActivity,{id:new Date().getTime()}));
  writeData(activities);
  res.status(201).json(newActivity);
});

// Endpoint untuk mengupdate kegiatan
app.put('/api/activities/:id', (req, res) => {
  const { id } = req.params;
  const updatedActivity = req.body;
  let activities = readData();
  activities = activities.map(activity =>
    activity.id === parseInt(id) ? updatedActivity : activity
  );
  writeData(activities);
  res.json(updatedActivity);
});

// Endpoint untuk menghapus kegiatan
app.delete('/api/activities/:id', (req, res) => {
  const { id } = req.params;
  let activities = readData();
  activities = activities.filter(activity => activity.id !== parseInt(id));
  writeData(activities);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
