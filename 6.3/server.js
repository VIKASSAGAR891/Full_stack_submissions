const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user");

const app = express();
app.use(express.json());

// connect MongoDB
mongoose.connect("mongodb://localhost:27017/bankDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// -----------------------------------------
// 1️⃣ Create Users
// -----------------------------------------
app.post("/create-users", async (req, res) => {
  try {
    await User.deleteMany(); // for testing fresh data
    const users = await User.insertMany([
      { name: "Vikas", balance: 1000 },
      { name: "Vaishnavi", balance: 500 },
    ]);
    res.status(201).json({ message: "Users created", users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -----------------------------------------
// 2️⃣ Transfer Endpoint
// -----------------------------------------
app.post("/transfer", async (req, res) => {
  const { fromUserId, toUserId, amount } = req.body;

  try {
    // check both users
    const sender = await User.findById(fromUserId);
    const receiver = await User.findById(toUserId);

    if (!sender || !receiver)
      return res.status(404).json({ message: "User not found" });

    // validate balance
    if (sender.balance < amount)
      return res.status(400).json({ message: "Insufficient balance" });

    // update balances (logical order)
    sender.balance -= amount;
    receiver.balance += amount;

    await sender.save();
    await receiver.save();

    res.status(200).json({
      message: `Transferred ₹${amount} from ${sender.name} to ${receiver.name}`,
      senderBalance: sender.balance,
      receiverBalance: receiver.balance,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -----------------------------------------
// Start Server
// -----------------------------------------
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
