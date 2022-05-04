import Head from "next/head";
import Image from "next/image";
import Header, { HeaderActive } from "../components/Header";
import OpenSwap from "../components/OpenSwap";
import Spinner from "../components/Spinner";

import { ethers } from "ethers";

import Web3Modal from "web3modal";

import WalletConnectProvider from "@walletconnect/web3-provider";
import GreenLeft from "../public/greenLeft.svg";

// Create connector

const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider,
        options: {
            infuraId: "9bde5ac2ebc84a20928bd82154cd5f6b", // required
        },
    },
};

// const providerOptions = {
//   walletconnect: {
//       package: WalletConnectProvider,
//       options: {
//           rpc: {

//           } // required
//       },
//   },
// };

// const endpoint =
//     "https://mainnet.infura.io/v3/9bde5ac2ebc84a20928bd82154cd5f6b"; // your SKALE Chain endpoint
// const ethereumEndpoint =
//     "https://amsterdam.skalenodes.com/v1/attractive-muscida"; // your Ethereum endpoint
// const skaleChainId = 3092851097537429;

// const providerOptions = {
//     walletconnect: {
//         package: WalletConnectProvider,
//         options: {
//             rpc: {
//                 skaleChainId: ethereumEndpoint,
//                 4: endpoint,
//             },
//         },
//     },
// };

const erc721 = require("../contract/artifacts/@openzeppelin/contracts/token/ERC721/ERC721.sol/ERC721.json");
const swapContract = require("../contract/artifacts/contracts/Swapify.sol/Swapify.json");
const swapAddress = "0xc746023B897AF5a2C34E22c757cB8B7e7E88b1d1";

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
    const [approvedTokens, setApprovedTokens] = useState([]);
    const [approvedContracts, setApprovedContracts] = useState([]);

    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [userSwaps, setUserSwaps] = useState([]);

    const [txLoad, setTxLoad] = useState(false);
    const [approveLoad, setApproveLoad] = useState(false);

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
        setApproveLoad(true);
        const result = await tx.wait();

        setApproveLoad(false);
        let newTokens = [...approvedTokens];
        let newContracts = [...approvedContracts];

        newTokens.push(tokenId);
        newContracts.push(contractAddress);

        setApprovedTokens(newTokens);
        setApprovedContracts(newContracts);
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
            approvedContracts,
            approvedTokens,
            description
        );
        setTxLoad(true);
        const result = await tx.wait();
        setTxLoad(false);
        setApprovedContracts([]);
        setApprovedTokens([]);

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
            //Check if there is more than one nft on swap side

            let tokenIds = [swapDetails.tokenId];
            let tokenContracts = [swapDetails.token];

            if (Number(swapDetails?.tokenNumbers) > 1) {
                for (
                    let index = 1;
                    index < Number(swapDetails.tokenNumbers);
                    index++
                ) {
                    const swapDetails = await contract.getSwapToken(
                        swap.swapId,
                        index
                    );
                    tokenIds.push(swapDetails.tokenId);
                    tokenContracts.push(swapDetails.token);
                }
            }
            //Check it exists
            let offer;
            let offerDetails;

            let offerTokens = [];
            let offerContracts = [];

            console.log("OFFFER EXISTS");

            const exists = await contract.offerExists(swap.swapId);
            console.log(exists);
            if (exists) {
                offer = await contract.offers(swap.swapId, 0);
                offerDetails = await contract.getOfferToken(swap.swapId, 0, 0);
                offerTokens = [offerDetails.tokenId];
                offerContracts = [offerDetails.token];

                if (Number(offerDetails?.tokenNumbers) > 1) {
                    for (
                        let index = 1;
                        index < Number(offerDetails.tokenNumbers);
                        index++
                    ) {
                        const offerDetails = await contract.getOfferToken(
                            swap.swapId,
                            0,
                            index
                        );
                        offerTokens.push(offerDetails.tokenId);
                        offerContracts.push(offerDetails.token);
                    }
                }
            }
            console.log("SWAP STATUS");
            console.log(offerTokens);

            swaps.push({
                swapId: swap.swapId,
                tokenIds: tokenIds,
                contracts: tokenContracts,
                seller: swap.seller,
                description: swap.description,
                buyer: offer?.buyer,
                offerId: 0,
                offerTokens: offerTokens,
                offerContracts: offerContracts,
                status: offerDetails?.token
                    ? offerDetails?.status
                    : swap.status,
            });
        }

        console.log(swaps);

        setUserSwaps(swaps);
    };

    const { isShowing, toggle } = useModal();

    if (txLoad) {
        return (
            <div class="grid place-items-center h-screen">
                <Spinner />
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen">
                <Header active={HeaderActive.Swaps} />
                {address ? (
                    <div className="mx-4 my-8 w-4/5 mx-auto" data-aos="fade-up">
                        <OpenSwap toggle={toggle} />
                        <div className="flex flex-col gap-y-6 pb-6 pt-4">
                            <h1 className="text-3xl">Active Swaps✨</h1>
                        </div>
                        <div className="flex flex-col gap-y-10">
                            {userSwaps.map((swap) => (
                                <div
                                    key={swap.swapId}
                                    className="flex flex-col items-start gap-x-10"
                                >
                                    {swap && (
                                        <>
                                            <h2>
                                                Swap {Number(swap.swapId)}🌈
                                            </h2>
                                            {swap.tokenIds.map(
                                                (tokenId, index) => (
                                                    <div
                                                        key={index}
                                                        style={{
                                                            marginBottom: 15,
                                                        }}
                                                    >
                                                        <NFTCard
                                                            key={index}
                                                            tokenId={tokenId}
                                                            contract={
                                                                swap.contracts[
                                                                    index
                                                                ]
                                                            }
                                                            description={
                                                                swap.description
                                                            }
                                                            address={
                                                                swap.seller
                                                            }
                                                        />
                                                    </div>
                                                )
                                            )}

                                            {swap.offerTokens?.length > 0 && (
                                                <>
                                                    <Tick
                                                        acceptSwap={() =>
                                                            acceptSwap(
                                                                swap.swapId,
                                                                0
                                                            )
                                                        }
                                                    />
                                                    {swap.offerTokens.map(
                                                        (offerToken, index) => (
                                                            <div
                                                                key={index}
                                                                style={{
                                                                    marginBottom: 15,
                                                                }}
                                                            >
                                                                <NFTCard
                                                                    tokenId={
                                                                        offerToken
                                                                    }
                                                                    contract={
                                                                        swap
                                                                            .offerContracts[
                                                                            index
                                                                        ]
                                                                    }
                                                                    description={
                                                                        swap.description
                                                                    }
                                                                    address={
                                                                        swap.buyer
                                                                    }
                                                                />
                                                            </div>
                                                        )
                                                    )}
                                                </>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col gap-y-6">
                            {userSwaps.length == 0 && (
                                <h5>No active swaps yet</h5>
                            )}
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
                approvedTokens={approvedTokens}
                approved={approvedTokens?.length > 0 ? true : false}
                txLoad={approveLoad}
                isShowing={isShowing}
                createSwap={createSwap}
                address={address}
                hide={toggle}
                initialized
            />
        </>
    );
}
