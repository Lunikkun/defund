import React, { useEffect, useContext, useState } from "react";
import { CrowdFundingContext } from "@/Context/CrowdFunding";
import { Hero, Card, PopUp } from "../Components";

const Index = () => {
  const {
    titleData,
    currentAccount,
    createCampaign,
    getCampaigns,
    getUserCampaigns,
    donate,
    getDonations,
  } = useContext(CrowdFundingContext);

  const [allcampaign, setAllcampaign] = useState([]);
  const [usercampaign, setUsercampaign] = useState([]);
  
  useEffect(() => {
    // Dichiarazione della funzione asincrona all'interno di useEffect
    const fetchCampaignsData = async () => {
      try {
        const allData = await getCampaigns();
        const userData = await getUserCampaigns();
        //console.log("alldata:", allData);
        setAllcampaign(allData);
        setUsercampaign(userData);
      } catch (error) {
        console.error("Errore nel recupero delle campagne:", error);
      }
    };

    if (currentAccount) {
      fetchCampaignsData();
    }
  }, [getCampaigns, getUserCampaigns, currentAccount]);

  // DONATE POPUP MODEL
  const [openModel, setOpenModel] = useState(false);
  const [donateCampaign, setDonateCampaign] = useState();

  //console.log(donateCampaign);

  return (
    <>
      <Hero titleData={titleData} createCampaign={createCampaign} />
      <Card
        title="All Listed Campaigns"
        allcampaign={allcampaign}
        setOpenModel={setOpenModel}
        setDonate={setDonateCampaign}
      />
      <Card
        title="Your Created Campaigns"
        allcampaign={usercampaign}
        setOpenModel={setOpenModel}
        setDonate={setDonateCampaign}
      />
      {openModel && (
        <PopUp 
          setOpenModel={setOpenModel}
          getDonations={getDonations}
          donate={donateCampaign}
          donateFunction={donate}
        />
      )}
    </>
  );
};

export default Index;
