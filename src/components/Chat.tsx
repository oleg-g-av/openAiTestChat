// src/components/Chat.tsx
import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Container,
  Grid,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import Message from "./Message";
import { MessageDto } from "../models/MessageDto";
import SendIcon from "@mui/icons-material/Send";

const Chat: React.FC = () => {
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [messages, setMessages] = useState<Array<MessageDto>>(
    new Array<MessageDto>()
  );
  const [input, setInput] = useState<string>("");

  const createNewMessage = (content: string, isUser: boolean) => {
    const newMessage = new MessageDto(isUser, content);
    return newMessage;
  };

  const handleSendMessage = async () => {
    messages.push(createNewMessage(input, true));
    setMessages([...messages]);
    setInput("");
    setIsWaiting(true);

    await fetch("http://localhost:3000/api/botQuestion", {
      method: "POST",
      body: JSON.stringify({
        message: input,
        // threadId: "123",
      }),
      headers: {
        "x-api-key": "BByBw7t4ffswfJoxY7K2",
      },
    });
    setIsWaiting(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await fetch("http://localhost:3000/api/botQuestion", {
        method: "POST",
        body: JSON.stringify({
          message: input,
          // threadId: "123",
        }),
        headers: {
          "x-api-key": "BByBw7t4ffswfJoxY7K2",
        },
      });
      const data = await response.json();

      setMessages([...data]);
    };
    
    fetchMessages();
  }, [input]);

  return (
    <Container>
      <Grid container direction="column" spacing={2} paddingBottom={2}>
        {messages.map((message, index) => (
          <Grid
            item
            alignSelf={message.isUser ? "flex-end" : "flex-start"}
            key={index}
          >
            <Message key={index} message={message} />
          </Grid>
        ))}
      </Grid>
      <Grid
        container
        direction="row"
        paddingBottom={5}
        justifyContent={"space-between"}
      >
        <Grid item sm={11} xs={9}>
          <TextField
            label="Type your message"
            variant="outlined"
            disabled={isWaiting}
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          {isWaiting && <LinearProgress color="inherit" />}
        </Grid>
        <Grid item sm={1} xs={3}>
          <Button
            variant="contained"
            size="large"
            color="primary"
            onClick={handleSendMessage}
            disabled={isWaiting}
          >
            {isWaiting && <CircularProgress color="inherit" />}
            {!isWaiting && <SendIcon fontSize="large" />}
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Chat;
