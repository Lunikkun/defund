/*
import React, { useState, useEffect, createContext } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";

// Importa le costanti necessarie
import { 
  CrowdFundingAddress, 
  CrowdFundingABI,
  TokenABI,
  TokenAddress 
} from "./contants";

// Funzione per ottenere un'istanza del contratto di crowdfunding
const fetchContract = (signerOrProvider) =>
  new ethers.Contract(CrowdFundingAddress, CrowdFundingABI, signerOrProvider);

// Funzione per ottenere un'istanza del contratto del token custom (ERC-20)
const fetchTokenContract = (signerOrProvider) =>
  new ethers.Contract(TokenAddress, TokenABI, signerOrProvider);

export const CrowdFundingContext = createContext();

export const CrowdFundingProvider = ({ children }) => {
  const titleData = "Crowd Funding Contract";
  const [currentAccount, setCurrentAccount] = useState("");

  // FUNZIONE: Connessione al wallet
  const connectWallet = async () => {
    if (!window.ethereum) return console.log("Install MetaMask!");
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error("Error while connecting to wallet", error);
    }
  };

  // FUNZIONE: Controlla se il wallet è connesso
  const checkIfWalletConnected = async () => {
    if (!window.ethereum) return console.log("Install MetaMask!");
    try {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
      } else {
        console.log("No account found");
      }
    } catch (error) {
      console.error("Error checking wallet connection", error);
    }
  };

  useEffect(() => {
    checkIfWalletConnected();
  }, []);

  // FUNZIONE: Crea una nuova campagna
  // L'importo (target) viene considerato in token (assumiamo 18 decimali)
  const createCampaign = async (campaign) => {
    try {
      const { title, description, amount, deadline } = campaign;
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);
      
      const tokenAmount = ethers.utils.parseUnits(amount, "ether");
      const tokenContract = fetchTokenContract(signer);
      const approveTx = await tokenContract.approve(CrowdFundingAddress, tokenAmount);
      await approveTx.wait();
      console.log("Token approved for donation");

      // Converte l'importo del target in unità di token (18 decimali)


      const transaction = await contract.createCampaign(
        currentAccount,
        title,
        description,
        tokenAmount,
        new Date(deadline).getTime()
      );
      await transaction.wait();
      console.log("Campaign created successfully", transaction);
    } catch (error) {
      console.error("Error creating campaign", error);
    }
  };

  // FUNZIONE: Dona utilizzando il token custom
  const donate = async (pId, amount) => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      // Converte l'importo della donazione in unità di token (18 decimali)
      const tokenAmount = ethers.utils.parseUnits(amount, "ether");

      // 1. Approva il trasferimento dei token al contratto di crowdfunding
      const tokenContract = fetchTokenContract(signer);
      const approveTx = await tokenContract.approve(CrowdFundingAddress, tokenAmount);
      await approveTx.wait();
      console.log("Token approved for donation");

      // 2. Chiama la funzione di donazione sul contratto di crowdfunding
      const contract = fetchContract(signer);
      const donateTx = await contract.donateToCampaign(pId, tokenAmount);
      await donateTx.wait();
      console.log("Donation successful", donateTx);
    } catch (error) {
      console.error("Error donating", error);
    }
  };

  // FUNZIONE: Recupera tutte le campagne (lettura dalla blockchain)
  const getCampaigns = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider();
      const contract = fetchContract(provider);
      const campaigns = await contract.getCampaigns();

      const parsedCampaigns = campaigns.map((campaign, i) => ({
        owner: campaign.owner,
        title: campaign.title,
        description: campaign.description,
        target: ethers.utils.formatUnits(campaign.target, "ether"),
        // Se il campo deadline è un BigNumber, usiamo toNumber()
        deadline: campaign.deadline.toNumber ? campaign.deadline.toNumber() : campaign.deadline,
        amountCollected: ethers.utils.formatUnits(campaign.amountCollected, "ether"),
        pId: i,
      }));
      return parsedCampaigns;
    } catch (error) {
      console.error("Error fetching campaigns", error);
    }
  };

  // FUNZIONE: Recupera le campagne create dall'utente corrente
  const getUserCampaigns = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider();
      const contract = fetchContract(provider);
      const allCampaigns = await contract.getCampaigns();

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      const currentUser = accounts[0];

      const filteredCampaigns = allCampaigns.filter(
        (campaign) => campaign.owner.toLowerCase() === currentUser.toLowerCase()
      );

      const userData = filteredCampaigns.map((campaign, i) => ({
        owner: campaign.owner,
        title: campaign.title,
        description: campaign.description,
        target: ethers.utils.formatUnits(campaign.target, "ether"),
        deadline: campaign.deadline.toNumber ? campaign.deadline.toNumber() : campaign.deadline,
        amountCollected: ethers.utils.formatUnits(campaign.amountCollected, "ether"),
        pId: i,
      }));

      return userData;
    } catch (error) {
      console.error("Error fetching user campaigns", error);
    }
  };

  // FUNZIONE: Recupera le donazioni per una specifica campagna
  const getDonations = async (pId) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider();
      const contract = fetchContract(provider);
      const donationsData = await contract.getDonators(pId);
      const numberOfDonations = donationsData[0].length;
      const parsedDonations = [];

      for (let i = 0; i < numberOfDonations; i++) {
        parsedDonations.push({
          donator: donationsData[0][i],
          donation: ethers.utils.formatUnits(donationsData[1][i], "ether"),
        });
      }
      return parsedDonations;
    } catch (error) {
      console.error("Error fetching donations", error);
    }
  };

  return (
    <CrowdFundingContext.Provider
      value={{
        titleData,
        currentAccount,
        connectWallet,
        createCampaign,
        donate,
        getCampaigns,
        getUserCampaigns,
        getDonations,
      }}
    >
      {children}
    </CrowdFundingContext.Provider>
  );
};



*/



import React, {useState, useEffect, Children, use} from "react";
import Web3Modal from "web3modal"
import { ethers } from "ethers";
import { BigNumber } from 'ethers';

import { CrowdFundingAddress, CrowdFundingABI, RPCProvider } from "./contants";
//import { transform } from "next/dist/build/swc/generated-native";

const fetchContract = (signerOrProvider) =>
    new ethers.Contract(CrowdFundingAddress, CrowdFundingABI, signerOrProvider);
    console.log("ABI:"+ CrowdFundingABI+ " ADDR: "+CrowdFundingAddress);

export const CrowdFundingContext = React.createContext();

export const CrowdFundingProvider = ({children})=>{
    const titleData = "Crowd Funding Contract";
    const [currentAccount, setCurrentAccount] = useState("")

    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        setCurrentAccount(accounts[0]);
      } else {
        setCurrentAccount(null);
      }
    };
    useEffect(() => {
      if (window.ethereum) {
        window.ethereum
          .request({ method: 'eth_accounts' })
          .then(handleAccountsChanged)
          .catch((err) => {
            console.error('Errore nel recupero degli account:', err);
          });
  
        window.ethereum.on('accountsChanged', handleAccountsChanged);
  
        return () => {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        };
      } else {
        console.log('MetaMask non è installato');
      }
    }, []);
    
    
    const createCampaign = async (campaign) => {
      console.log("CAMPAGNAAAAA "+JSON.stringify(campaign))
         const {title, description, amount, deadline} = campaign;
         const web3Modal = new Web3Modal();
         const connection = await web3Modal.connect();
         const provider = new ethers.providers.Web3Provider(connection);
         const signer = provider.getSigner();
         const contract = fetchContract(signer);

         contract.on("DeadlineCheck", (deadline, currentBlockTimestamp) => {
          console.log("Deadline:", deadline.toString());
          console.log("Current Block Timestamp:", currentBlockTimestamp.toString());
        });

        
         //console.log(currentAccount+title+description+ethers.utils.parseUnits(amount, 18));
        const dateInSeconds = Math.floor(new Date(deadline).getTime()/1000)
         try{       
              const transaction = await contract.createCampaign(
                    currentAccount,
                    title,
                    description,
                    ethers.utils.parseUnits(amount,18),
                    dateInSeconds
                );
            //console.log(transaction)
             const info = await transaction.wait();
             console.log("INFO: ",info);
        }catch (error) { console.log("contract call faliure", error); }   
    }

    const getCampaigns = async () => {
      console.log('aaa');
      const provider = new ethers.providers.JsonRpcProvider(RPCProvider);
      const contract = fetchContract(provider);
  
      // Ottieni i dati delle campagne
      const [addresses, titles, descriptions, targets, gottenTillNow, deadlines]= await contract.getCampaigns();
  
      // Combina i dati in un array di oggetti
      const campaigns = addresses.map((address, i) => ({
          owner: address,
          title: titles[i],
          description: descriptions[i], // Assumendo che 'description' sia uguale a 'title'
          target: ethers.utils.formatEther(BigNumber.from(targets[i])),
          deadline: (deadlines[i].toNumber()*1000),
          amountCollected: ethers.utils.formatEther(BigNumber.from(gottenTillNow[i])), // Assumendo che 'amountCollected' sia uguale a 'target'
          pId: i,
      }));
  
      console.log(campaigns);
      return campaigns;
  };
  
    const getUserCampaigns = async() =>{
       console.log('bbb')
        const provider = new ethers.providers.JsonRpcProvider(RPCProvider);
        const contract = fetchContract(provider);

        const [addresses, titles, descriptions, targets, gottenTillNow, deadlines] = await contract.getCampaigns();
  
        // Combina i dati in un array di oggetti
        const allCampaigns = addresses.map((address, i) => ({
            owner: address,
            title: titles[i],
            description: descriptions[i],
            target: ethers.utils.formatEther(BigNumber.from(targets[i])),
            deadline: (deadlines[i].toNumber()*1000),
            amountCollected: ethers.utils.formatEther(BigNumber.from(gottenTillNow[i])), // Assumendo che 'amountCollected' sia uguale a 'target'
            pId: i,
        }));

        const accounts = await window.ethereum.request({
            method: "eth_accounts",
        })
        const currentUser = accounts[0];
        console.log("address conflict: USER CURRENT",currentAccount, " DATA", allCampaigns)
        const filteredCampaigns = allCampaigns.filter(
            (campaign) =>
                //campaign.owner === "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
                campaign.owner.toLowerCase() === currentUser 
        );
        console.log("filtered USER CURRENT",currentAccount, " DATA", filteredCampaigns)
        return filteredCampaigns; //userData
    }

    const donate = async (pId, amount) => {
        const web3Modal = new Web3Modal();
         const connection = await web3Modal.connect();
         const provider = new ethers.providers.Web3Provider(connection);
         const signer = provider.getSigner();
         const contract = fetchContract(signer);
        
         const campaignData = await contract.donateToCampaign(pId, {
            value: ethers.utils.parseEther(amount),
         });

         await campaignData.wait();
         location.reload();

         return campaignData;
    }

    const getDonations = async(pId) =>{
        const provider = new ethers.providers.JsonRpcProvider(RPCProvider);
        const contract = fetchContract(provider);
        console.log("DONAZIONE")
        const donations = await contract.getDonators(pId);
        const numberOfDonations = donations[0].length;
        const parsedDonations = [];

        for(let i = 0; i< numberOfDonations; i++){
            parsedDonations.push({
                donator: donations[0][i],
                donation: ethers.utils.formatEther(donations[1][i])
            });
        }
        
        return parsedDonations;
    }

    const checkIfWalletConnected = async() => {
        try {
            if (!window.ethereum)
                return setOpenError(true), setError("Install Metamask!");
            
        const accounts = await window.ethereum.request({
            method: "eth_accounts",
        });

        if (accounts.length) {
            setCurrentAccount(accounts[0]);
            console.log("Successfully Connected")
        } else {
            console.log("No Account found!");
        }
        } catch (error) {
            console.log("Somethingg went wrong while connecting to wallet");
        }
        
    };
    
    useEffect(()=>{
        checkIfWalletConnected();
    }, [currentAccount]);
    
    const connectWallet = async () =>{
        try{
            if(!window.ethereum) return console.log("Install MetaMask!");
            
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            setCurrentAccount(accounts[0])
        }catch(error){ console.log("Error while connecting to wallet");}
    }


    return(
        <CrowdFundingContext.Provider value={{
            titleData,
            currentAccount,
            setCurrentAccount,
            createCampaign,
            getCampaigns,
            getUserCampaigns,
            donate,
            getDonations,
            connectWallet,
        }} 
        >
        {children}
        </CrowdFundingContext.Provider>
    )
}
