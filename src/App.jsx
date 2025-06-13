import { useState } from 'react'
import './App.css'
import ClickSpark from './components/ClickSpark';
import Home from './pages/HomePage.jsx';

function App() {
  return (
    <div>
      <ClickSpark
          sparkColor='#9EDF9C'
          sparkSize={10}
          sparkRadius={15}
          sparkCount={8}
          duration={400}
        >
          <Home />
      </ClickSpark>
      
    </div>
  );
}

export default App
