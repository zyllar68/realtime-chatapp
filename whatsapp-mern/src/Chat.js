import React, {useState} from 'react';
import { Avatar, IconButton } from '@material-ui/core';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import AttachFile from '@material-ui/icons/AttachFile'
import MoreVertIcon from '@material-ui/icons/MoreVert';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import axios from './axios';
import './Chat.css'

function Chat({ messages }) {

  const [input, setInput] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();
    
    await axios.post('/messages/new', {
      "message": input,
      "name": "demo app",
      "timestamp": "just now",
      "recieved": true
      });

    setInput("");

  }

  return (
    <div className='chat'>
      <div className="chat_header">
        <Avatar />

        <div className="chat_headerInfo">
          <h3>Room name</h3>
          <p>Last seen at...</p>
        </div>

        <div className="chat_headerRight">
          <IconButton>
              <DonutLargeIcon />
            </IconButton>
            <IconButton>
              <AttachFile />
            </IconButton>
            <IconButton>
              <MoreVertIcon />
            </IconButton>
        </div>
      </div>

      <div className="chat_body">

        {messages.map(({ name, message, timeStamp, recieved }, i) => (
          <p key={i} className={`chat_message ${recieved && 'chat_reciever'}`}>
            <span className="chat_name">{name}</span>
            {message}
            <span className="chat_timestamp">{timeStamp}</span>
          </p>

        ))}
      </div>

      <div className="chat_footer">
        <InsertEmoticonIcon />
        <form>
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
            type="text"
          />
          <button
            onClick={sendMessage}
            type="submit">
            Send a message
          </button> 
        </form>
        <MicIcon />
      </div>
    </div>
  )
}

export default Chat
