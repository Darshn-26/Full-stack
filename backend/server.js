import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import bcrypt from 'bcrypt';

const app = express();

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: "localhost",
    port:'8000',
    user: "root",
    password: "Darshan@26",
    database: "db"
});

const salt = 5;

// Student CRUD operations
// Get all students
app.get("/students", (req, res) => {
    const sql = "SELECT * FROM students";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ message: "Error fetching students data" });
        res.status(200).json(result);
    });
});

// Add new student
app.post("/students", (req, res) => {
    const { regNumber, name, mobile, email } = req.body;
    const sql = "INSERT INTO students (regNumber, name, mobile, email) VALUES (?, ?, ?, ?)";
    db.query(sql, [regNumber, name, mobile, email], (err, result) => {
        if (err) return res.status(500).json({ message: "Error adding student" });
        res.status(201).json({ message: "Student added successfully", studentId: result.insertId });
    });
});

// Update student data
app.put("/students/:id", (req, res) => {
    const { regNumber, name, mobile, email } = req.body;
    const { id } = req.params;
    const sql = "UPDATE students SET regNumber = ?, name = ?, mobile = ?, email = ? WHERE id = ?";
    db.query(sql, [regNumber, name, mobile, email, id], (err, result) => {
        if (err) return res.status(500).json({ message: "Error updating student" });
        res.status(200).json({ message: "Student updated successfully" });
    });
});

// Delete student
app.delete("/students/:id", (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM students WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ message: "Error deleting student" });
        res.status(200).json({ message: "Student deleted successfully" });
    });
});

// User Registration and Login
app.post("/register", (req, res) => {
    const sql = "INSERT INTO user (username, email, password) VALUES (?, ?, ?)";
    bcrypt.hash(req.body.password, salt, (err, hash) => {
        if (err) {
            console.error("Hashing error:", err);
            return res.status(500).json({ message: "Error hashing password" });
        }
        const values = [req.body.username, req.body.email, hash];
        db.query(sql, values, (err, result) => {
            if (err) {
                console.error("SQL error:", err);
                return res.status(500).json({ message: "Error inserting data" });
            }
            res.status(200).json({
                message: "User registered successfully",
                user: {
                    id: result.insertId,
                    username: req.body.username,
                    email: req.body.email
                }
            });
        });
    });
});

app.post("/login", (req, res) => {
    const sql = "SELECT * FROM user WHERE email = ?";
    db.query(sql, [req.body.email], (err, result) => {
        if (err) return res.status(500).json({ message: "Error retrieving data" });
        if (result.length === 0) return res.status(401).json({ message: "User not found" });

        const user = result[0];
        bcrypt.compare(req.body.password, user.password, (err, match) => {
            if (err) return res.status(500).json({ message: "Error comparing passwords" });
            if (!match) return res.status(401).json({ message: "Invalid credentials" });

            res.status(200).json({
                message: "Login successful",
                user: {
                    id: user.id,
                    name: user.username,
                    email: user.email,
                    profilePic: user.profile_pic // Assuming you have a profile_pic field
                }
            });
        });
    });
});

app.listen(8001, () => {
    console.log("Server listening on port 8001");
});
