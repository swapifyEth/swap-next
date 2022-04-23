import {creatPortal} from 'react-dom';
import ReactDOM from 'react-dom';
import React from 'react';
import VNFTCard from './VNFTCard';
import { Formik, Form, Field } from 'formik';

const Modal = ({isShowing, hide} : {isShowing: boolean, hide: () => void}) => {
    const [selected, setSelected] = React.useState([false,false,false]);
    return (
        isShowing ? ReactDOM.createPortal(
            <React.Fragment>
            <div className="w-screen h-screen bg-white bg-opacity-[0.4] backdrop-blur-[3px] z-10 top-0 left-0 fixed" data-aos="fade-in">
                <div className="w-1/3 h-full flex items-center mx-auto">
                <div className="p-4 rounded-xl bg-swapify-gray w-full">
                    <div className="flex flex-row items-center justify-between">
                    <h1 className="text-3xl pb-4">
                        Choose NFT (S)
                    </h1>
                    <button type="button" className="text-3xl" data-dismiss="modal" aria-label="Close" onClick={hide}>
                            <span aria-hidden="true">&times;</span>
                    </button>
                    </div>
                    <Formik
                        initialValues={{
                            nfts: [],
                            description: ""
                        }}
                        onSubmit={(values, { setSubmitting }) => {
                            setTimeout(() => {
                                alert(JSON.stringify(values, null, 2));
                                setSubmitting(false);
                            }, 400);
                        }}
                    >
                        {({ isSubmitting }) => (
                            <Form className="flex flex-col gap-y-6">
                                <div className="flex flex-row gap-x-3 mx-auto items-center">
                                    <div onClick={() => setSelected([!selected[0], selected[1], selected[2]])}>
                                    <VNFTCard active={selected[0]}/>
                                    </div>
                                    <div onClick={() => setSelected([selected[0], !selected[1], selected[2]])}>
                                    <VNFTCard active={selected[1]}/>
                                    </div>
                                    <div onClick={() => setSelected([selected[0], selected[1], !selected[2]])}>
                                    <VNFTCard active={selected[2]}/>
                                    </div>
                                </div>
                                <label>Description</label>
                                <Field type="text"  className="pl-1 mr-6 mb-4 rounded py-1 text-black" name="description" placeholder="I am looking for..."/>
                            </Form>
                        )}
                    </Formik>
                    <div className="w-full">
                    <button className="rounded-lg bg-gray-500 hover:bg-gray-300 px-3 py-1" onClick={hide}>
                        Put up for swap
                    </button>
                    </div>
                </div>
                </div>
            </div>
            </React.Fragment>, document.body
        ) : null
    )
}

export default Modal;