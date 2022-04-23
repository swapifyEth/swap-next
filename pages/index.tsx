import Head from "next/head";
import Image from "next/image";
import Header, { HeaderActive } from "../components/Header";
import OpenSwap from "../components/OpenSwap";

import { ethers } from "ethers";

import Web3Modal from "web3modal";

import WalletConnectProvider from "@walletconnect/web3-provider";
// Create connector

const providerOptions = {
    walletconnect: {
        display: {
            name: "Mobile",
        },
        package: WalletConnectProvider,
        options: {
            infuraId: "9bde5ac2ebc84a20928bd82154cd5f6b", // required
        },
    },
};

const erc721 = require("../contract/artifacts/@openzeppelin/contracts/token/ERC721/ERC721.sol/ERC721.json");
const swapContract = require("../contract/artifacts/contracts/Swapify.sol/Swapify.json");
const swapAddress = "0xDcec92d40A64eAD7Ece4dd3e3090Dcc411156007";

import { WebSocketProvider } from "@ethersproject/providers";
import { useEffect, useState } from "react";
import Cross from "../components/Cross";
import Footer from "../components/Footer";
import Modal from "../components/Modal";
import NFTCard from "../components/NFTCard";
import Tick from "../components/Tick";
import useModal from "../hooks/showModal";

export default function Home() {
    const [address, setAddress] = useState(null);
    const [approved, setApproved] = useState(null);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [userSwaps, setUserSwaps] = useState([]);

    const [txLoad, setTxLoad] = useState(false);

    useEffect(() => {
        if (address) getOpenSwaps();
    }, [address]);

    const connectWallet = async () => {
        if (window) {
            const web3Modal = new Web3Modal({
                network: "rinkeby", // optional
                cacheProvider: true, // optional
                providerOptions, // required
            });
            const instance = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(instance);
            setProvider(provider);

            const addresses = await provider.listAccounts();
            console.log(addresses);
            if (addresses?.length > 0) setAddress(addresses[0]);

            const signer = provider.getSigner();
            setSigner(signer);
        }
    };

    const approveNft = async (contractAddress, tokenId) => {
        const tokenContract = new ethers.Contract(
            contractAddress,
            erc721.abi,
            signer
        );

        console.log(tokenContract);

        //Call approve
        const tx = await tokenContract.approve(contractAddress, tokenId);
        const result = await tx.wait();

        console.log(result);

        setApproved({ contractAddress, tokenId: tokenId });
    };

    const createSwap = async (description) => {
        const contract = new ethers.Contract(
            swapAddress,
            swapContract.abi,
            signer
        );

        // const data = await contract.userSwaps(address, 0);
        // console.log(data);
        const tx = await contract.createSwap(
            [approved.contractAddress],
            [approved.tokenId],
            description
        );
        const result = await tx.wait();
        console.log(result);
        toggle();
    };

    const getOpenSwaps = async () => {
        const contract = new ethers.Contract(
            swapAddress,
            swapContract.abi,
            signer
        );

        const userCount = await contract.userSwapCount(address);
        console.log(userCount);

        //Loop through
        let swaps = [];
        for (let index = 0; index < Number(userCount); index++) {
            let swap = await contract.userSwaps(address, index);
            swaps.push(swap);
        }

        setUserSwaps(swaps);

        console.log(swaps[0][4]);
    };

    const { isShowing, toggle } = useModal();

    return (
        <>
            <div className="min-h-screen">
                <Header active={HeaderActive.Swaps} />
                {address ? (
                    <div className="mx-4 my-8 w-full" data-aos="fade-up">
                        <OpenSwap toggle={toggle} />
                        <div className="flex flex-col gap-y-6 pb-6 pt-4">
                            <h1 className="text-3xl">Your open swap</h1>
                            <h5>Your NFTs up for swap</h5>
                        </div>
                        <div className="flex flex-col gap-y-6">
                            <div className="flex flex-row items-center gap-x-10">
                              <>
                                {userSwaps.map(() => {
                                    <NFTCard />;
                                })}
                                <Cross />
                              </>
                            </div>
                        </div>
                        <h5 className="py-6">Your trade requests</h5>
                        <div className="flex flex-col gap-y-6">
                            <div className="flex flex-row items-center gap-x-10">
                                <NFTCard />
                                <div className="flex flex-col gap-y-4">
                                    <Tick />
                                    <Cross />
                                </div>
                                <NFTCard />
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <button
                                onClick={() => connectWallet()}
                                className="bg-swapify-purple px-10 text-sm font-bold py-2 rounded-full hover:bg-purple-600"
                            >
                                Connect wallet
                            </button>
                        </div>
                        <Footer />
                    </>
                )}
            </div>
            <Modal
                approveNft={approveNft}
                approvedNft={approved}
                approved={approved}
                txLoad={txLoad}
                isShowing={isShowing}
                createSwap={createSwap}
                address={address}
                hide={toggle}
            />
        </>
    );
}
