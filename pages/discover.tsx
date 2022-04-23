import Header, { HeaderActive } from "../components/Header";
import Modal from "../components/Modal";
import NFTCard from "../components/NFTCard";
import OpenSwap from "../components/OpenSwap";
import useModal from "../hooks/showModal";

import GreenLeft from '../public/greenLeft.svg';

const Discover = () => {

    const {isShowing, toggle} = useModal();
return (
<>
<Header active={HeaderActive.Discover}/>
<div>
    <h1 className="text-3xl mt-20 mb-4">Discover</h1>
    <div className="flex flex-col gap-y-6" data-aos="fade-in">
          <div className="flex flex-row items-center gap-x-10">
            <NFTCard />
            <div className="flex flex-col gap-y-4">
                <GreenLeft />
            </div>
            <OpenSwap toggle={toggle}/>
          </div>
        </div>
</div>
<Modal isShowing={isShowing} hide={toggle} />
</>
);
};

export default Discover;