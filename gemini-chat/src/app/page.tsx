"use client";
import { useState, useEffect } from "react";
// This is our starting point
export default function Home() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const fetchResponse = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });
      const data = await fetchResponse.json();
      setResponse(data.text);
      setIsLoading(false);

    } catch (error) {
      console.error("Error fetching AI response:", error);
      setResponse("Error fetching AI response");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1>Chat with Gemini</h1>
      <input type="text" value={message} onChange={handleUserInput} placeholder="Enter your message" />
      <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg" onClick={handleSubmit}>Send</button>
      <div id="chat-container">
        <p>Chat:{response}</p>
        {isLoading && <p>Loading...</p>}
      </div>
    </div>
  )
}