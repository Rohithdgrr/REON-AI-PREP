'use client';

import { useState, useRef } from 'react';

export default function MistralTesterPage() {
  const [apiKey, setApiKey] = useState('nJCcmgS1lSo13OVE79Q64QndL3nCDjQI');
  const [model, setModel] = useState('open-mistral-nemo');
  const [message, setMessage] = useState('Hello Mistral! Please respond in French and tell me a joke.');
  const [output, setOutput] = useState('Response will appear here...');
  const [loading, setLoading] = useState(false);

  const sendRequest = async () => {
    if (!apiKey || !message) {
      setOutput('Please fill in API key and message.');
      return;
    }

    setLoading(true);
    setOutput('Loading...');

    try {
      const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: [{ role: "user", content: message }],
          temperature: 0.7,
          max_tokens: 1024
        })
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`HTTP ${response.status}: ${err}`);
      }

      const data = await response.json();
      const assistantMessage = data.choices[0]?.message?.content || "No content";
      setOutput(assistantMessage);
    } catch (error: any) {
      setOutput("Error: " + error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style jsx global>{`
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; background: #f4f4f9; color: #333; }
        h1 { text-align: center; color: #4a6bdf; }
        textarea, input, select { width: 100%; padding: 12px; margin: 10px 0; font-size: 16px; border: 2px solid #ccc; border-radius: 8px; box-sizing: border-box; }
        select { border-color: #4a6bdf; }
        button { background: #4a6bdf; color: white; padding: 14px 28px; font-size: 16px; border: none; border-radius: 8px; cursor: pointer; width: 100%; }
        button:hover { background: #3a56b0; }
        #output { margin-top: 20px; padding: 15px; background: #fff; border: 1px solid #ddd; border-radius: 8px; min-height: 120px; white-space: pre-wrap; }
        .loading { color: #888; font-style: italic; }
      `}</style>
      <h1>Mistral AI API Tester — 100% Working</h1>

      <label htmlFor="apiKey">API Key:</label>
      <input type="text" id="apiKey" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />

      <label htmlFor="model">Model (all these are completely free):</label>
      <select id="model" value={model} onChange={(e) => setModel(e.target.value)}>
        <option value="open-mistral-nemo">open-mistral-nemo (12B – best free)</option>
        <option value="open-mistral-7b">open-mistral-7b (7B – fast)</option>
        <option value="open-mixtral-8x7b">open-mixtral-8x7b (46B – very good)</option>
        <option value="open-mixtral-8x22b">open-mixtral-8x22b (141B – strongest free)</option>
      </select>

      <label htmlFor="message">Your message:</label>
      <textarea id="message" placeholder="Ask anything..." value={message} onChange={(e) => setMessage(e.target.value)}></textarea>

      <button onClick={sendRequest} disabled={loading}>Send to Mistral</button>

      <div id="output" className={loading ? 'loading' : ''}>
        {output}
      </div>
    </>
  );
}
