import Header, { HeaderActive } from "../components/Header";

const Profile = () => {
return (
<>
<Header active={HeaderActive.Profile}/>
<div>
    <h1>Profile</h1>
</div>
</>
);
};

export default Profile;