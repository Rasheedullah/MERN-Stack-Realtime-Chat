import { useEffect, useState } from 'react';
import {io} from "socket.io-client"
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

function App() {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState(null);
  // const sockett = io('http://localhost:4000');
  // console.log('ddfdfdfdf', sockett);
  useEffect(()=>{
    setSocket(io("http://localhost:4000"))
  }, [])

  useEffect(() => {
    if(!socket) return;
    socket.on("message-fromm-server", (data)=>{
      // socket.emit("message-fromm-server", data)
    console.log("Message recieved", data);
  })
  }, [socket])

  function handleForm(event) {
    event.preventDefault();
    socket.emit("send-message", {message});
    // console.log('message:', message);
    setMessage("")
  }
  return (
    <div>
       <Box
      component="form" onSubmit={handleForm}
      autoComplete="off"
    >
      <TextField id="standard-basic" label="Standard" variant="standard"  value={message} onChange={(e)=> setMessage(e.target.value)}/>
        <Button variant="text" type='submit'>Contained</Button>
    </Box>
    </div>
  );
}

export default App;
