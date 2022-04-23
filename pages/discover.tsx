import { ethers } from "ethers";
import Header, { HeaderActive } from "../components/Header";
import {useState} from "react";
import Modal from "../components/Modal";
import NFTCard from "../components/NFTCard";
import OpenSwap from "../components/OpenSwap";
import useModal from "../hooks/showModal";
import abi from '../contract/artifacts/contracts/Swapify.sol/Swapify.json';
import GreenLeft from "../public/greenLeft.svg";
import Web3Modal from 'web3modal';

const Discover = () => {

    const [nfts, setNfts] = useState([])
    async function getData() {
        const address = "0x230C3F1DeB92cdf4bE58ECE0800cc2be94157013";
        const web3Modal = new Web3Modal({
            network: "rinkeby", // optional
            cacheProvider: true, // optional
        })
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
    
        const contract = new ethers.Contract(address, abi.abi, signer);
        console.log(contract);
        const index = await contract.swapCount();
    }
    getData();

    const { isShowing, toggle } = useModal();
    return (
        <>
            <Header active={HeaderActive.Discover} />
            <div>
                <h1 className="text-3xl mt-20 mb-4">Discover</h1>
                <div className="flex flex-col gap-y-6" data-aos="fade-in">
                    <div className="flex flex-row items-center gap-x-10">
                        {/* <NFTCard /> */}
                        <div className="flex flex-col gap-y-4">
                            <GreenLeft />
                        </div>
                        {/* <OpenSwap toggle={toggle}/> */}
                    </div>
                </div>
            </div>
            {/* <Modal isShowing={isShowing} hide={toggle} /> */}
        </>
    );
};

export default Discover;
