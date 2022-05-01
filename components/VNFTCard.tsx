import clsx from "clsx";
// import Image from 'next/image';
const VNFTCard = ({ active, image, name, onApprove }) => {
    console.log(image);
    return (
        <div
            onClick={onApprove}
            className={clsx(
                "flex flex-col w-32 cursor-pointer",
                active && "border-4 border-green-400 p-1 rounded-xl"
            )}
        >   
            <div className="bg-swapify-purple h-32 w-full relative rounded-lg">
                {/* Image goes here */}

                <img src={image} alt="" className="rounded-lg" />
            </div>
            <div>
                <h1>{name}</h1>
            </div>
        </div>
    );
};

export default VNFTCard;
