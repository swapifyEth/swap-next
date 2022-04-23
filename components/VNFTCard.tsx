import clsx from "clsx";

const VNFTCard = ({active} : {active: boolean}) => {
return (
<div className={clsx("flex flex-col w-32 cursor-pointer", active && "border-4 border-green-400 p-1 rounded-xl")}>
    <div className="bg-swapify-purple h-32 w-full">
        {/* Image goes here */}
    </div>
    <div>
        <h1>RTFKT #1023</h1>
        <p>RTFKT</p>
    </div>
</div>
);
};

export default VNFTCard;