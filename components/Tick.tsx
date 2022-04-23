import TickIcon from "../public/Tick.svg";

<<<<<<< HEAD
const Tick = ({ acceptSwap }) => {
    return (
        //Trigger action or something idk
        <div onClick={() => acceptSwap()} className="cursor-pointer w-fit">
            <TickIcon />
        </div>
    );
=======
const Tick = ({accept}) => {
return (
    //Trigger action or something idk
    <div className="cursor-pointer w-fit">
    <TickIcon/>
    </div>
);
>>>>>>> 0602b9b0971646857b7cbb3d30d4e5b0e1ff0915
};

export default Tick;
