import {creatPortal} from 'react-dom';
import ReactDOM from 'react-dom';
import React from 'react';
import VNFTCard from './VNFTCard';

const Modal = ({isShowing, hide} : {isShowing: boolean, hide: () => void}) => 
    isShowing ? ReactDOM.createPortal(
        <React.Fragment>
        <div className="w-screen h-screen bg-white bg-opacity-[0.4] backdrop-blur-[3px] z-10 top-0 left-0 fixed">
            <div className="w-1/3 h-full flex items-center mx-auto">
            <div className="p-4 rounded-xl bg-swapify-gray w-full">
                <div className="flex flex-row items-center justify-between">
                <h1 className="text-3xl pb-4">
                    Choose NFT
                </h1>
                <button type="button" className="text-3xl" data-dismiss="modal" aria-label="Close" onClick={hide}>
                        <span aria-hidden="true">&times;</span>
                </button>
                </div>
                <div className="flex flex-row items-center">
                    <VNFTCard />
                </div>
                <div className="w-full">
                <button className="rounded-lg bg-gray-500 px-3 py-1" onClick={hide}>
                    Put up for swap
                </button>
                </div>
            </div>
            </div>
        </div>
        </React.Fragment>, document.body
    )
        : null;

export default Modal;