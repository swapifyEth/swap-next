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

const swapAddress = "0x230C3F1DeB92cdf4bE58ECE0800cc2be94157013";
const erc721 = require("../contract/artifacts/@openzeppelin/contracts/token/ERC721/ERC721.sol/ERC721.json");

const Discover = () => {
    const [openSwaps, setOpenSwaps] = useState([]);
    const [address, setAddress] = useState(null);
    const [approved, setApproved] = useState(null);
    const [signer, setSigner] = useState(null);
    const [swapId, setSwapId] = useState(null);

    const [txLoad, setTxLoad] = useState(false);

    useEffect(() => {
        getData();
    }, []);

    async function getData() {
        const web3Modal = new Web3Modal({
            network: "rinkeby", // optional
            cacheProvider: true, // optional
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

        //Call approve
        const tx = await tokenContract.approve(contractAddress, tokenId);
        setTxLoad(true);
        const result = await tx.wait();

        setTxLoad(false);

        setApproved({ contractAddress, tokenId: tokenId });
    };

    const createOffer = async (_swapId) => {
        const contract = new ethers.Contract(swapAddress, abi.abi, signer);

        // const data = await contract.userSwaps(address, 0);
        // console.log(data);

        console.log(_swapId);

        const tx = await contract.proposeOffer(
            _swapId,
            [approved.contractAddress],
            [approved.tokenId]
        );
        setTxLoad(true);
        const result = await tx.wait();
        setTxLoad(false);
        toggle();
    };

    const { isShowing, toggle } = useModal();
    return (
        <>
            <Header active={HeaderActive.Discover} />
            <div>
                <h1 className="text-3xl mt-20 mb-4">Discover</h1>
                <div className="flex flex-col gap-y-6" data-aos="fade-in">
                        {openSwaps.map((swap) => {
                            return (
                                <div  key={swap.swapId} className="flex flex-col items-center gap-x-10">
                                <div className="flex flex-row w-screen items-center">
                                    <>
                                    <NFTCard
                                        description={swap.description}
                                        tokenId={swap.tokenId}
                                        contract={swap.contract}
                                    />
                                    <button
                                        onClick={() => {
                                            toggle();
                                            setSwapId(swap.swapId);
                                        }}
                                    >
                                        propose offer
                                    </button>
                                    </>
                                </div>
                                </div>
                            );
                        })}

                        <div className="flex flex-col gap-y-4">
                            <GreenLeft />
                        </div>
                        {/* <OpenSwap toggle={toggle}/> */}
                    </div>
            </div>
            <Modal
                approveNft={approveNft}
                approvedNft={approved}
                approved={approved}
                txLoad={txLoad}
                isShowing={isShowing}
                createSwap={createOffer}
                address={address}
                swapId={swapId}
                hide={toggle}
            />
        </>
    );
};

export default Discover;
