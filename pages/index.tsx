import { useState } from 'react'
import Cross from '../components/Cross'
import Footer from '../components/Footer'
import Header, { HeaderActive } from '../components/Header'
import Modal from '../components/Modal'
import NFTCard from '../components/NFTCard'
import OpenSwap from '../components/OpenSwap'
import Tick from '../components/Tick'
import useModal from '../hooks/showModal'

export default function Home() {

  const [connectedWallet, setConnectedWallet] = useState(false)
  const {isShowing, toggle} = useModal();
  
  return (
    <>
    <div className="min-h-screen">
    <Header active={HeaderActive.Swaps}/>
      {
      connectedWallet ?
      <div className="mx-4 my-8 w-full" data-aos="fade-up">
        <OpenSwap toggle={toggle}/>
        <div className="flex flex-col gap-y-6 pb-6 pt-4">
        <h1 className="text-3xl">Your open swap</h1>
        <h5>Your NFTs up for swap</h5>
        </div>
        <div className="flex flex-col gap-y-6">
          <div className="flex flex-row items-center gap-x-10">
            <NFTCard />
            <Cross />
          </div>
        </div>
        <h5 className="py-6">Your trade requests</h5>
        <div className="flex flex-col gap-y-6">
          <div className="flex flex-row items-center gap-x-10">
            <NFTCard />
            <div className="flex flex-col gap-y-4">
              <Tick />
              <Cross />
            </div>
            <NFTCard />
          </div>
        </div>
      </div>
      :
      <>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <button onClick={() => setConnectedWallet(true)} className="bg-swapify-purple px-10 text-sm font-bold py-2 rounded-full hover:bg-purple-600">Connect wallet</button>
        </div>
        <Footer />
        </>
      }
    </div>
    <Modal isShowing={isShowing} hide={toggle} />
    </>
  )
}
