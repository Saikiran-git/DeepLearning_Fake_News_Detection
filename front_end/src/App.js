import React, { useState } from 'react';
import '@tensorflow/tfjs';
import './App.css';

function App() {
 const [inputText, setInputText] = useState('');
 const [displayResult, setDisplayResult] = useState('');

 const enableButton = () => {
    return inputText.trim() !== '';
 };

 const displayText = async () => {
    if (!inputText.trim()) {
      console.error('Input text is empty.');
      return;
    }

    const flaskEndpoint = 'http://localhost:3001/predict';

    try {
      const response = await fetch(flaskEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputText }),
      });

      if (response.ok) {
        const resultData = await response.json();
        setDisplayResult(`Prediction: ${resultData.result}`);
      } else {
        console.error('Failed to fetch prediction result from the Flask server.');
      }
    } catch (error) {
      console.error('Error during Flask server request:', error);
    }
 };

 return (
  <div style={styles.container}>
    <div style={styles.header}>
      <h1>Fake News Detection Tester</h1>
    </div>

    <div style={styles.inputContainer}>
      <input
        type="text"
        id="inputText"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter Text"
        style={styles.input}
      />

      <button
        id="displayButton"
        onClick={displayText}
        disabled={!enableButton()}
        style={styles.button}
      >
        Display Text
      </button>
    </div>

    <div style={styles.resultContainer}>
      <p id="displayResult">{displayResult}</p>
    </div>
  </div>
);
}
const styles = {
  container: {
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh',
    margin: '0',
    backgroundColor: '#f5f5f5',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    marginBottom: '20px',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  input: {
    padding: '12px',
    fontSize: '16px',
    margin: '10px 0',
    height: '40px',
    width: '300px',
  },
  button: {
    padding: '10px',
    cursor: 'pointer',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
  },
  resultContainer: {
    marginTop: '20px',
  },
};


export default App;