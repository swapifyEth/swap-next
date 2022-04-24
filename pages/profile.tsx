import Header, { HeaderActive } from "../components/Header";
import NFTCard from "../components/NFTCard";
import Image from "next/image";
import useModal from "../hooks/showModal";

const Profile = () => {
    const {isShowing, toggle} = useModal();
return (
<>
<Header active={HeaderActive.Profile}/>
<div>
    <h1 className="text-3xl mt-20 mb-4">Profile</h1>
    <div className="flex flex-row gap-x-3 my-6">
        <img alt=""  width="32" height="32" src="/Avatar.png" />
        <p>0xjsx...fa12</p>
    </div>
    <div className="flex flex-col gap-y-6" data-aos="fade-in">
          <div className="flex flex-row items-center gap-x-10">
            {/* <NFTCard /> */}
          </div>
        </div>
</div>
</>
);
};

export default Profile;