import { creatPortal } from "react-dom";
import ReactDOM from "react-dom";
import React, { useEffect, useState } from "react";
import VNFTCard from "./VNFTCard";
import { Formik, Form, Field } from "formik";
import axios from "axios";
import clsx from "clsx";

const Modal = ({
    isShowing,
    hide,
    createSwap,
    approveNft,
    approvedNft,
    approved,
    address,
    txLoad,
    swapId,
    initialized
}) => {
    const [selected, setSelected] = React.useState([false, false, false]);
    const [loading, setLoading] = React.useState(false);
    //Load wallet nfts
    const [nfts, setNfts] = useState([]);

    console.log(address);

    useEffect(() => {
        (async () => {
            try {
                const result = await axios.get(
                    `https://eth-rinkeby.alchemyapi.io/v2/demo/getNFTs/nBdRx9b77E3p9TU4Vte09EYfuUGisD1Z?owner=${address}`
                );

                console.log(result);

                if (result?.data?.ownedNfts?.length > 0) {
                    setNfts(result?.data?.ownedNfts.splice(0, 3));
                    console.log(nfts);
                }
            } catch (err) {
                console.error(err);
            }
        })();
    }, [address]);

    return isShowing
        ? ReactDOM.createPortal(
              <React.Fragment>
                  <div
                      className="w-screen h-screen bg-white bg-opacity-[0.4] backdrop-blur-[3px] z-10 top-0 left-0 fixed"
                      data-aos="fade-in"
                  >
                      <div className="w-1/3 h-full flex items-center mx-auto">
                          <div
                              className={clsx(
                                  "p-4 rounded-xl bg-swapify-gray w-full"
                              )}
                          >
                              <div className="flex flex-row items-center justify-between">
                                  <h1 className="text-3xl pb-4">
                                      Choose NFT (S)
                                  </h1>
                                  <button
                                      type="button"
                                      className="text-3xl"
                                      data-dismiss="modal"
                                      aria-label="Close"
                                      onClick={hide}
                                  >
                                      <span aria-hidden="true">&times;</span>
                                  </button>
                              </div>
                              <Formik
                                  initialValues={{
                                      nfts: selected,
                                      description: "",
                                  }}
                                  onSubmit={(values, { setSubmitting }) => {
                                      setTimeout(() => {
                                          if (swapId) {
                                              createSwap(swapId);
                                          } else {
                                              createSwap(values.description);
                                          }
                                          setSubmitting(false);
                                          hide();
                                      }, 400);
                                  }}
                              >
                                  {({ isSubmitting }) => (
                                      <Form className="flex flex-col gap-y-6">
                                          <div className="flex flex-row gap-x-3 mx-auto items-center">
                                              {nfts.map((nft, index) => (
                                                  <VNFTCard
                                                      key={index}
                                                      active={
                                                          approvedNft?.tokenId ==
                                                          nft?.id?.tokenId
                                                              ? true
                                                              : false
                                                      }
                                                      name={nft?.metadata?.name}
                                                      onApprove={async () => {
                                                          setLoading(true);
                                                          approveNft(
                                                              nft?.contract
                                                                  ?.address,
                                                              nft?.id?.tokenId
                                                          );
                                                          setLoading(false);
                                                      }}
                                                      image={
                                                          nft?.metadata?.image
                                                      }
                                                  />
                                              ))}
                                          </div>
                                          {initialized && (
                                              <>
                                                  <label>Description</label>
                                                  <Field
                                                      type="text"
                                                      className="pl-1 mr-6 mb-4 rounded py-1 text-black"
                                                      name="description"
                                                      placeholder="I am looking for..."
                                                  />
                                              </>
                                          )}
                                          {approved && (
                                              <div className="w-full">
                                                  <button
                                                      type="submit"
                                                      className="rounded-lg bg-gray-500 hover:bg-gray-300 px-3 py-1"
                                                  >
                                                      Put up for swap
                                                  </button>
                                              </div>
                                          )}
                                      </Form>
                                  )}
                              </Formik>
                          </div>
                      </div>
                  </div>
              </React.Fragment>,
              document.body
          )
        : null;
};

export default Modal;
