import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import Header, { HeaderActive } from '../components/Header'
import OpenSwap from '../components/OpenSwap'

export default function Home() {

  const [connectedWallet, setConnectedWallet] = useState(false)

  
  return (
    <>
    <Header active={HeaderActive.Swaps}/>
      {
      connectedWallet ?
      <div className="mx-4 my-8 w-full">
        <OpenSwap />
      </div>
      :
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <button onClick={() => setConnectedWallet(true)} className="bg-swapify-purple px-10 text-sm font-bold py-2 rounded-full hover:bg-purple-600">Connect wallet</button>
        </div>
      }
    </>
  )
}
