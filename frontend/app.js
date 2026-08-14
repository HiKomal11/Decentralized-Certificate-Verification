import QRCode from "https://esm.sh/qrcode";

import {
    createPublicClient,
    createWalletClient,
    custom,
    http,
    keccak256,
    stringToHex,
    defineChain
} from "https://esm.sh/viem";


// ======================================================
// CONTRACT CONFIGURATION
// ======================================================

const CONTRACT_ADDRESS =
    "0x5FbDB2315678afecb367f032d93F642f64180aa3";


// ======================================================
// HARDHAT LOCAL NETWORK
// ======================================================

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
            http: [
                "http://192.168.0.112:8545"
            ]
        }
    }

});


// ======================================================
// VARIABLES
// ======================================================

let walletClient;
let publicClient;
let account;
let isAdmin = false;


// ======================================================
// CONTRACT ABI
// ======================================================

const contractABI = [

    // ==================================================
    // ISSUE CERTIFICATE
    // ==================================================

    {
        inputs: [
            {
                internalType: "string",
                name: "_certificateId",
                type: "string"
            },
            {
                internalType: "string",
                name: "_studentName",
                type: "string"
            },
            {
                internalType: "string",
                name: "_course",
                type: "string"
            },
            {
                internalType: "bytes32",
                name: "_certificateHash",
                type: "bytes32"
            }
        ],

        name: "issueCertificate",

        outputs: [],

        stateMutability: "nonpayable",

        type: "function"
    },


    // ==================================================
    // VERIFY CERTIFICATE
    // ==================================================

    {
        inputs: [
            {
                internalType: "string",
                name: "_certificateId",
                type: "string"
            }
        ],

        name: "verifyCertificate",

        outputs: [
            {
                internalType: "string",
                name: "studentName",
                type: "string"
            },
            {
                internalType: "string",
                name: "course",
                type: "string"
            },
            {
                internalType: "bytes32",
                name: "certificateHash",
                type: "bytes32"
            },
            {
                internalType: "uint256",
                name: "issueDate",
                type: "uint256"
            },
            {
                internalType: "bool",
                name: "isValid",
                type: "bool"
            }
        ],

        stateMutability: "view",

        type: "function"
    },


    // ==================================================
    // REVOKE CERTIFICATE
    // ==================================================

    {
        inputs: [
            {
                internalType: "string",
                name: "_certificateId",
                type: "string"
            }
        ],

        name: "revokeCertificate",

        outputs: [],

        stateMutability: "nonpayable",

        type: "function"
    },


    // ==================================================
    // OWNER
    // ==================================================

    {
        inputs: [],

        name: "owner",

        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address"
            }
        ],

        stateMutability: "view",

        type: "function"
    }

];


// ======================================================
// CONNECT METAMASK
// ======================================================

document
    .getElementById("connectWallet")
    .addEventListener("click", async () => {

        if (!window.ethereum) {

            alert("Please install MetaMask.");

            return;
        }


        try {

            // ------------------------------------------
            // REQUEST ACCOUNT
            // ------------------------------------------

            const accounts =
                await window.ethereum.request({
                    method: "eth_requestAccounts"
                });


            account = accounts[0];


            // ------------------------------------------
            // CHECK NETWORK
            // ------------------------------------------

            const chainId =
                await window.ethereum.request({
                    method: "eth_chainId"
                });


            if (parseInt(chainId, 16) !== 31337) {

                alert(
                    "Please switch MetaMask to Hardhat Local (Chain ID 31337)."
                );

                return;
            }


            // ------------------------------------------
            // CREATE WALLET CLIENT
            // ------------------------------------------

            walletClient =
                createWalletClient({

                    account: account,

                    chain: hardhatLocal,

                    transport: custom(
                        window.ethereum
                    )

                });


            // ------------------------------------------
            // CREATE PUBLIC CLIENT
            // ------------------------------------------

            publicClient =
                createPublicClient({

                    chain: hardhatLocal,

                    transport: http(
                        "http://192.168.0.112:8545"
                    )

                });


            // ------------------------------------------
            // DISPLAY WALLET
            // ------------------------------------------

            document
                .getElementById("walletAddress")
                .innerText =
                    "Connected: " + account;


            // ------------------------------------------
            // GET CONTRACT OWNER
            // ------------------------------------------

            const contractOwner =
                await publicClient.readContract({

                    address: CONTRACT_ADDRESS,

                    abi: contractABI,

                    functionName: "owner"

                });


            // ------------------------------------------
            // CHECK ADMIN
            // ------------------------------------------

            isAdmin =
                account.toLowerCase() ===
                contractOwner.toLowerCase();


            // ------------------------------------------
            // DISPLAY ROLE
            // ------------------------------------------

            const roleElement =
                document.getElementById(
                    "userRole"
                );


            const adminSection =
                document.getElementById(
                    "adminSection"
                );


            if (isAdmin) {

                roleElement.innerText =
                    " Role: Administrator";

                roleElement.className =
                    "admin-role";

                adminSection.style.display =
                    "block";

            } else {

                roleElement.innerText =
                    " Role: Verifier";

                roleElement.className =
                    "user-role";

                adminSection.style.display =
                    "none";
            }


            console.log(
                "Connected account:",
                account
            );

            console.log(
                "Contract owner:",
                contractOwner
            );

            console.log(
                "Is administrator:",
                isAdmin
            );

        }

        catch (error) {

            console.error(error);

            document
                .getElementById(
                    "walletAddress"
                )
                .innerText =
                    "❌ Connection failed";

        }

    });


// ======================================================
// ISSUE CERTIFICATE
// ======================================================

document
    .getElementById("issueCertificate")
    .addEventListener("click", async () => {

        // ----------------------------------------------
        // CHECK WALLET
        // ----------------------------------------------

        if (!walletClient || !account) {

            alert(
                "Please connect MetaMask first."
            );

            return;
        }


        // ----------------------------------------------
        // CHECK ADMIN
        // ----------------------------------------------

        if (!isAdmin) {

            alert(
                "Only the administrator can issue certificates."
            );

            return;
        }


        try {

            // ------------------------------------------
            // GET INPUT VALUES
            // ------------------------------------------

            const certificateId =
                document
                    .getElementById("certificateId")
                    .value
                    .trim();


            const studentName =
                document
                    .getElementById("studentName")
                    .value
                    .trim();


            const course =
                document
                    .getElementById("course")
                    .value
                    .trim();


            // ------------------------------------------
            // VALIDATE INPUT
            // ------------------------------------------

            if (
                !certificateId ||
                !studentName ||
                !course
            ) {

                alert(
                    "Please fill all fields."
                );

                return;
            }


            // ------------------------------------------
            // CREATE CERTIFICATE DATA
            // ------------------------------------------

            const certificateData =
                certificateId +
                "|" +
                studentName +
                "|" +
                course;


            // ------------------------------------------
            // CREATE HASH
            // ------------------------------------------

            const certificateHash =
                keccak256(
                    stringToHex(
                        certificateData
                    )
                );


            console.log(
                "Certificate data:",
                certificateData
            );

            console.log(
                "Certificate hash:",
                certificateHash
            );


            // ------------------------------------------
            // SEND TRANSACTION
            // ------------------------------------------

            const transactionHash =
                await walletClient.writeContract({

                    address:
                        CONTRACT_ADDRESS,

                    abi:
                        contractABI,

                    functionName:
                        "issueCertificate",

                    args: [

                        certificateId,

                        studentName,

                        course,

                        certificateHash

                    ],

                    account:
                        account,

                    chain:
                        hardhatLocal

                });


            // ------------------------------------------
            // WAIT FOR TRANSACTION
            // ------------------------------------------

            await publicClient.waitForTransactionReceipt({
                hash: transactionHash
            });


            // ------------------------------------------
            // DISPLAY SUCCESS
            // ------------------------------------------

            document
                .getElementById(
                    "issueStatus"
                )
                .innerText =
                    "✅ Certificate issued successfully!\n" +
                    "Transaction: " +
                    transactionHash;


            // ==================================================
            // GENERATE QR CODE
            // ==================================================

            /*
             * The QR code points to verify.html.
             *
             * Example:
             *
             * http://localhost:5500/verify.html?id=CERT005
             *
             */

            const verificationURL =
                "http://192.168.0.112:5500/verify.html?id=" +
                encodeURIComponent(certificateId);


            console.log(
                "Verification URL:",
                verificationURL
            );


            // ------------------------------------------
            // GENERATE QR IMAGE
            // ------------------------------------------

            const qrDataURL =
                await QRCode.toDataURL(
                    verificationURL,
                    {
                        width: 250,
                        margin: 2
                    }
                );


            // ------------------------------------------
            // DISPLAY QR
            // ------------------------------------------

            document
                .getElementById("qrCode")
                .src = qrDataURL;


            document
                .getElementById("qrSection")
                .style.display =
                    "block";


            // ------------------------------------------
            // DOWNLOAD QR BUTTON
            // ------------------------------------------

            document
                .getElementById("downloadQR")
                .onclick = () => {

                    const link =
                        document.createElement(
                            "a"
                        );

                    link.href =
                        qrDataURL;

                    link.download =
                        certificateId +
                        "-QR.png";

                    link.click();

                };


        }

        catch (error) {

            console.error(error);

            document
                .getElementById(
                    "issueStatus"
                )
                .innerText =
                    "❌ Error: " +
                    (
                        error.shortMessage ||
                        error.message
                    );

        }

    });


// ======================================================
// VERIFY CERTIFICATE
// ======================================================

document
    .getElementById("verifyCertificate")
    .addEventListener("click", async () => {

        // ----------------------------------------------
        // CHECK PUBLIC CLIENT
        // ----------------------------------------------

        if (!publicClient) {

            alert(
                "Please connect MetaMask first."
            );

            return;
        }


        try {

            // ------------------------------------------
            // GET CERTIFICATE ID
            // ------------------------------------------

            const certificateId =
                document
                    .getElementById(
                        "verifyCertificateId"
                    )
                    .value
                    .trim();


            // ------------------------------------------
            // VALIDATE
            // ------------------------------------------

            if (!certificateId) {

                alert(
                    "Please enter a certificate ID."
                );

                return;
            }


            // ------------------------------------------
            // READ BLOCKCHAIN
            // ------------------------------------------

            const result =
                await publicClient.readContract({

                    address:
                        CONTRACT_ADDRESS,

                    abi:
                        contractABI,

                    functionName:
                        "verifyCertificate",

                    args: [
                        certificateId
                    ]

                });


            // ------------------------------------------
            // EXTRACT DATA
            // ------------------------------------------

            const studentName =
                result[0];


            const course =
                result[1];


            const certificateHash =
                result[2];


            const issueDate =
                result[3];


            const isValid =
                result[4];


            // ------------------------------------------
            // CONVERT DATE
            // ------------------------------------------

            const date =
                new Date(
                    Number(issueDate) * 1000
                ).toLocaleString();


            // ------------------------------------------
            // DISPLAY RESULT
            // ------------------------------------------

            document
                .getElementById(
                    "verificationResult"
                )
                .innerHTML = `

                    <h3 class="${
                        isValid
                            ? "valid"
                            : "revoked"
                    }">

                        ${
                            isValid
                                ? "✅ Valid Certificate"
                                : "❌ Revoked Certificate"
                        }

                    </h3>


                    <p>
                        <strong>
                            Certificate ID:
                        </strong>

                        ${certificateId}
                    </p>


                    <p>
                        <strong>
                            Student:
                        </strong>

                        ${studentName}
                    </p>


                    <p>
                        <strong>
                            Course:
                        </strong>

                        ${course}
                    </p>


                    <p>
                        <strong>
                            Certificate Hash:
                        </strong>

                        ${certificateHash}
                    </p>


                    <p>
                        <strong>
                            Issue Date:
                        </strong>

                        ${date}
                    </p>


                    <p>
                        <strong>
                            Status:
                        </strong>

                        ${
                            isValid
                                ? "Valid"
                                : "Revoked"
                        }
                    </p>

                `;

        }

        catch (error) {

            console.error(error);

            document
                .getElementById(
                    "verificationResult"
                )
                .innerHTML = `

                    <h3 class="error">
                        ❌ Certificate Not Found
                    </h3>

                    <p>
                        Please check the certificate ID
                        and try again.
                    </p>

                `;

        }

    });


// ======================================================
// REVOKE CERTIFICATE
// ======================================================

document
    .getElementById("revokeCertificate")
    .addEventListener("click", async () => {

        // ----------------------------------------------
        // CHECK WALLET
        // ----------------------------------------------

        if (!walletClient || !account) {

            alert(
                "Please connect MetaMask first."
            );

            return;
        }


        // ----------------------------------------------
        // CHECK ADMIN
        // ----------------------------------------------

        if (!isAdmin) {

            alert(
                "Only the administrator can revoke certificates."
            );

            return;
        }


        try {

            // ------------------------------------------
            // GET CERTIFICATE ID
            // ------------------------------------------

            const certificateId =
                document
                    .getElementById(
                        "revokeCertificateId"
                    )
                    .value
                    .trim();


            // ------------------------------------------
            // VALIDATE
            // ------------------------------------------

            if (!certificateId) {

                alert(
                    "Please enter a certificate ID."
                );

                return;
            }


            // ------------------------------------------
            // SEND REVOCATION TRANSACTION
            // ------------------------------------------

            const transactionHash =
                await walletClient.writeContract({

                    address:
                        CONTRACT_ADDRESS,

                    abi:
                        contractABI,

                    functionName:
                        "revokeCertificate",

                    args: [
                        certificateId
                    ],

                    account:
                        account,

                    chain:
                        hardhatLocal

                });


            // ------------------------------------------
            // WAIT FOR CONFIRMATION
            // ------------------------------------------

            await publicClient.waitForTransactionReceipt({
                hash: transactionHash
            });


            // ------------------------------------------
            // DISPLAY SUCCESS
            // ------------------------------------------

            document
                .getElementById(
                    "revokeStatus"
                )
                .innerText =
                    "✅ Certificate revoked successfully!\n" +
                    "Transaction: " +
                    transactionHash;


        }

        catch (error) {

            console.error(error);

            document
                .getElementById(
                    "revokeStatus"
                )
                .innerText =
                    "❌ Error: " +
                    (
                        error.shortMessage ||
                        error.message
                    );

        }

    });


// ======================================================
// METAMASK ACCOUNT CHANGE
// ======================================================

if (window.ethereum) {

    window.ethereum.on(
        "accountsChanged",
        () => {

            window.location.reload();

        }
    );


    window.ethereum.on(
        "chainChanged",
        () => {

            window.location.reload();

        }
    );

}