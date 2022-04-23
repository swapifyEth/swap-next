import Image from "next/image";

const NFTCard = () => {
return (
<div className="rounded-xl flex flex-row items-center bg-swapify-gray gap-x-6 text-3xl w-1/3 h-48">
    <div className="bg-swapify-purple h-full w-48 rounded-l-xl">
    </div>
    <div className="flex flex-col gap-y-4 py-4 pr-4">
    <h1>
        RTFKT #1023
    </h1>
    <h3 className="text-gray-400">
        RTFKT
    </h3>
    <div className="bg-white rounded-full py-2 px-1 flex flex-row item-center gap-x-6 cursor-pointer">
        <Image alt=""  width="32" height="32" src="/Avatar.png" />
        <p className="text-black text-sm pt-1">0xjsx...fa12</p>
    </div>
    </div>
</div>
);
};

export default NFTCard;