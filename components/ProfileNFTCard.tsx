import clsx from "clsx";

const ProfileNFTCard = ({ image, name }) => {
    console.log(image);
    return (
        <div className={clsx("flex flex-col w-32 cursor-pointer")}>
            <div className="bg-swapify-purple h-32 w-full relative rounded-lg">
                <img
                    src={image}
                    alt=""
                    className="rounded-lg"
                />
            </div>
            <div>
                <h1>{name}</h1>
            </div>
        </div>
    );
};

export default ProfileNFTCard;
