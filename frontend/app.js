// Contract addresses - replace with your actual contract addresses
const fundManagerAddress = "0xYourFundManagerAddress";
const validatorMultiSigAddress = "0xYourValidatorMultiSigAddress";
const developerPayoutsAddress = "0xYourDeveloperPayoutsAddress";

let fundManager, validatorMultiSig, developerPayouts;

// Initialize FundManager contract
fetch("./FundManager.json")
  .then((res) => res.json())
  .then((data) => {
    console.log(data.abi);
    if (!window.ethereum) throw new Error("MetaMask not detected!");

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    window.ethereum.request({ method: "eth_requestAccounts" });
    const signer = provider.getSigner();
    fundManager = new ethers.Contract(fundManagerAddress, data.abi, signer);
    enableFundManagerButtons();
  });

// Initialize ValidatorMultiSig contract
fetch("./ValidatorMultiSig.json")
  .then((res) => res.json())
  .then((data) => {
    console.log(data.abi);
    if (!window.ethereum) throw new Error("MetaMask not detected!");

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    window.ethereum.request({ method: "eth_requestAccounts" });
    const signer = provider.getSigner();
    validatorMultiSig = new ethers.Contract(validatorMultiSigAddress, data.abi, signer);
    enableValidatorMultiSigButtons();
  });

// Initialize DeveloperPayouts contract
fetch("./DeveloperPayouts.json")
  .then((res) => res.json())
  .then((data) => {
    console.log(data.abi);
    if (!window.ethereum) throw new Error("MetaMask not detected!");

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    window.ethereum.request({ method: "eth_requestAccounts" });
    const signer = provider.getSigner();
    developerPayouts = new ethers.Contract(developerPayoutsAddress, data.abi, signer);
    enableDeveloperPayoutsButtons();
  });

// Function to enable FundManager buttons
function enableFundManagerButtons() {
  if (fundManager) {
    document.getElementById("allocateFundsButton").removeAttribute("disabled");
    document.getElementById("reallocateFundsButton").removeAttribute("disabled");
    document.getElementById("contributeButton").removeAttribute("disabled");
  }
}

// Function to enable ValidatorMultiSig buttons
function enableValidatorMultiSigButtons() {
  if (validatorMultiSig) {
    document.getElementById("approveWorkButton").removeAttribute("disabled");
  }
}

// Function to enable DeveloperPayouts buttons
function enableDeveloperPayoutsButtons() {
  if (developerPayouts) {
    document.getElementById("selectIssueButton").removeAttribute("disabled");
    document.getElementById("submitMergeRequestButton").removeAttribute("disabled");
    document.getElementById("requestPaymentButton").removeAttribute("disabled");
  }
}

// Connect wallet function
async function connectWallet() {
  console.log("Connecting wallet...");
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const signer = provider.getSigner();
    document.getElementById("walletstatus").innerText = "Connected account: " + await signer.getAddress();
  } else {
    console.log("MetaMask not detected!");
    alert("MetaMask not detected!");
  }
}

// Contribute function
async function contribute() {
  try {
    const amount = document.getElementById("contributionAmountInput").value;
    if (!amount) throw new Error("Enter a valid amount!");

    if (!window.ethereum) throw new Error("MetaMask not detected!");

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const signer = provider.getSigner();

    // Send transaction to the FundManager contract
    const tx = await signer.sendTransaction({
      to: fundManagerAddress,
      value: ethers.utils.parseEther(amount) // Convert the amount to Wei
    });

    document.getElementById("status").innerText = `Transaction sent: ${tx.hash}`;

    // Wait for confirmation
    await tx.wait();
    document.getElementById("status").innerText = `Transaction confirmed!`;
  } catch (error) {
    document.getElementById("status").innerText = `Error: ${error.message}`;
  }
}

// Allocate funds function
async function allocateFunds() {
  try {
    const issueId = document.getElementById("issueIdInput").value;
    const amount = document.getElementById("amountInput").value;
    if (!issueId || !amount) throw new Error("Enter valid issue ID and amount!");

    // Send transaction using the FundManager contract
    const tx = await fundManager.allocateFunds(issueId, amount);
    document.getElementById("status").innerText = `Transaction sent: ${tx.hash}`;

    // Wait for confirmation
    await tx.wait();
    document.getElementById("status").innerText = `Transaction confirmed!`;
  } catch (error) {
    document.getElementById("status").innerText = `Error: ${error.message}`;
  }
}

// Reallocate funds function
async function reallocateFunds() {
  try {
    const fromIssueId = document.getElementById("fromIssueIdInput").value;
    const toIssueId = document.getElementById("toIssueIdInput").value;
    const amount = document.getElementById("amountInput").value;
    if (!fromIssueId || !toIssueId || !amount) throw new Error("Enter valid issue IDs and amount!");

    // Send transaction using the FundManager contract
    const tx = await fundManager.reallocateFunds(fromIssueId, toIssueId, amount);
    document.getElementById("status").innerText = `Transaction sent: ${tx.hash}`;

    // Wait for confirmation
    await tx.wait();
    document.getElementById("status").innerText = `Transaction confirmed!`;
  } catch (error) {
    document.getElementById("status").innerText = `Error: ${error.message}`;
  }
}

// Approve work function
async function approveWork() {
  try {
    const mergeRequest = document.getElementById("mergeRequestInput").value;
    if (!mergeRequest) throw new Error("Enter a valid merge request ID!");

    // Send transaction using the ValidatorMultiSig contract
    const tx = await validatorMultiSig.approveWork(mergeRequest);
    document.getElementById("status").innerText = `Transaction sent: ${tx.hash}`;

    // Wait for confirmation
    await tx.wait();
    document.getElementById("status").innerText = `Transaction confirmed!`;
  } catch (error) {
    document.getElementById("status").innerText = `Error: ${error.message}`;
  }
}

// Select issue function
async function selectIssue() {
  try {
    const issueId = document.getElementById("issueIdInput").value;
    if (!issueId) throw new Error("Enter a valid issue ID!");

    // Send transaction using the DeveloperPayouts contract
    const tx = await developerPayouts.selectIssue(issueId);
    document.getElementById("status").innerText = `Transaction sent: ${tx.hash}`;

    // Wait for confirmation
    await tx.wait();
    document.getElementById("status").innerText = `Transaction confirmed!`;
  } catch (error) {
    document.getElementById("status").innerText = `Error: ${error.message}`;
  }
}

// Submit merge request function
async function submitMergeRequest() {
  try {
    const mergeRequest = document.getElementById("mergeRequestInput").value;
    const issueId = document.getElementById("issueIdInput").value;
    if (!mergeRequest || !issueId) throw new Error("Enter valid merge request ID and issue ID!");

    // Send transaction using the DeveloperPayouts contract
    const tx = await developerPayouts.submitMergeRequest(mergeRequest, issueId);
    document.getElementById("status").innerText = `Transaction sent: ${tx.hash}`;

    // Wait for confirmation
    await tx.wait();
    document.getElementById("status").innerText = `Transaction confirmed!`;
  } catch (error) {
    document.getElementById("status").innerText = `Error: ${error.message}`;
  }
}

// Request payment function
async function requestPayment() {
  try {
    const mergeRequest = document.getElementById("mergeRequestInput").value;
    if (!mergeRequest) throw new Error("Enter a valid merge request ID!");

    // Send transaction using the DeveloperPayouts contract
    const tx = await developerPayouts.requestPayment(mergeRequest);
    document.getElementById("status").innerText = `Transaction sent: ${tx.hash}`;

    // Wait for confirmation
    await tx.wait();
    document.getElementById("status").innerText = `Transaction confirmed!`;
  } catch (error) {
    document.getElementById("status").innerText = `Error: ${error.message}`;
  }
}

// Attach event listeners to buttons
document.getElementById("contributeButton").addEventListener("click", contribute);
document.getElementById("allocateFundsButton").addEventListener("click", allocateFunds);
document.getElementById("reallocateFundsButton").addEventListener("click", reallocateFunds);
document.getElementById("approveWorkButton").addEventListener("click", approveWork);
document.getElementById("selectIssueButton").addEventListener("click", selectIssue);
document.getElementById("submitMergeRequestButton").addEventListener("click", submitMergeRequest);
document.getElementById("requestPaymentButton").addEventListener("click", requestPayment);
document.getElementById("connectWallet").addEventListener("click", connectWallet);
