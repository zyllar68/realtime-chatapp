import express from 'express';
import mongoose from 'mongoose';
import Messages from './dbMessages.js';
import Pusher from 'pusher';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 9000;

// db config
const connection_url = 'mongodb+srv://admin:qwerty123@cluster0.7uoup.mongodb.net/whatsappdb?retryWrites=true&w=majority'
mongoose.connect(connection_url, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
})


const pusher = new Pusher({
  appId: '1068721',
  key: '83802695cf62c8709624',
  secret: '893fef46dec541decf2c',
  cluster: 'ap1',
  encrypted: true
});

// middlewares
app.use(express.json());
app.use(cors());


const db = mongoose.connection;

db.once("open", () => {
  console.log('db is connected');

  const msgCollection = db.collection("messagecontents");
  const changeStream = msgCollection.watch();

  changeStream.on('change', (change) => {
    console.log(change);

    if(change.operationType === 'insert'){
      const messageDetails = change.fullDocument;
      pusher.trigger('messages', 'inserted', {
        name: messageDetails.name,
        message: messageDetails.message,
        timeStamp: messageDetails.timeStamp,
        recieved: messageDetails.recieved,
        }
      );
    }else{
      console.log('Error triggering Pusher')
    }
  })
})

// api routes
app.get('/', (req, res) => {
  res.status(200).send('hello worldd')
});

app.get('/messages/sync', (req, res) => {
  const dbMessage = req.body;

  Messages.find((err, data) => {
    if(err){
      res.status(500).send(err);
    }else{
      res.status(200).send(data);
    }
  })
})

app.post('/messages/new', (req, res) => {
  const dbMessage = req.body;

  Messages.create(dbMessage, (err, data) => {
    if(err){
      res.status(500).send(err);
    }else{
      res.status(201).send(data);
    }
  })
})

app.listen(port, () => console.log(`localhost: ${port}`))