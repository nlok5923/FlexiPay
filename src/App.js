import './App.css';
import './fonts.css'
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import PageLayout from "./shared/PageLayout/PageLayout";
import LandingPage from "./components/LandingPage/LandingPage";
import CreateEvent from "./components/CreateEvent/CreateEvent";
import EventList from "./components/EventList/EventList";
import EventDetails from './components/EventList/EventDetails/EventDetails';
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import AboutVlad from './components/AboutVlad/AboutVlad';
import { MoralisProvider } from "react-moralis";

const { chains, provider } = configureChains(
  [chain.polygonMumbai, chain.ropsten, chain.goerli, chain.hardhat],
  [
    alchemyProvider({ alchemyId: process.env.REACT_APP_QUICK_NODE_URL }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function App() {
  return (
    <div className='App'>
      <MoralisProvider appId={process.env.REACT_APP_MORALIS_APP_ID} serverUrl={process.env.REACT_APP_MORALIS_SERVER_URL}>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <Router>
            <PageLayout>
              <Routes>
                <Route path="/" element={<LandingPage/>} />
                <Route path="/create-event" element={<CreateEvent />} />
                <Route path="/events" element={<EventList />} />
                <Route path='/events/:id' element={<EventDetails />} />
                <Route path='/about-vlad' element={<AboutVlad />} />
              </Routes>
            </PageLayout>
          </Router>
        </RainbowKitProvider>
      </WagmiConfig>
      </MoralisProvider>
    </div>
  );
}

export default App;