import React, { useRef, useEffect, useState } from 'react';

const App = () => {
  const socketRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [videoFrame, setVideoFrame] = useState(null);

  useEffect(() => {
    // Connect to WebSocket endpoint
    socketRef.current = new WebSocket('ws://localhost:8000/ws');

    // Set up event handlers
    socketRef.current.onopen = () => {
      console.log('WebSocket connection opened');
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received data from server:', data);

      // Handle the incoming message
      // Note: No 'message' field in the payload, use appropriate field from server
      // For example, assuming your server sends a 'response_msg' field
      setMessages((prevMessages) => [...prevMessages, data.response_msg]);

      // Set the video frame received from the server
      setVideoFrame(data.frame_base64);
    };

    socketRef.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    // Clean up the WebSocket connection on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  return (
    <div>
      <h1>Webcam Video:</h1>
      {videoFrame && (
        <img
          src={`data:image/jpeg;base64,${videoFrame}`}
          alt="Webcam Feed"
          style={{ width: '100%', height: 'auto' }}
        />
      )}
    </div>
  );
};

export default App;
