const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const NoteSchema = new mongoose.Schema({
  leadKey: String,
  note: String,
});

const Note = mongoose.model('Note', NoteSchema);

// Get all notes
app.get('/notes', async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

// Save or update a note
app.post('/note', async (req, res) => {
  const { leadKey, note } = req.body;
  const existing = await Note.findOne({ leadKey });
  if (existing) {
    existing.note = note;
    await existing.save();
  } else {
    await Note.create({ leadKey, note });
  }
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

console.log("✅ Deploy trigger test");
