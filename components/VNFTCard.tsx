import clsx from "clsx";

const VNFTCard = ({ active, image, name, onApprove }) => {
    return (
        <div
            onClick={onApprove}
            className={clsx(
                "flex flex-col w-32 cursor-pointer",
                active && "border-4 border-green-400 p-1 rounded-xl"
            )}
        >
            <div className="bg-swapify-purple h-32 w-full">
                {/* Image goes here */}
            </div>
            <div>
                <h1>{name}</h1>
            </div>
        </div>
    );
};

export default VNFTCard;
