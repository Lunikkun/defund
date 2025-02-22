import React from "react";


const Footer = ()=>{
    const productList = ["Market", "ERC20 Token", "Donation"];
    const constactList = ["antoniosica0710@gmail.com", "luigifarina2003@gmail.com", "Contact Us"];
    const usefulLink = ["Home", "About Us", "Company Bio"];
    return (
        <>
            <footer className=" text-center text-white backgroundMain lg:text-left">
                <div className="mx-6 py-10 text-center md:grid-cols-2 lg:grid-cols-4">
                   <div className="grid-1 grid md:grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    <div className="">
                        <h6 className="mb-4 flex items-center justify-center font-semibold uppercase md:justify-start">
                            Defund
                        </h6>
                        <p>
                        Defund offers a secure, transparent, and intermediary-free solution for funding innovative ideas. 
                        The platform is fully decentralized, highly secure, entirely transparent, and resistant to censorship. 
                        To get started, simply connect your MetaMask account and create or support campaigns easily and directly.
                        </p>
                    </div>
                    <div className="">
                        <h6 className="mb-4 flex- justify-center font-semibold uppercase md:justify-start">
                            Products
                        </h6>
                        {productList.map((el, i)=>(
                            <p className="mb-4" key={i+1}> 
                                <a href="#!">{el}</a>
                            </p>
                        ))}
                    </div>
                    <div className="">
                        <h6 className="mb-4 flex justify-center font-semibold uppercase md:justify-start">
                            Useful Links
                        </h6>
                        {usefulLink.map((el, i)=>(
                            <p className="mb-4" key={i+1}> 
                                <a href="#!">{el}</a>
                            </p>
                        ))}
                    </div>
                    <div className="">
                        <h6 className="mb-4 flex justify-center font-semibold uppercase md:justify-start">
                            Contacts
                        </h6>
                        {constactList.map((el, i)=>(
                            <p className="mb-4" key={i+1}> 
                                <a href="#!">{el}</a>
                            </p>
                        ))}
                    </div>
                </div>
                <div>
                    <span>2025 Copyright</span>
                </div>
            </div>
            </footer> 
        </>)
}

export default Footer;