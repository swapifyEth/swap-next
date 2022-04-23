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
const swapAddress = "0x230C3F1DeB92cdf4bE58ECE0800cc2be94157013";

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
        if (address) {
            (async () => {
                await getOpenSwaps();
            })();
        }
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

        //Call approve
        const tx = await tokenContract.approve(contractAddress, tokenId);
        setTxLoad(true);
        const result = await tx.wait();

        setTxLoad(false);

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
        setTxLoad(true);
        const result = await tx.wait();
        setTxLoad(false);
        toggle();
    };

    const acceptSwap = async (swapId, offerId) => {
        const contract = new ethers.Contract(
            swapAddress,
            swapContract.abi,
            signer
        );

        // const data = await contract.userSwaps(address, 0);
        // console.log(data);
        const tx = await contract.acceptOffer(swapId, offerId);
        setTxLoad(true);
        const result = await tx.wait();
        console.log(result);
        setTxLoad(false);
    };

    const getOpenSwaps = async () => {
        const contract = new ethers.Contract(
            swapAddress,
            swapContract.abi,
            signer
        );

        const userCount = await contract.userSwapCount(address);

        //Loop through
        let swaps = [];
        console.log("started getting waps");
        for (let index = 0; index < Number(userCount); index++) {
            let swap = await contract.userSwaps(address, index);
            const swapDetails = await contract.getSwapToken(swap.swapId, 0);

            //Check it exists
            let offer;
            let offerDetails;

            const exists = await contract.offerExists(swap.swapId);
            if (exists) {
                offer = await contract.offers(swap.swapId, 0);
                const offerDetails = await contract.getOfferToken(
                    swap.swapId,
                    0,
                    0
                );
                console.log(offerDetails);
            }

            swaps.push({
                swapId: swap.swapId,
                tokenId: swapDetails.tokenId,
                contract: swapDetails.token,
                description: swap.description,
                buyer: swap.buyer,
                offerId: offer?.id,
                offerToken: offerDetails?.tokenId,
                offerAddress: offerDetails?.token,
                status: swap.status,
            });
        }

        console.log(swaps);

        setUserSwaps(swaps);
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
                                {userSwaps.map((swap) => (
                                    <div
                                        key={swap.swapId}
                                        className="flex flex-row w-screen items-center gap-x-10"
                                    >
                                        {swap.status == 1 && (
                                            <>
                                                <NFTCard
                                                    tokenId={swap.tokenId}
                                                    contract={swap.contract}
                                                    description={swap.description}
                                                />

                                                {swap?.offerToken && (
                                                    <>
                                                        <Tick
                                                            accept={() =>
                                                                acceptSwap(
                                                                    swap.swapId,
                                                                    swap.offerId
                                                                )
                                                            }
                                                        />
                                                        {/* //<NFTCard /> */}
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </div>
                                ))}
                        </div>
                        <h5 className="py-6">Your trade requests</h5>
                        <div className="flex flex-col gap-y-6">
                            <div className="flex flex-row items-center gap-x-10">
                                {/* <NFTCard />
                                <div className="flex flex-col gap-y-4">
                                    <Tick />
                                    <Cross />
                                </div>
                                <NFTCard /> */}
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
