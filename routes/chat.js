const express = require('express');
const router = express.Router();
const connection = require('../connection');
const auth = require('../services/authentication');

// Get all unique users who have sent messages
router.get('/users', auth.autheticateToken, (req, res) => {
    const query = `
        SELECT DISTINCT userName 
        FROM chat 
        WHERE userId != 'admin'
        ORDER BY userName ASC
    `;
    
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ error: err });
        }
        return res.status(200).json(results.map(row => row.userName));
    });
});

// Get messages for a specific user
router.get('/userMessages/:userName', (req, res) => {
    const userName = req.params.userName;
    
    const query = `
        SELECT * FROM chat 
        WHERE userName = ? OR 
              (userId = 'admin' AND recipient = ?)
        ORDER BY timestamp ASC
    `;
    
    connection.query(query, [userName, userName], (err, results) => {
        if (err) {
            console.error('Error fetching user messages:', err);
            return res.status(500).json({ error: err });
        }
        return res.status(200).json(results);
    });
});

// Send a message
router.post('/send', (req, res) => {
    const { userId, userName, message, recipient } = req.body;
    
    if (!userName || !message || !recipient) {
        return res.status(400).json({ error: 'Username, message, and recipient are required' });
    }

    const query = `
        INSERT INTO chat (userId, userName, message, timestamp, \`read\`, recipient)
        VALUES (?, ?, ?, NOW(), false, ?)
    `;
    
    connection.query(query, [userId, userName, message, recipient], (err, results) => {
        if (err) {
            console.error('Error sending message:', err);
            return res.status(500).json({ error: err });
        }
        return res.status(200).json({ message: 'Message sent successfully' });
    });
});

// Mark messages as read
router.put('/markAsRead', auth.autheticateToken, (req, res) => {
    const query = `UPDATE chat SET \`read\` = true WHERE \`read\` = false`;
    
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error marking messages as read:', err);
            return res.status(500).json({ error: err });
        }
        return res.status(200).json({ message: 'Messages marked as read' });
    });
});

module.exports = router;