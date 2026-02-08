// register-voter 
// voter-list
// register-candidate
// candidate-list

import { createBrowserRouter } from "react-router-dom";
import GetVoterList from "../pages/Voter/GetVoterList";
import GetCandidateList from "../pages/Candidate/GetCandidateList";
import RegisterCandidate from "../pages/Candidate/RegisterCandidate";
import RegisterVoter from "../pages/Voter/RegisterVoter";
import ElectionCommision from "../pages/ElectionCommision/ElectionCommision";
import App from "../App";
import Wallet from "../components/Wallet/Wallet.jsx";
import Navigation from "../components/Navigation/Navigation.jsx";

export const routes = createBrowserRouter([
    {path:'/',element:(
    <div>
        <Navigation></Navigation>
        <Wallet/>
    </div>
    )},
    {path:'register-voter', element:(
    <div>
        <Navigation></Navigation>
        <RegisterVoter/>
    </div>
    )},
    {path:'register-candidate', element:(
    <div>
        <Navigation></Navigation>
        <RegisterCandidate/>
    </div>
    )},
    {path:'voter-list', element:(
    <div>
        <Navigation></Navigation>
        <GetVoterList/>
    </div>
    )},
    {path:'candidate-list', element:(
    <div>
        <Navigation></Navigation>
        <GetCandidateList/>
    </div>
    )},
    {path:'election-commision', element:(
    <div>
        <Navigation></Navigation>
        <ElectionCommision/>
    </div>
    )}
]);