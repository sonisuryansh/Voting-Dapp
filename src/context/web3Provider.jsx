import Web3Context, {Web3context} from './web3Context.jsx';
const Web3Provider = ()=>{

    cosnt [web3State,setweb3State] = useState({
        contractInstance:null,
        selectedAccount:null,
        chainId:null
    });

    return (
        <>
            <Web3Context.Provider value={web3State}>
                
            </Web3Context.Provider>
            <button>Connect Wallet</button>
        </>
    )

}