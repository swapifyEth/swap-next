import React, { useEffect, useState } from "react";

const axios = require("axios").default;

const OpenSwap = ({ createSwap, address, approveNft, approved, txLoad }) => {
    //Load wallet nfts
    const [nfts, setNfts] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const result = await axios.get(
                    `https://eth-rinkeby.alchemyapi.io/v2/demo/getNFTs/nBdRx9b77E3p9TU4Vte09EYfuUGisD1Z?owner=${address}`
                );

                console.log(result);

                if (result?.data?.ownedNfts?.length > 0) {
                    setNfts(result?.data?.ownedNfts);
                }
            } catch (err) {
                console.error(err);
            }
        })();
    }, []);

    return (
            <div onClick={toggle} className="rounded-xl flex w-fit flex-row items-center hover:bg-gray-900 bg-swapify-gray gap-x-6 text-3xl pr-6 cursor-pointer">
            <div className="bg-swapify-purple h-full flex items-center rounded-l-xl p-12 text-5xl">
                <h1>+</h1>
            </div>
            <h1>
                Create a new swap
            </h1>
            <h1>Create a new swap</h1>
            {nfts.map((nft) => (
                <div
                    style={{
                        width: 100,
                        height: 100,
                        backgroundColor: "purple",
                    }}
                    key={nft?.contract?.addresss + nft?.id?.tokenId}
                >
                    <h1>{nft?.metadata?.name}</h1>
                    <p>{nft?.contract?.address}</p>
                    <p>{nft?.id?.tokenId}</p>
                    <button
                        onClick={() =>
                            approveNft(nft?.contract?.address, nft?.id?.tokenId)
                        }
                    >
                        Approve this
                    </button>
                </div>
            ))}
            {approved && (
                <div>
                    <button onClick={() => createSwap("test")}>
                        Create swap
                    </button>
                </div>
            )}
        </div>
    );
};

export default OpenSwap;
