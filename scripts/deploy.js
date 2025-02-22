async function main() {

  //token deploy
  //const Token = await hre.ethers.getContractFactory("HardHatETH", "HETH");
  //const initialSupply = ethers.utils.parseUnits("1000000", 18); // 1.000.000 token con 18 decimali
  //const token = await Token.deploy(initialSupply);
  //await token.deployed();
  //console.log("Token distribuito all'indirizzo:", token.address);

  ////0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
  const CrowdFunding = await hre.ethers.getContractFactory("CrowdFunding");
  const crowdfunding = await CrowdFunding.deploy();

  await crowdfunding.deployed();
  
  
  console.log(
     `CrowdFunding deployed to ${crowdfunding.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
