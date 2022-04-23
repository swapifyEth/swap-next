import clsx from "clsx";
import Link from "next/link";
import Logo from '../public/logo.svg'
import Twitter from '../public/twitter.svg'
import Medium from '../public/medium.svg'

export enum HeaderActive {
    Swaps,
    Discover,
    Profile
}

const Header = ({active} : {active: HeaderActive}) => {

const classes = {
    link: "h-full pt-3 text-gray-400 text-sm font-light hover:text-gray-300 cursor-pointer",
    linkActive: "text-white border-b-2 font-semibold border-swapify-purple",
}

return (
<header className="bg-swapify-gray w-full flex flex-row items-center justify-between px-4 h-12">
    <div>
        <Logo />
    </div>
    <div className="flex flex-row items-center gap-x-32 h-full">
        <Link passHref href="/"><h3 className={clsx(classes.link, active == HeaderActive.Swaps && classes.linkActive)}>Swaps</h3></Link>
        <Link passHref href="/discover"><h3 className={clsx(classes.link, active == HeaderActive.Discover && classes.linkActive)}>Discover</h3></Link>
        <Link passHref href="/profile"><h3 className={clsx(classes.link, active == HeaderActive.Profile && classes.linkActive)}>Profile</h3></Link>
    </div>
    <div>
    </div>
</header>
);
};

export default Header;