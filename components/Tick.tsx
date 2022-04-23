import TickIcon from "../public/Tick.svg";

const Tick = ({ acceptSwap }) => {
    return (
        //Trigger action or something idk
        <div onClick={() => acceptSwap()} className="cursor-pointer w-fit">
            <TickIcon />
        </div>
    );
};

export default Tick;
