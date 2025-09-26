const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory seat storage
// Seats numbered 1-10, all initially available
let seats = {};
for (let i = 1; i <= 10; i++) {
  seats[i] = { status: "available", lockExpires: null, lockedBy: null };
}

// GET all seats
app.get("/seats", (req, res) => {
  const seatStatus = {};
  for (let id in seats) {
    seatStatus[id] = { status: seats[id].status };
  }
  res.status(200).json(seatStatus);
});

// POST lock a seat
app.post("/lock/:id", (req, res) => {
  const seatId = parseInt(req.params.id);
  const seat = seats[seatId];

  if (!seat) {
    return res.status(404).json({ message: "Seat not found" });
  }

  // Check if seat is already booked
  if (seat.status === "booked") {
    return res.status(400).json({ message: Seat ${seatId} is already booked });
  }

  // Check if seat is currently locked
  if (seat.status === "locked") {
    // Check if lock expired
    if (Date.now() > seat.lockExpires) {
      // Lock expired, make seat available
      seat.status = "available";
      seat.lockExpires = null;
      seat.lockedBy = null;
    } else {
      return res.status(400).json({ message: Seat ${seatId} is currently locked });
    }
  }

  // Lock the seat for 1 minute
  seat.status = "locked";
  seat.lockedBy = "user"; // For simplicity, single user
  seat.lockExpires = Date.now() + 60 * 1000; // 1 minute

  // Auto-release the lock after 1 minute
  setTimeout(() => {
    if (seat.status === "locked" && Date.now() > seat.lockExpires) {
      seat.status = "available";
      seat.lockExpires = null;
      seat.lockedBy = null;
      console.log(Seat ${seatId} lock expired);
    }
  }, 61 * 1000);

  res.status(200).json({
    message: Seat ${seatId} locked successfully. Confirm within 1 minute.,
  });
});

// POST confirm a seat
app.post("/confirm/:id", (req, res) => {
  const seatId = parseInt(req.params.id);
  const seat = seats[seatId];

  if (!seat) {
    return res.status(404).json({ message: "Seat not found" });
  }

  if (seat.status !== "locked") {
    return res.status(400).json({ message: "Seat is not locked and cannot be booked" });
  }

  // Confirm booking
  seat.status = "booked";
  seat.lockExpires = null;
  seat.lockedBy = null;

  res.status(200).json({ message: Seat ${seatId} booked successfully! });
});

// Start server
app.listen(PORT, () => {
  console.log(Server running on http://localhost:${PORT});
});
