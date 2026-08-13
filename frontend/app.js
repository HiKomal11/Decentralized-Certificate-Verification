import {
    createPublicClient,
    createWalletClient,
    custom,
    http,
    keccak256,
    stringToHex,
    defineChain
} from "https://esm.sh/viem";

const CONTRACT_ADDRESS =
    "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const hardhatLocal = defineChain({
    id: 31337,
    name: "Hardhat Local",
    nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18
    },
    rpcUrls: {
        default: {
            http: ["http://127.0.0.1:8545"]
        }
    }
});

let walletClient;
let publicClient;
let account;


// Contract ABI
const contractABI = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_certificateId",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_studentName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_course",
                "type": "string"
            },
            {
                "internalType": "bytes32",
                "name": "_certificateHash",
                "type": "bytes32"
            }
        ],
        "name": "issueCertificate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_certificateId",
                "type": "string"
            }
        ],
        "name": "verifyCertificate",
        "outputs": [
            {
                "internalType": "string",
                "name": "studentName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "course",
                "type": "string"
            },
            {
                "internalType": "bytes32",
                "name": "certificateHash",
                "type": "bytes32"
            },
            {
                "internalType": "uint256",
                "name": "issueDate",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "isValid",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_certificateId",
                "type": "string"
            }
        ],
        "name": "revokeCertificate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];


// Connect MetaMask
document
    .getElementById("connectWallet")
    .addEventListener("click", async () => {

        if (!window.ethereum) {
            alert("Please install MetaMask.");
            return;
        }

        try {

            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts"
            });

            account = accounts[0];

            walletClient = createWalletClient({
                account: account,
                chain: hardhatLocal,
                transport: custom(window.ethereum)
            });

            publicClient = createPublicClient({
                chain: hardhatLocal,
                transport: http("http://127.0.0.1:8545")
            });

            const chainId = await window.ethereum.request({
                method: "eth_chainId"
            });

            if (parseInt(chainId, 16) !== 31337) {

                alert(
                    "Please switch MetaMask to Hardhat Local (Chain ID 31337)."
                );

                return;
            }

            document.getElementById("walletAddress").innerText =
                "Connected: " + account;

            console.log("MetaMask connected:", account);

        } catch (error) {

            console.error(error);

            document.getElementById("walletAddress").innerText =
                "Connection failed";
        }
    });


// Issue Certificate
document
    .getElementById("issueCertificate")
    .addEventListener("click", async () => {

        if (!walletClient || !account) {
            alert("Please connect MetaMask first.");
            return;
        }

        try {

            const certificateId =
                document.getElementById("certificateId").value;

            const studentName =
                document.getElementById("studentName").value;

            const course =
                document.getElementById("course").value;

            if (!certificateId || !studentName || !course) {
                alert("Please fill all fields.");
                return;
            }

            const certificateHash = keccak256(
                stringToHex(certificateId)
            );

            const hash = await walletClient.writeContract({

                address: CONTRACT_ADDRESS,

                abi: contractABI,

                functionName: "issueCertificate",

                args: [
                    certificateId,
                    studentName,
                    course,
                    certificateHash
                ],

                account: account,

                chain: hardhatLocal
            });

            document.getElementById("issueStatus").innerText =
                " Certificate issued! Transaction: " + hash;

        } catch (error) {

            console.error(error);

            document.getElementById("issueStatus").innerText =
                "Error: " + error.shortMessage || error.message;
        }
    });


// Verify Certificate
document
    .getElementById("verifyCertificate")
    .addEventListener("click", async () => {

        if (!publicClient) {
            alert("Please connect MetaMask first.");
            return;
        }

        try {

            const certificateId =
                document.getElementById("verifyCertificateId").value;

            if (!certificateId) {
                alert("Please enter a certificate ID.");
                return;
            }

            const result = await publicClient.readContract({

                address: CONTRACT_ADDRESS,

                abi: contractABI,

                functionName: "verifyCertificate",

                args: [certificateId]
            });

            const studentName = result[0];
            const course = result[1];
            const certificateHash = result[2];
            const issueDate = result[3];
            const isValid = result[4];

            const date =
                new Date(Number(issueDate) * 1000)
                    .toLocaleString();

            document.getElementById("verificationResult").innerHTML = `

                <h3>
                    ${isValid
                        ? " Valid Certificate"
                        : " Revoked Certificate"}
                </h3>

                <p><strong>Student:</strong> ${studentName}</p>

                <p><strong>Course:</strong> ${course}</p>

                <p><strong>Certificate Hash:</strong> ${certificateHash}</p>

                <p><strong>Issue Date:</strong> ${date}</p>

                <p>
                    <strong>Status:</strong>
                    ${isValid ? "Valid" : "Revoked"}
                </p>

            `;

        } catch (error) {

            console.error(error);

            document.getElementById("verificationResult").innerText =
                "Certificate not found.";
        }
    });


// Revoke Certificate
document
    .getElementById("revokeCertificate")
    .addEventListener("click", async () => {

        if (!walletClient || !account) {
            alert("Please connect MetaMask first.");
            return;
        }

        try {

            const certificateId =
                document.getElementById("revokeCertificateId").value;

            if (!certificateId) {
                alert("Please enter a certificate ID.");
                return;
            }

            const hash = await walletClient.writeContract({

                address: CONTRACT_ADDRESS,

                abi: contractABI,

                functionName: "revokeCertificate",

                args: [certificateId],

                account: account,

                chain: hardhatLocal
            });

            document.getElementById("revokeStatus").innerText =
                " Revocation transaction sent: " + hash;

        } catch (error) {

            console.error(error);

            document.getElementById("revokeStatus").innerText =
                "Error: " + (error.shortMessage || error.message);
        }
    });