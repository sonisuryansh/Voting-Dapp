import "./App.css";
import Dummy from "./Dummy.jsx";
import Web3Provider from "./context/web3Provider.jsx";


function App() {
  return (
    <Web3Provider>
      <Dummy />
    </Web3Provider>
  );
}

export default App;
