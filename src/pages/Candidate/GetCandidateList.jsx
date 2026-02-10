import {useEffect } from 'react';
import { useWeb3Context } from '../../context/useWeb3Context';
import {useState} from 'react';

const GetCandidateList = () =>{
    const {web3State} = useWeb3Context();
    const {contractInstance} = web3State;
    const [candidateList, setcandidateList] = useState([])

    useEffect(()=>{
        const fectchCandidateList = async()=>{
            try{
                const candidateList = await contractInstance.getCandidateList();
                setcandidateList(candidateList)
                console.log(candidateList);
            }catch(error){
                console.log(error);
            }
        }
        contractInstance && fectchCandidateList()
    },[contractInstance])

    return(
        <>
        <ul>
        {candidateList.map((candidateList,index)=>(
            
                <li key={index}>
                      Name: {candidateList.name},
                      Party: {candidateList.party},
                      Age : {candidateList.age.toString()},
                      Votes: {candidateList.votes.toString()}
                 </li>
        ))}
        </ul>
        </>
    )
}
export default GetCandidateList;