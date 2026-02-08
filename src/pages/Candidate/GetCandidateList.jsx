import {useEffect } from 'react';
import { useWeb3Context } from '../../context/useWeb3Context';


const GetCandidateList = () =>{
    const {contractInstance} = useWeb3Context();

    useEffect(()=>{
        const fectchCandidateList = async()=>{
            try{
                const candidateList = await contractInstance.getCandidateList();
                console.log(candidateList);
            }catch(error){
                console.log(error);
            }
        }
        contractInstance && fectchCandidateList()
    },[contractInstance])

    return(
        <>
        </>
    )
}
export default GetCandidateList;