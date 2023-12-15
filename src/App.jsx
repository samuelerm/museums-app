import React from 'react';
import './App.css';
import Museums from './components/Museums';

const baseUrl = 'https://api.mm.dev.heriobbdev.es/api';

function App() {
  return (
    <Museums baseUrl={baseUrl} />
  );
}

export default App;
