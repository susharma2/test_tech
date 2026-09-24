/**
 * Verifcore Registration System - Backend Server
 * 
 * SETUP INSTRUCTIONS:
 * 1. Install Node.js (https://nodejs.org/)
 * 2. Install dependencies: npm install express sqlite3 body-parser cors uuid
 * 3. Place this file and registration.html in the same directory
 * 4. Run: node server.js
 * 5. Open http://localhost:3000 in your browser
 * 
 * The server will create registrations.db automatically on first run
 * Admin panel available at http://localhost:3000/admin
 */

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = 'registrations.db';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

// Initialize SQLite Database
const db = new sqlite3.Database(DB_FILE, (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database:', DB_FILE);
        initializeDatabase();
    }
});

// Initialize database schema
function initializeDatabase() {
    db.run(`
        CREATE TABLE IF NOT EXISTS registrations (
            id TEXT PRIMARY KEY,
            email TEXT NOT NULL UNIQUE,
            phone TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Error creating table:', err);
        } else {
            console.log('Database table ready');
        }
    });
    
    // Create admin credentials table
    db.run(`
        CREATE TABLE IF NOT EXISTS admin_users (
            id INTEGER PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    `, (err) => {
        if (err) {
            console.error('Error creating admin table:', err);
        } else {
            // Insert default admin (username: admin, password: admin123)
            db.run(`
                INSERT OR IGNORE INTO admin_users (username, password) 
                VALUES (?, ?)
            `, ['admin', 'admin315'], (err) => {
                if (!err) {
                    console.log('Admin user ready (default: admin / admin315)');
                }
            });
        }
    });
}

// Routes

// Serve main downloads page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'downloads.html'));
});

// Serve registration page
app.get('/registration.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'registration.html'));
});

// API: Register new user
app.post('/api/register', (req, res) => {
    const { email, phone, timestamp } = req.body;
    
    // Validate input
    if (!email || !phone) {
        return res.status(400).json({ error: 'Email and phone are required' });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }
    
    // Validate phone (at least 7 digits)
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 7) {
        return res.status(400).json({ error: 'Invalid phone number' });
    }
    
    const id = uuidv4();
    
    db.run(
        `INSERT INTO registrations (id, email, phone, timestamp) VALUES (?, ?, ?, ?)`,
        [id, email, phone, timestamp || new Date().toISOString()],
        function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(409).json({ error: 'Email already registered' });
                }
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Registration failed' });
            }
            
            console.log(`New registration: ${email} | ${phone}`);
            res.json({ 
                success: true, 
                id: id,
                message: 'Registration successful' 
            });
        }
    );
});

// API: Get all registrations (admin only)
app.get('/api/registrations', authenticateAdmin, (req, res) => {
    db.all(
        `SELECT id, email, phone, timestamp, created_at FROM registrations ORDER BY created_at DESC`,
        (err, rows) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Failed to fetch registrations' });
            }
            res.json({
                total: rows.length,
                registrations: rows
            });
        }
    );
});

// API: Export registrations as JSON
app.get('/api/export/json', authenticateAdmin, (req, res) => {
    db.all(
        `SELECT * FROM registrations ORDER BY created_at DESC`,
        (err, rows) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Failed to export data' });
            }
            
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', 'attachment; filename="registrations.json"');
            res.json({
                export_date: new Date().toISOString(),
                total_registrations: rows.length,
                registrations: rows
            });
        }
    );
});

// API: Export registrations as CSV
app.get('/api/export/csv', authenticateAdmin, (req, res) => {
    db.all(
        `SELECT email, phone, timestamp, created_at FROM registrations ORDER BY created_at DESC`,
        (err, rows) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Failed to export data' });
            }
            
            // Create CSV header
            let csv = 'Email,Phone,Submission Time,Registered At\n';
            
            // Add data rows
            rows.forEach(row => {
                csv += `"${row.email}","${row.phone}","${row.timestamp}","${row.created_at}"\n`;
            });
            
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="registrations.csv"');
            res.send(csv);
        }
    );
});

// API: Download database file
app.get('/api/export/database', authenticateAdmin, (req, res) => {
    if (!fs.existsSync(DB_FILE)) {
        return res.status(404).json({ error: 'Database file not found' });
    }
    
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename="registrations.db"');
    res.download(DB_FILE);
});

// API: Delete a registration (admin only)
app.delete('/api/registrations/:id', authenticateAdmin, (req, res) => {
    const { id } = req.params;
    
    db.run(
        `DELETE FROM registrations WHERE id = ?`,
        [id],
        function(err) {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Failed to delete registration' });
            }
            
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Registration not found' });
            }
            
            res.json({ success: true, message: 'Registration deleted' });
        }
    );
});

// Admin authentication middleware
function authenticateAdmin(req, res, next) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const [scheme, credentials] = authHeader.split(' ');
    
    if (scheme !== 'Basic') {
        return res.status(401).json({ error: 'Invalid auth scheme' });
    }
    
    const [username, password] = Buffer.from(credentials, 'base64').toString().split(':');
    
    db.get(
        `SELECT * FROM admin_users WHERE username = ? AND password = ?`,
        [username, password],
        (err, row) => {
            if (err || !row) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            next();
        }
    );
}

// Serve admin panel
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'Server is running', database: DB_FILE });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n========================================`);
    console.log(`Verifcore Registration System`);
    console.log(`========================================`);
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Downloads page: http://localhost:${PORT}`);
    console.log(`Registration: http://localhost:${PORT}/registration.html`);
    console.log(`Admin panel: http://localhost:${PORT}/admin`);
    console.log(`Admin credentials: admin / admin123`);
    console.log(`Database: ${DB_FILE}`);
    console.log(`========================================\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nClosing database connection...');
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        } else {
            console.log('Database connection closed');
        }
        process.exit(0);
    });
});
