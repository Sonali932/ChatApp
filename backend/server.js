/*import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect
mongoose.connect('mongodb://127.0.0.1:27017/doctor_consult', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
 .catch(err => console.error('MongoDB Connection Error:', err));

  //Consultation.find().then(console.log).catch(console.error);


// Consultation Schema
const ConsultationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  symptoms: { type: String, required: true },
  messages: [{ text: String, sender: String, timestamp: { type: Date, default: Date.now } }],
});

const Consultation = mongoose.model('Consultation', ConsultationSchema);

// Submit Consultation Form
/*app.post('/consult', async (req, res) => {
  try {
    const consultation = new Consultation({ ...req.body, messages: [] });
    await consultation.save();
    res.status(201).json(consultation);
  } catch (error) {
    res.status(500).json({ error: 'Error submitting consultation', details: error.message });
  }
});//
app.post('/consult', async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    const consultation = new Consultation({ ...req.body, messages: [] });
    await consultation.save();
    console.log("Saved consultation:", consultation);
    res.status(201).json(consultation);
  } catch (error) {
    console.error('Error submitting consultation:', error);
    res.status(500).json({ error: 'Error submitting consultation', details: error.message });
  }
});

// Get Consultation Data (Including Messages)
app.get('/consult/:id', async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) return res.status(404).json({ error: 'Consultation not found' });

    res.json(consultation);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching consultation', details: error.message });
  }
});

// WebSocket for Real-Time Chat
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join Consultation Room
  socket.on('joinConsultation', (consultationId) => {
    socket.join(consultationId);
    console.log(`User joined consultation: ${consultationId}`);
  });

  // Handle Sending Messages
  socket.on('sendMessage', async ({ consultationId, text, sender }) => {
    if (!consultationId || !text || !sender) return;

    const message = { text, sender, timestamp: new Date() };

    try {
      const consultation = await Consultation.findByIdAndUpdate(
        consultationId,
        { $push: { messages: message } },
        { new: true }
      );

      if (consultation) {
        io.to(consultationId).emit('receiveMessage', message); // Send message to specific room
      }
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(5000, () => console.log('Server running on port 5000'));
*/

import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.json());
app.use(cors());

// ✅ Fixed MongoDB Connection
//mongoose.connect('mongodb://127.0.0.1:27017/doctor_consult'
mongoose.connect(
  "mongodb+srv://sonalichoudhary239:SonaliChat@clustechat.vupee.mongodb.net/?retryWrites=true&w=majority&appName=Clustechat",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("MongoDB Connection Error:", err));

// Consultation Schema
const ConsultationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  symptoms: { type: String, required: true },
  messages: [{ text: String, sender: String, timestamp: { type: Date, default: Date.now } }],
});

const Consultation = mongoose.model("Consultation", ConsultationSchema);

// ✅ Submit Consultation Form
app.post("/consult", async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    const consultation = new Consultation({ ...req.body, messages: [] });
    await consultation.save();
    console.log("Saved consultation:", consultation);
    res.status(201).json(consultation);
  } catch (error) {
    console.error("Error submitting consultation:", error);
    res.status(500).json({ error: "Error submitting consultation", details: error.message });
  }
});

// ✅ Get Consultation Data (Including Messages)
app.get("/consult/:id", async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) return res.status(404).json({ error: "Consultation not found" });

    res.json(consultation);
  } catch (error) {
    res.status(500).json({ error: "Error fetching consultation", details: error.message });
  }
});

// ✅ WebSocket for Real-Time Chat
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join Consultation Room
  socket.on("joinConsultation", (consultationId) => {
    socket.join(consultationId);
    console.log(`User joined consultation: ${consultationId}`);
  });

  // ✅ Fixed: Handle Sending Messages with Validation
  socket.on("sendMessage", async ({ consultationId, text, sender }) => {
    if (!consultationId || !text || !sender) {
      console.error("Invalid message data received:", { consultationId, text, sender });
      return;
    }

    const message = { text, sender, timestamp: new Date() };

    try {
      const consultation = await Consultation.findByIdAndUpdate(
        consultationId,
        { $push: { messages: message } },
        { new: true }
      );

      if (consultation) {
        io.to(consultationId).emit("receiveMessage", message);
      } else {
        console.error("Consultation not found:", consultationId);
      }
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(5000, () => console.log("Server running on port 5000"));
