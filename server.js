const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const STAFF_FILE = path.join(__dirname, 'staff.json');
const SCHEDULE_FILE = path.join(__dirname, 'schedule.json');

app.use(express.static(__dirname));
app.use(bodyParser.json());

// Ensure files exist
if (!fs.existsSync(STAFF_FILE)) {
    fs.writeFileSync(STAFF_FILE, JSON.stringify([]));
}
if (!fs.existsSync(SCHEDULE_FILE)) {
    fs.writeFileSync(SCHEDULE_FILE, JSON.stringify({}));
}

// API Endpoints
app.get('/api/staff', (req, res) => {
    const data = JSON.parse(fs.readFileSync(STAFF_FILE, 'utf8'));
    res.json(data);
});

app.post('/api/staff', (req, res) => {
    const { email, location } = req.body;
    const data = JSON.parse(fs.readFileSync(STAFF_FILE, 'utf8'));
    data.push({ email, location });
    fs.writeFileSync(STAFF_FILE, JSON.stringify(data, null, 2));
    res.json(data);
});

app.delete('/api/staff', (req, res) => {
    const { email } = req.body;
    let data = JSON.parse(fs.readFileSync(STAFF_FILE, 'utf8'));
    data = data.filter(s => s.email !== email);
    fs.writeFileSync(STAFF_FILE, JSON.stringify(data, null, 2));
    res.json(data);
});

// Schedule API
app.get('/api/schedule', (req, res) => {
    const data = JSON.parse(fs.readFileSync(SCHEDULE_FILE, 'utf8'));
    res.json(data);
});

app.post('/api/schedule', (req, res) => {
    const schedule = req.body;
    fs.writeFileSync(SCHEDULE_FILE, JSON.stringify(schedule, null, 2));
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
