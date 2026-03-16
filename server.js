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
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });
    
    let emails = JSON.parse(fs.readFileSync(DATA_FILE));
    if (!emails.includes(email)) {
        emails.push(email);
        fs.writeFileSync(DATA_FILE, JSON.stringify(emails, null, 2));
    }
    res.json(emails);
});

// DELETE staff email
app.delete('/api/staff', (req, res) => {
    const { email } = req.body;
    let emails = JSON.parse(fs.readFileSync(DATA_FILE));
    emails = emails.filter(e => e !== email);
    fs.writeFileSync(DATA_FILE, JSON.stringify(emails, null, 2));
    res.json(emails);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
