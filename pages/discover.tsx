import { ethers } from "ethers";
import Header, { HeaderActive } from "../components/Header";
import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import NFTCard from "../components/NFTCard";
import OpenSwap from "../components/OpenSwap";
import useModal from "../hooks/showModal";
import abi from "../contract/artifacts/contracts/Swapify.sol/Swapify.json";
import GreenLeft from "../public/greenLeft.svg";
import Web3Modal from "web3modal";
import Spinner from "../components/Spinner";

const swapAddress = "0xc746023B897AF5a2C34E22c757cB8B7e7E88b1d1";
const erc721 = require("../contract/artifacts/@openzeppelin/contracts/token/ERC721/ERC721.sol/ERC721.json");
import WalletConnectProvider from "@walletconnect/web3-provider";
// Create connector

const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider,
        options: {
            infuraId: "9bde5ac2ebc84a20928bd82154cd5f6b", // required
        },
    },
};

const Discover = () => {
    const [openSwaps, setOpenSwaps] = useState([]);
    const [address, setAddress] = useState(null);
    const [approvedTokens, setApprovedTokens] = useState([]);
    const [approvedContracts, setApprovedContracts] = useState([]);
    const [signer, setSigner] = useState(null);
    const [swapId, setSwapId] = useState(null);

    const [txLoad, setTxLoad] = useState(false);
    const [approveLoad, setApproveLoad] = useState(false);

    useEffect(() => {
        getData();
    }, []);

    async function getData() {
        const web3Modal = new Web3Modal({
            network: "rinkeby", // optional
            cacheProvider: true, // optional
            providerOptions,
        });
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        setSigner(signer);
        const addresses = await provider.listAccounts();
        if (addresses?.length > 0) setAddress(addresses[0]);

        const contract = new ethers.Contract(swapAddress, abi.abi, signer);
        const swapCount = await contract.swapCount();

        let openSwaps = [];
        for (let index = 0; index < Number(swapCount); index++) {
            let swap = await contract.swaps(index);
            const swapDetails = await contract.getSwapToken(swap.swapId, 0);

            if (swap.status == 1) {
                openSwaps.push({
                    swapId: swap.swapId,
                    tokenId: swapDetails.tokenId,
                    contract: swapDetails.token,
                    description: swap.description,
                    seller: swap.seller,
                    buyer: swap.buyer,
                    status: swap.status,
                });
            }
        }
        setOpenSwaps(openSwaps);
    }

    const approveNft = async (contractAddress, tokenId) => {
        const tokenContract = new ethers.Contract(
            contractAddress,
            erc721.abi,
            signer
        );

        console.log(contractAddress);
        console.log(tokenId);

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

    const createOffer = async (_swapId) => {
        const contract = new ethers.Contract(swapAddress, abi.abi, signer);

        // const data = await contract.userSwaps(address, 0);
        // console.log(data);

        console.log(_swapId);

        const tx = await contract.proposeOffer(
            _swapId,
            approvedContracts,
            approvedTokens
        );
        setTxLoad(true);
        const result = await tx.wait();
        setTxLoad(false);
        setApprovedContracts([]);
        setApprovedTokens([]);

        toggle();
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
            <Header active={HeaderActive.Discover} />
            <div className="w-4/5 mx-auto">
                <h1 className="text-3xl mt-20 mb-4">Discover</h1>
                <div className="flex flex-col gap-y-6" data-aos="fade-in">
                    {openSwaps.map((swap) => {
                        return (
                            <>
                                {address != swap.seller && (
                                    <div
                                        key={swap.swapId}
                                        className="flex  flex-col gap-x-10"
                                    >
                                        <div className="flex flex-row gap-x-10  items-center">
                                            <NFTCard
                                                address={swap.seller}
                                                description={swap.description}
                                                tokenId={swap.tokenId}
                                                contract={swap.contract}
                                            />
                                            <div className="flex flex-col gap-y-4">
                                                <GreenLeft />
                                            </div>
                                            <button
                                                onClick={() => {
                                                    toggle();
                                                    setSwapId(swap.swapId);
                                                }}
                                                className="bg-swapify-purple px-10 text-sm font-bold py-2 rounded-full hover:bg-purple-600"
                                            >
                                                Propose offer
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        );
                    })}
                </div>
            </div>
            <Modal
                approveNft={approveNft}
                approvedTokens={approvedTokens}
                approved={approvedTokens?.length > 0 ? true : false}
                txLoad={approveLoad}
                isShowing={isShowing}
                createSwap={createOffer}
                address={address}
                swapId={swapId}
                hide={toggle}
                initialized={false}
            />
        </>
    );
};

export default Discover;
