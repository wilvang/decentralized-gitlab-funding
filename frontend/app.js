
// import NumbersInfo from "./Numbers.json" with { type: "json" };

// Contract details - hardoced for now, already deployed on Sepolia testnet.
// Put here your actual contract address:
const contractAddress = "0xe86d6525bb7B4d44Cc2470Ac740134301F4Fa230"; // Sepolia contract
var contract = null;

fetch("./Number.json")
  .then((res) => res.json())
  .then((data) => {
    console.log(data.abi);
    if (!window.ethereum) throw new Error("MetaMask not detected!");

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        window.ethereum.request({ method: "eth_requestAccounts" });
        const signer = provider.getSigner();
        // we got all the data we need, so we can now create the contract instance
        contract = new ethers.Contract(contractAddress, data.abi, signer);
        // lets enable the buttons now
        document.getElementById("setNumberButton").removeAttribute("disabled");
        document.getElementById("getNumberButton").removeAttribute("disabled");
        document.getElementById("connectWallet").removeAttribute("disabled");
        document.getElementById("numberInput").removeAttribute("disabled");
  });


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
};


// Connect wallet and call contract
async function setNumber() {
    try {
        const num = document.getElementById("numberInput").value;
        if (!num) throw new Error("Enter a valid number!");

        // Send transaction
        const tx = await contract.setNumber(num);
        document.getElementById("status").innerText = `Transaction sent: ${tx.hash}`;

        // Wait for confirmation
        await tx.wait();
        document.getElementById("status").innerText = `Transaction confirmed!`;
    } catch (error) {
        document.getElementById("status").innerText = `Error: ${error.message}`;
    }
}
// Connect wallet and call contract
async function getNumber() {
    const num = await contract.number();
    document.getElementById("number").innerText = `Number is: ${num}`;
}

// Attach event listeners to buttons
document.getElementById("setNumberButton").addEventListener("click", setNumber);
document.getElementById("getNumberButton").addEventListener("click", getNumber);
document.getElementById("connectWallet").addEventListener("click", connectWallet);
