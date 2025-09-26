const express = require("express");
const app = express();
app.use(express.json());

let seats = Array.from({ length: 10 }, () => ({ status: "available", lockUntil: null }));

app.get("/seats", (req, res) => {
  res.json(seats.map(s => ({ status: s.status })));
});

app.post("/lock/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (!seats[id]) return res.status(404).json({ message: "Invalid seat" });
  if (seats[id].status !== "available") return res.status(400).json({ message: "Seat not available" });
  seats[id].status = "locked";
  seats[id].lockUntil = Date.now() + 60000;
  setTimeout(() => {
    if (seats[id].status === "locked" && seats[id].lockUntil <= Date.now()) {
      seats[id].status = "available";
      seats[id].lockUntil = null;
    }
  }, 60000);
  res.json({ message: `Seat ${id} locked successfully. Confirm within 1 minute.` });
});

app.post("/confirm/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (!seats[id]) return res.status(404).json({ message: "Invalid seat" });
  if (seats[id].status === "locked" && seats[id].lockUntil > Date.now()) {
    seats[id].status = "booked";
    seats[id].lockUntil = null;
    return res.json({ message: `Seat ${id} booked successfully!` });
  }
  res.status(400).json({ message: "Seat is not locked and cannot be booked" });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
