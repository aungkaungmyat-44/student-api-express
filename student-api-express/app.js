const express = require("express");
const students = require("./students.json");

const app = express();
const PORT = 3000;
app.set("view engine", "ejs");
app.use((req, res, next) => {

    const time = new Date().toLocaleTimeString();

    console.log(`${req.method} ${req.url} ${time}`);

    next();

});
app.use(express.json());

// GET /
app.get("/", (req, res) => {
    res.send(`
        <h1>Student API</h1>
        <p>Available routes:</p>
        <ul>
            <li>GET /api/students</li>
            <li>GET /api/students/:id</li>
            <li>GET /api/students?major=IT</li>
        </ul>
    `);
});
app.post("/api/students", (req, res) => {
    const newStudent = req.body;
    students.push(newStudent);
    res.status(201).json(newStudent);
});

// GET /api/students
app.get("/api/students", (req, res) => {
    let result = students;

    // Filter by major
    if (req.query.major) {
        result = students.filter(
            student =>
                student.major.toLowerCase() === req.query.major.toLowerCase()
        );
    }

    res.json(result);
});

// GET /api/students/:id
app.get("/api/students/:id", (req, res) => {
    const id = Number(req.params.id);

    const student = students.find(student => student.id === id);

    if (!student) {
        return res.status(404).json({
            error: "Student not found"
        });
    }

    res.json(student);
});

app.get("/students", (req, res) => {

    res.render("students", {

        title: "All Students",

        students: students

    });

});
// Start server
app.use((req, res) => {
    res.status(404).json({
        error: "Route not found"
    });
});
app.listen(PORT, () => {
    console.log(`Student API running at http://localhost:${PORT}`);
});

