from fastapi import FastAPI, WebSocket, Depends
from fastapi.responses import StreamingResponse
import cv2
import base64
import asyncio

app = FastAPI()

camera = cv2.VideoCapture(0)

async def generate_frames():
    while True:
        ret, frame = camera.read()

        if not ret:
            print("Error: Unable to capture frame")
            break

        # Encode the frame as base64
        _, buffer = cv2.imencode('.jpg', frame)
        frame_base64 = base64.b64encode(buffer).decode('utf-8')

        message = {
            "frame_base64": frame_base64
        }

        yield message
        await asyncio.sleep(0.001)  # Adjust the sleep duration as needed

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    async for message in generate_frames():
        await websocket.send_json(message)

