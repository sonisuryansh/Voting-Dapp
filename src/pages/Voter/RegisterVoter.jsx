import { useRef } from "react";
import { useWeb3Context } from "../../context/useWeb3Context";

const RegisterVoter =()=>{
    const {contractInstance} = useWeb3Context();
    const nameRef = useRef(null);
    const dobRef = useRef(null);
    const genderRef = useRef(null);
    const addressRef = useRef(null);

    const handleVoterRegistration = async(e) =>{
        try{
            e.preventDefault();
            const name= nameRef.current.value;
            const dob = dobRef.current.value;
            const gender = genderRef.current.value;
            const address = addressRef.current.value;

            console.log(name , dob, gender ,address);
            // await  contractInstance.registerVoter(name ,age, gender);
            // console.log("registration is Successful");
        }catch(error){
            console.log(error);
        }
    }
return(
    <>
    <form onSubmit={handleVoterRegistration}>
        <label>
            Name:
            <input type="text" ref={nameRef}></input>
        </label>
        <label>
            DOB:
            <input type="date" ref={dobRef}></input>
        </label>
        <label>
            Gender:
            <label >Male
                <input type="radio" ref={genderRef}></input>
            </label>
            <label >Female
                <input type="radio" ref={genderRef}></input>
            </label>
            
        </label>
        <label>
            Address:
            <input type="text" ref={genderRef}></input>
        </label>
        <button type="submit"  ref={addressRef}>RegisterVoter</button>
    </form>
    </>
)
}

export default RegisterVoter;