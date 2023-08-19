import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { getAuth } from "@clerk/nextjs/server";

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
    content: String,
    username: String,
    userId: String
  });

  Log = mongoose.model('Log', logSchema, "log");
}

export async function getLogContent(timestamp){
  try {
    let logs;

    if (timestamp) {
      logs = await Log.find({ timestamp });
      const logFile = logs[0]
      if (!logFile){
        console.error("Log file not found")
        return;
      }
      return logFile
    } else {
      console.error('Invalid URL params. Missing timestamp.')
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    console.log('An error occurred while fetching data.')
  }
}
// ...



// ...



export default async function handler(req, res) {

  console.log("Nerd")

  if (req.method === 'GET'){
    try {
      const { timestamp } = req.body;
      return getLogContent(timestamp)
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
  } else if (req.method === 'POST'){
    try {

      console.log("Call")
      // Parse request body
      const { content, username, userId } = req.body;

      const timestamp = Date.now()

      if (!timestamp || !content || !username || !userId) {
        return res.status(400).json({ error: 'Missing required fields.' });
      }

      const newLog = new Log({ timestamp, content, username, userId });
      await newLog.save();

      res.status(201).json({
        message: 'Log created successfully.',
        timestamp: timestamp,
        username: username,
        userId: userId
      });
    } catch (error) {
      console.error('Error creating log:', error);
      res.status(500).json({ error: 'An error occurred while creating a log.' });
    }
  } else if (req.method === 'DELETE') {
  try {
    const { timestamp } = req.query;
    const { userId } = getAuth(req);

    try {
      if (!timestamp) {
        console.error('Invalid timestamp for deleting log.');
        return;
      }
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized. User not authenticated.' });
      }
      const log = await Log.findOne({ timestamp });

      if (!log) {
        return res.status(404).json({ error: 'Log entry not found.' });
      }
      if (log.userId !== userId) {
        return res.status(403).json({ error: 'Forbidden. User is not authorized to delete this log entry.' });
      }

      const deletedLog = await Log.findOneAndDelete({ timestamp });

      if (!deletedLog) {
        console.error('Log not found for deletion.');
        return;
      }

      // You can return a response or perform other actions here if needed
    } catch (error) {
      console.error('Error deleting log:', error);
    }

    res.status(200).json({ message: 'Log deleted successfully.' });
  } catch (error) {
    console.error('Error deleting log:', error);
    res.status(500).json({ error: 'An error occurred while deleting a log.' });
  }
}

}


