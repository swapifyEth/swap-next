import Polygon from '../public/polygon.svg';

const Footer = () => {
return (
<div className="bg-swapify-gray flex flex-row w-full py-4 items-center justify-between fixed bottom-0 left-0">
    <div className="flex flex-row items-center gap-x-2 pl-4">
        <h2>Designed with Finity Design System</h2>
        <Polygon />
    </div>
    <h2 className="pr-4">© 2022 swapify</h2>
</div>
);
};

export default Footer;