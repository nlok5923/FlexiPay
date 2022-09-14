import './App.css';
import './fonts.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PageLayout from "./shared/PageLayout/PageLayout";
import LandingPage from "./components/LandingPage/LandingPage";
import CreateEvent from "./components/CreateEvent/CreateEvent"
import EventList from './components/EventList/EventList';
import EventDetails from './components/EventList/EventDetails/EventDetails';
import JoinEvent from './components/EventList/JoinEvent/JoinEvent';

function App() {
  return (
    <div className='App'>
      <Router>
        <PageLayout>
          <Routes>
            <Route path="/" element={<LandingPage/>} />
            <Route path="/create-event" element={<CreateEvent/>}  />
            <Route path='/events' element={<EventList/>} />
            <Route path='/events/:id' element={<EventDetails />} />
            <Route path='/join-event' element={<JoinEvent />} />
          </Routes>
        </PageLayout>
      </Router>
    </div>
  );
}

export default App;
// $ curl -X GET https://api.covalenthq.com/v1/1/block_v2/5000000/ \
//    -u ckey_92f7a815779a4451a77bb98f392:
//    -H 'Content-Type: application/json'

// address to use: 0xc4145d530E7FF09a7051343eB8e17181EC94fdd5