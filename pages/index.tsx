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
const swapAddress = "0xeF969456383e03ad7891B11cc0c0dA4d7741071c";

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
        const tx = await tokenContract.approve(swapAddress, tokenId);
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

        console.log(swapId);
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
            console.log(swap);

            const swapDetails = await contract.getSwapToken(swap.swapId, 0);
            console.log(swapDetails);
            //Check it exists
            let offer;
            let offerDetails;

            console.log("OFFFER EXISTS");

            const exists = await contract.offerExists(swap.swapId);
            console.log(exists);
            if (exists) {
                offer = await contract.offers(swap.swapId, 0);
                console.log("THIS IS OFFER");
                console.log(offer);
                offerDetails = await contract.getOfferToken(swap.swapId, 0, 0);
                console.log("OFFFER EXISTS");
                console.log(offerDetails);
            }
            console.log("SWAP STATUS");

            swaps.push({
                swapId: swap.swapId,
                tokenId: swapDetails.tokenId,
                contract: swapDetails.token,
                seller: swap.seller,
                description: swap.description,
                buyer: offer?.buyer,
                offerId: 0,
                offerToken: offerDetails?.tokenId,
                offerAddress: offerDetails?.token,
                status: offerDetails?.token
                    ? offerDetails?.status
                    : swap.status,
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
                    <div className="mx-4 my-8 w-4/5 mx-auto" data-aos="fade-up">
                        <OpenSwap toggle={toggle} />
                        <div className="flex flex-col gap-y-6 pb-6 pt-4">
                            <h1 className="text-3xl">Your open swap</h1>
                            <h5>Your NFTs up for swap</h5>
                        </div>
                        <div className="flex flex-col gap-y-6">
                            {userSwaps.map((swap) => (
                                <div
                                    key={swap.swapId}
                                    className="flex flex-row items-center gap-x-10"
                                >
                                    {swap.status == 1 && !swap?.offerToken && (
                                        <>
                                            <NFTCard
                                                tokenId={swap.tokenId}
                                                contract={swap.contract}
                                                description={swap.description}
                                                address={swap.seller}
                                            />
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                        <h5 className="py-6">Your trade requests</h5>
                        <div className="flex flex-col gap-y-6">
                            {userSwaps.map((swap) => (
                                <div
                                    key={swap.swapId}
                                    className="flex flex-row w-screen items-center gap-x-10"
                                >
                                    {swap.status == 1 && swap?.offerToken && (
                                        <>
                                            <NFTCard
                                                tokenId={swap.tokenId}
                                                contract={swap.contract}
                                                description={swap.description}
                                                address={swap.seller}
                                            />

                                            {swap?.offerToken && (
                                                <>
                                                    <Tick
                                                        acceptSwap={() =>
                                                            acceptSwap(
                                                                swap.swapId,
                                                                0
                                                            )
                                                        }
                                                    />
                                                    <NFTCard
                                                        tokenId={
                                                            swap.offerToken
                                                        }
                                                        contract={
                                                            swap.offerAddress
                                                        }
                                                        description={
                                                            swap.description
                                                        }
                                                        address={swap.buyer}
                                                    />
                                                </>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
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
                swapId
                approveNft={approveNft}
                approvedNft={approved}
                approved={approved}
                txLoad={txLoad}
                isShowing={isShowing}
                createSwap={createSwap}
                address={address}
                hide={toggle}
                initialized
            />
        </>
    );
}
