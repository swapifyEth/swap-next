import Header, { HeaderActive } from "../components/Header";
import NFTCard from "../components/NFTCard";
import Image from "next/image";
import useModal from "../hooks/showModal";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import React, { useState, useEffect } from "react";
import axios from "axios";

import ProfileNFTCard from "../components/ProfileNFTCard";

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

const Profile = () => {
    const [address, setAddress] = useState(null);
    const [txLoad, setTxLoad] = useState(false);

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
        const addresses = await provider.listAccounts();
        if (addresses?.length > 0) setAddress(addresses[0]);
    }

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
                    console.log(nfts);
                }
            } catch (err) {
                console.error(err);
            }
        })();
    }, [address]);

    return (
        <>
            <Header active={HeaderActive.Profile} />
            <div>
                <h1 className="text-3xl mt-20 mb-4">Profile</h1>
                <div className="flex flex-row gap-x-3 my-6">
                    <Image alt="" width="32" height="32" src="/Avatar.png" />
                    <p>{address}</p>
                </div>
                <div className="flex flex-col gap-y-6" data-aos="fade-in">
                    <div className="flex flex-row items-center gap-x-10">
                        {nfts.map((nft, index) => (
                            <ProfileNFTCard
                                key={index}
                                name={nft?.metadata?.name}
                                image={nft?.metadata?.image}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;
