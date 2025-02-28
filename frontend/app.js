// Contract addresses - replace with your actual contract addresses
const fundManagerAddress = "0x2b8B0BFaB44238a6B4eAD0aB1f5015F4a4B5D246";
const validatorMultiSigAddress = "0xFFAa3bfC5f619433bf8F59e400DD717601f71822";
const developerPayoutsAddress = "0xc755B65fd5bcaD1D0EBaff64eADA551144D8fD38";

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
    validatorMultiSig = new ethers.Contract(
      validatorMultiSigAddress,
      data.abi,
      signer
    );
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
    developerPayouts = new ethers.Contract(
      developerPayoutsAddress,
      data.abi,
      signer
    );
    enableDeveloperPayoutsButtons();
  });

// Function to enable FundManager buttons
function enableFundManagerButtons() {
  if (fundManager) {
    document.getElementById("allocateFundsButton").removeAttribute("disabled");
    document
      .getElementById("reallocateFundsButton")
      .removeAttribute("disabled");
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
    document
      .getElementById("submitMergeRequestButton")
      .removeAttribute("disabled");
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
    document.getElementById("walletstatus").innerText =
      "Connected account: " + (await signer.getAddress());
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
      value: ethers.utils.parseEther(amount), // Convert the amount to Wei
    });

    document.getElementById(
      "status"
    ).innerText = `Transaction sent: ${tx.hash}`;

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
    if (!issueId || !amount)
      throw new Error("Enter valid issue ID and amount!");

    // Send transaction using the FundManager contract
    const tx = await fundManager.allocateFunds(issueId, amount);
    document.getElementById(
      "status"
    ).innerText = `Transaction sent: ${tx.hash}`;

    // Wait for confirmation
    await tx.wait();
    document.getElementById("status").innerText = `Transaction confirmed!`;
  } catch (error) {
    document.getElementById("status").innerText = `Error: ${error.message}`;
  }
}

// Reallocates funds from one issue to another
async function reallocateFunds() {
  try {
    const fromIssueId = document.getElementById("fromIssueIdInput").value;
    const toIssueId = document.getElementById("toIssueIdInput").value;
    const amount = document.getElementById("amountInput").value;
    if (!fromIssueId || !toIssueId || !amount)
      throw new Error("Enter valid issue IDs and amount!");

    // Fetch open issues
    const openIssues = await fetchOpenIssues();
    const fromIssueExists = openIssues.some((issue) => issue.id == fromIssueId);
    const toIssueExists = openIssues.some((issue) => issue.id == toIssueId);

    if (!fromIssueExists)
      throw new Error("From issue ID not found in open issues!");
    if (!toIssueExists)
      throw new Error("To issue ID not found in open issues!");

    // Send transaction using the FundManager contract
    const tx = await fundManager.reallocateFunds(
      fromIssueId,
      toIssueId,
      amount
    );
    document.getElementById(
      "status"
    ).innerText = `Transaction sent: ${tx.hash}`;

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
    document.getElementById(
      "status"
    ).innerText = `Transaction sent: ${tx.hash}`;

    // Wait for confirmation
    await tx.wait();
    document.getElementById("status").innerText = `Transaction confirmed!`;
  } catch (error) {
    document.getElementById("status").innerText = `Error: ${error.message}`;
  }
}

// Selects a funded issue
async function selectIssue() {
  try {
    const issueId = document.getElementById("issueIdInput").value;
    if (!issueId) throw new Error("Enter a valid issue ID!");

    // Fetch open issues
    const openIssues = await fetchOpenIssues();
    const issueExists = openIssues.some((issue) => issue.id == issueId);

    if (!issueExists) throw new Error("Issue ID not found in open issues!");

    // Send transaction using the DeveloperPayouts contract
    const tx = await developerPayouts.selectIssue(issueId);
    document.getElementById(
      "status"
    ).innerText = `Transaction sent: ${tx.hash}`;

    // Wait for confirmation
    await tx.wait();
    document.getElementById("status").innerText = `Transaction confirmed!`;
  } catch (error) {
    document.getElementById("status").innerText = `Error: ${error.message}`;
  }
}

async function submitMergeRequest() {
  try {
    const mergeRequest = document.getElementById("mergeRequestInput").value;
    const issueId = document.getElementById("issueIdInput").value;
    const expectedAuthorUsername = "developer_username"; // Replace with the expected author's username

    if (!mergeRequest || !issueId)
      throw new Error("Enter valid merge request ID and issue ID!");

    // Check if the merge request exists
    const mergeRequestExists = await checkMergeRequestExists(mergeRequest);
    if (!mergeRequestExists) throw new Error("Merge request does not exist!");

    // Verify the merge request author
    const authorVerified = await verifyMergeRequestAuthor(
      mergeRequest,
      expectedAuthorUsername
    );
    if (!authorVerified) throw new Error("Author verification failed!");

    // Send transaction using the DeveloperPayouts contract
    const tx = await developerPayouts.submitMergeRequest(mergeRequest, issueId);
    document.getElementById(
      "status"
    ).innerText = `Transaction sent: ${tx.hash}`;

    // Wait for confirmation
    await tx.wait();
    document.getElementById("status").innerText = `Transaction confirmed!`;
  } catch (error) {
    document.getElementById("status").innerText = `Error: ${error.message}`;
  }
}

// Checks if the merge request exsists
async function checkMergeRequestExists(mergeRequestId) {
  const response = await fetch(
    `https://gitlab.com/api/v4/projects/:id/merge_requests/${mergeRequestId}`,
    {
      headers: { "PRIVATE-TOKEN": "your_access_token" },
    }
  );

  if (response.status === 200) {
    const mergeRequest = await response.json();
    return mergeRequest.id === parseInt(mergeRequestId);
  } else {
    return false;
  }
}

// Verifies the author of the merge request
async function verifyMergeRequestAuthor(
  mergeRequestId,
  expectedAuthorUsername
) {
  try {
    const mergeRequest = await fetchMergeRequestDetails(mergeRequestId);
    const authorUsername = mergeRequest.author.username;

    if (authorUsername === expectedAuthorUsername) {
      console.log(`Author verified: ${authorUsername}`);
      return true;
    } else {
      console.log(
        `Author mismatch: expected ${expectedAuthorUsername}, got ${authorUsername}`
      );
      return false;
    }
  } catch (error) {
    console.error(`Error verifying author: ${error.message}`);
    return false;
  }
}

async function requestPayment() {
  try {
    const mergeRequest = document.getElementById("mergeRequestInput").value;
    const issueId = document.getElementById("issueIdInput").value;
    const expectedAuthorUsername = "developer_username"; // Replace with the expected author's username

    if (!mergeRequest || !issueId)
      throw new Error("Enter valid merge request ID and issue ID!");

    // Check if the merge request exists
    const mergeRequestExists = await checkMergeRequestExists(mergeRequest);
    if (!mergeRequestExists) throw new Error("Merge request does not exist!");

    // Verify the merge request author
    const authorVerified = await verifyMergeRequestAuthor(
      mergeRequest,
      expectedAuthorUsername
    );
    if (!authorVerified) throw new Error("Author verification failed!");

    // Check if the merge request has closed the issue
    const issueClosed = await checkMergeRequestClosedIssue(
      mergeRequest,
      issueId
    );
    if (!issueClosed)
      throw new Error("Merge request did not close the specified issue!");

    // Send transaction using the DeveloperPayouts contract
    const tx = await developerPayouts.requestPayment(mergeRequest);
    document.getElementById(
      "status"
    ).innerText = `Transaction sent: ${tx.hash}`;

    // Wait for confirmation
    await tx.wait();
    document.getElementById("status").innerText = `Transaction confirmed!`;
  } catch (error) {
    document.getElementById("status").innerText = `Error: ${error.message}`;
  }
}

// Verifies the author of the merge request
async function verifyMergeRequestAuthor(
  mergeRequestId,
  expectedAuthorUsername
) {
  try {
    const mergeRequest = await fetchMergeRequestDetails(mergeRequestId);
    const authorUsername = mergeRequest.author.username;

    if (authorUsername === expectedAuthorUsername) {
      console.log(`Author verified: ${authorUsername}`);
      return true;
    } else {
      console.log(
        `Author mismatch: expected ${expectedAuthorUsername}, got ${authorUsername}`
      );
      return false;
    }
  } catch (error) {
    console.error(`Error verifying author: ${error.message}`);
    return false;
  }
}

// Fetch merge request details
async function fetchMergeRequestDetails(mergeRequestId) {
  const response = await fetch(
    `https://gitlab.com/api/v4/projects/:id/merge_requests/${mergeRequestId}`,
    {
      headers: { "PRIVATE-TOKEN": "your_access_token" },
    }
  );

  if (response.status === 200) {
    const mergeRequest = await response.json();
    return mergeRequest;
  } else {
    throw new Error("Merge request not found!");
  }
}

// Checks if the merge request has closed the issue
async function checkMergeRequestClosedIssue(mergeRequestId, issueId) {
  const response = await fetch(
    `https://gitlab.com/api/v4/projects/:id/merge_requests/${mergeRequestId}/closes_issues`,
    {
      headers: { "PRIVATE-TOKEN": "your_access_token" },
    }
  );

  if (response.status === 200) {
    const closedIssues = await response.json();
    return closedIssues.some((issue) => issue.id == issueId);
  } else {
    throw new Error("Failed to fetch closed issues!");
  }
}

// Resturns all open issues
async function fetchOpenIssues() {
  const response = await fetch(
    "https://gitlab.com/api/v4/projects/:id/issues?state=opened",
    {
      headers: { "PRIVATE-TOKEN": "your_access_token" },
    }
  );
  const issues = await response.json();
  return issues;
}

// Attach event listeners to buttons
document
  .getElementById("contributeButton")
  .addEventListener("click", contribute);
document
  .getElementById("allocateFundsButton")
  .addEventListener("click", allocateFunds);
document
  .getElementById("reallocateFundsButton")
  .addEventListener("click", reallocateFunds);
document
  .getElementById("approveWorkButton")
  .addEventListener("click", approveWork);
document
  .getElementById("selectIssueButton")
  .addEventListener("click", selectIssue);
document
  .getElementById("submitMergeRequestButton")
  .addEventListener("click", submitMergeRequest);
document
  .getElementById("requestPaymentButton")
  .addEventListener("click", requestPayment);
document
  .getElementById("connectWallet")
  .addEventListener("click", connectWallet);
