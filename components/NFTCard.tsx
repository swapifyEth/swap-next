import Image from "next/image";
import axios from "axios";

import React, { useEffect, useState } from "react";

const NFTCard = ({ description, tokenId, contract, address }) => {
    const [nft, setNft] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                console.log(tokenId);
                console.log(contract);
                const result = await axios.get(
                    `https://eth-rinkeby.alchemyapi.io/v2/nBdRx9b77E3p9TU4Vte09EYfuUGisD1Z/getNFTMetadata?tokenId=${tokenId}&contractAddress=${contract}`
                );
                console.log("RESULT");

                setNft(result.data.metadata);
            } catch (err) {
                console.error(err);
            }
        })();
    }, [tokenId, contract]);

    if (!nft) {
        return <div />;
    }

    return (
        <div className="rounded-xl flex flex-row items-center bg-swapify-gray gap-x-6 text-3xl h-48">
            <div className="bg-swapify-purple h-full w-48 rounded-l-xl relative">
                <Image alt="" layout="fill" src={nft?.image} />
            </div>
            <div className="flex flex-col gap-y-4 py-4 pr-4">
                <h1>{nft?.name}</h1>
                <div className="bg-white rounded-full py-2 px-1 flex flex-row item-center gap-x-6 cursor-pointer">
                    <Image alt="" width="32" height="32" src="/Avatar.png" />
                    <p className="text-black text-sm pt-1">{address}</p>
                </div>
                <p className="text-sm">{description}</p>
            </div>
        </div>
    );
};

export default NFTCard;
