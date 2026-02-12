import { createBrowserRouter } from "react-router-dom";
import GetVoterList from "../pages/Voter/GetVoterList";
import GetCandidateList from "../pages/Candidate/GetCandidateList";
import RegisterCandidate from "../pages/Candidate/RegisterCandidate";
import RegisterVoter from "../pages/Voter/RegisterVoter";
import ElectionCommision from "../pages/ElectionCommision/ElectionCommision";
import Wallet from "../components/Wallet/Wallet";
import Layout from "../components/Layout/Layout";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <Wallet />
      </Layout>
    ),
  },
  {
    path: "register-voter",
    element: (
      <Layout>
        <RegisterVoter />
      </Layout>
    ),
  },
  {
    path: "register-candidate",
    element: (
      <Layout>
        <RegisterCandidate />
      </Layout>
    ),
  },
  {
    path: "voter-list",
    element: (
      <Layout>
        <GetVoterList />
      </Layout>
    ),
  },
  {
    path: "candidate-list",
    element: (
      <Layout>
        <GetCandidateList />
      </Layout>
    ),
  },
  {
    path: "election-commision",
    element: (
      <Layout>
        <ElectionCommision />
      </Layout>
    ),
  },
]);
