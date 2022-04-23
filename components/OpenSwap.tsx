import React, { useEffect, useState } from "react";

const axios = require("axios").default;

const OpenSwap = ({ toggle }) => {
    return (
        <div
            onClick={toggle}
            className="rounded-xl flex w-fit flex-row items-center hover:bg-gray-900 bg-swapify-gray gap-x-6 text-3xl pr-6 cursor-pointer"
        >
            <div className="bg-swapify-purple h-full flex items-center rounded-l-xl p-12 text-5xl">
                <h1>+</h1>
            </div>
            <h1>Create a new swap</h1>
        </div>
    );
};

export default OpenSwap;
