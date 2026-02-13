import { formatEther } from "ethers";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const TokenPrice = ({ contractInstance }) => {
    const [tokenPrice, setTokenPrice] = useState(null);

    useEffect(() => {
        if (!contractInstance) return;

        const fetchTokenPrice = async () => {
            try {
                const tokenPriceWei = await contractInstance.tokenPrice();
                const tokenPriceEth = formatEther(tokenPriceWei);
                setTokenPrice(Number(tokenPriceEth).toFixed(4));
            } catch (error) {
                toast.error("Error fetching token price");
                console.error(error);
            }
        };

        fetchTokenPrice();
    }, [contractInstance]);

    return (
        <>
            Token Price: {tokenPrice !== null ? `${tokenPrice} ETH` : "Loading..."}
        </>
    );
};

export default TokenPrice;