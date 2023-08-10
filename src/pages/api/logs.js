import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(r => {
  console.log("Connected to mongo database")
});

let Log;

try {
  // Try to retrieve the model if it's already defined
  Log = mongoose.model('Log');
} catch (e) {
  // If not defined, define the model
  const logSchema = new mongoose.Schema({
    timestamp: String,
    content: String
  });

  Log = mongoose.model('Log', logSchema, "log");
}
export default async function handler(req, res) {
  if (req.method === 'GET'){
    try {
      const { timestamp } = req.query;
      let logs;

      if (timestamp) {
        logs = await Log.find({ timestamp });
        const logFile = logs[0]
        if (!logFile){
          res.status(404).json({ error: 'Log file not found. Timestamp: '+timestamp });
          return;
        }
        res.status(200).json(logFile);
      } else {
        res.status(400).json({ error: 'Invalid URL params. Missing timestamp.' });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
  } else if (req.method === 'POST'){
    try {
      // Parse request body
      const { content } = req.body;

      const timestamp = Date.now()

      if (!timestamp || !content) {
        return res.status(400).json({ error: 'Missing required fields.' });
      }

      const newLog = new Log({ timestamp, content });
      await newLog.save();

      res.status(201).json({
        message: 'Log created successfully.',
        timestamp: timestamp
      });
    } catch (error) {
      console.error('Error creating log:', error);
      res.status(500).json({ error: 'An error occurred while creating a log.' });
    }
  }
}
