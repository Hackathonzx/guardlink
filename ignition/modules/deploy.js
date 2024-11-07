async function main() {
  // Get the ContractFactory and Signers here.
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy DelegateSetup contract
  const DelegateSetup = await ethers.getContractFactory("DelegateSetup");
  const delegateSetup = await DelegateSetup.deploy();
  console.log("DelegateSetup contract deployed to:", delegateSetup.target);

  // Deploy RecoveryProcess contract, passing the address of DelegateSetup contract
  const RecoveryProcess = await ethers.getContractFactory("RecoveryProcess");
  const recoveryProcess = await RecoveryProcess.deploy();
  console.log("RecoveryProcess contract deployed to:", recoveryProcess.target);

  // Deploy SecurityLayer contract, passing the address of RecoveryProcess contract
  const SecurityLayer = await ethers.getContractFactory("SecurityLayer");
  const securityLayer = await SecurityLayer.deploy();
  console.log("SecurityLayer contract deployed to:", securityLayer.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
