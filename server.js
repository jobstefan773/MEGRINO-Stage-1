// FOR DATABASE CONNECTION
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();
const port = 3000;

app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'todo_app'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected...');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});



//----------------------------------------------------------------------------------------------------



// TO CREATE NEW TASK
app.post('/tasks', (req, res) => {
    const task = { title: req.body.title, completed: false };
    const sql = 'INSERT INTO tasks SET ?';
    db.query(sql, task, (err, result) => {
        if (err) throw err;
        res.status(201).send({ id: result.insertId, ...task });
    });
});

// GET ALL TASK 
app.get('/tasks', (req, res) => {
    const sql = 'SELECT * FROM tasks';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// GET TASK BY ID
app.get('/tasks/:id', (req, res) => {
    const sql = 'SELECT * FROM tasks WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            return res.status(404).send('Task not found');
        }
        res.send(result[0]);
    });
});

// UPDATE TASK BY ID
app.put('/tasks/:id', (req, res) => {
    const sql = 'UPDATE tasks SET ? WHERE id = ?';
    const updates = { title: req.body.title, completed: req.body.completed };
    db.query(sql, [updates, req.params.id], (err, result) => {
        if (err) throw err;
        if (result.affectedRows === 0) {
            return res.status(404).send('Task not found');
        }
        res.send({ id: req.params.id, ...updates });
    });
});

// DELETE TASK BY ID
app.delete('/tasks/:id', (req, res) => {
    const sql = 'DELETE FROM tasks WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        if (result.affectedRows === 0) {
            return res.status(404).send('Task not found');
        }
        res.send({ message: 'Task deleted' });
    });
});
