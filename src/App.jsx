
import Web3Provider from "./context/web3Provider.jsx";
import RegisterCandidate from "./pages/Candidate/RegisterCandidate.jsx";
import RegisterVoter from "./pages/Voter/RegisterVoter.jsx";
import { routes } from "./routes/routes.jsx";
import { RouterProvider } from "react-router-dom";
import "./App.css";


function App() {
  return (
       
    <Web3Provider>
      <RouterProvider router ={routes}></RouterProvider>
    </Web3Provider>
  );
}

export default App;
