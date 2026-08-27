import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TravelProvider } from './context/TravelContext';

// Pages
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import Recommendations from './pages/Recommendations';
import DestinationDetail from './pages/DestinationDetail';
import Itinerary from './pages/Itinerary';
import Emergency from './pages/Emergency';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatAssistant from './components/ChatAssistant';

function App() {
  return (
    <TravelProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          
          <main style={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="/destination/:id" element={<DestinationDetail />} />
              <Route path="/itinerary" element={<Itinerary />} />
              <Route path="/emergency" element={<Emergency />} />
            </Routes>
          </main>

          <Footer />
          <ChatAssistant />
        </div>
      </Router>
    </TravelProvider>
  );
}

export default App;
