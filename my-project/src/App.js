import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import TabContent from './components/TabContent';
import { useState } from 'react';

function App() {
  const [sport, setSport] = useState('Football');

  const updateActiveSport = ({sport}) => {
    setSport(sport);
  }

  return (
    <main>
      <div className='relative min-h-screen'>
        <div className='pb-10'>
          <Header sport={sport} updateParentSport={updateActiveSport}/>
          <TabContent sport={sport} />
        </div>
        <Footer/>
      </div>
    </main>
  );
}

export default App;
