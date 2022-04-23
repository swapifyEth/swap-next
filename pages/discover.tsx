import Header, { HeaderActive } from "../components/Header";
import NFTCard from "../components/NFTCard";
import OpenSwap from "../components/OpenSwap";

import GreenLeft from '../public/greenLeft.svg';

const Discover = () => {
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
            <OpenSwap />
          </div>
        </div>
</div>
</>
);
};

export default Discover;