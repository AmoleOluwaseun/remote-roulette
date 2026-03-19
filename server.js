const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'staff.json');

app.use(express.static(__dirname));
app.use(bodyParser.json());

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(["manager@workspace.com", "lead@workspace.com"]));
}

// GET staff emails
app.get('/api/staff', (req, res) => {
    const data = JSON.parse(fs.readFileSync(DATA_FILE));
    res.json(data);
});

// ADD staff email
app.post('/api/staff', (req, res) => {
    const { email, location } = req.body;
    if (!email || !location) return res.status(400).json({ error: 'Email and location required' });
    
    let staff = JSON.parse(fs.readFileSync(DATA_FILE));
    if (!staff.find(s => s.email === email)) {
        staff.push({ email, location });
        fs.writeFileSync(DATA_FILE, JSON.stringify(staff, null, 2));
    }
    res.json(staff);
});

// DELETE staff email
app.delete('/api/staff', (req, res) => {
    const { email } = req.body;
    let staff = JSON.parse(fs.readFileSync(DATA_FILE));
    staff = staff.filter(s => s.email !== email);
    fs.writeFileSync(DATA_FILE, JSON.stringify(staff, null, 2));
    res.json(staff);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
