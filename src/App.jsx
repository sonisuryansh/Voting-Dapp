import "./App.css";
import Dummy from "./Dummy.jsx";
import Web3Provider from "./context/web3Provider.jsx";
import RegisterCandidate from "./pages/Candidate/RegisterCandidate.jsx";
import RegisterVoter from "./pages/Voter/RegisterVoter.jsx";

function App() {
  return (
    <Web3Provider>
      {/* <Dummy /> */}
      {/* <RegisterCandidate></RegisterCandidate> */}
      <RegisterVoter></RegisterVoter>

      // 35.05
      
    </Web3Provider>
  );
}

export default App;
