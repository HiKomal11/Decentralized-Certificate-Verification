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
    "0xAd731be07A648F67ceE32117AD5C8fFC592A10bb";


// ======================================================
// HARDHAT LOCAL NETWORK
// ======================================================

const sepolia = defineChain({

    id: 11155111,

    name: "Sepolia",

    nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18
    },

    rpcUrls: {
        default: {
            http: [
                "https://ethereum-sepolia-rpc.publicnode.com"
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


            if (parseInt(chainId, 16) !== 11155111) {

                alert(
                    "Please switch MetaMask to Sepolia Network (Chain ID 11155111)."
                );

                return;
            }


            // ------------------------------------------
            // CREATE WALLET CLIENT
            // ------------------------------------------

            walletClient =
                createWalletClient({

                    account: account,

                    chain: sepolia,

                    transport: custom(
                        window.ethereum
                    )

                });


            // ------------------------------------------
            // CREATE PUBLIC CLIENT
            // ------------------------------------------

            publicClient =
                createPublicClient({

                    chain: sepolia,

                    transport:
                        http(
                            "https://ethereum-sepolia-rpc.publicnode.com"
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

            console.error("Connection error:", error);

            document
                .getElementById("walletAddress")
                .innerText =
                    "Connected: " + account;

            document
                .getElementById("userRole")
                .innerText =
                    "⚠️ Wallet connected, but contract information could not be loaded.";

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
                        sepolia

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
                window.location.origin +
                "/verify.html?id=" +
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

                // ------------------------------------------
                // DOWNLOAD CERTIFICATE PDF
                // ------------------------------------------

                document
                    .getElementById("downloadPDF")
                    .onclick = () => {

                        const {
                            jsPDF
                        } = window.jspdf;

                        const pdf =
                            new jsPDF({
                                orientation: "portrait",
                                unit: "mm",
                                format: "a4"
                            });


                        // --------------------------------------
                        // PAGE BORDER
                        // --------------------------------------

                        pdf.setDrawColor(
                            37,
                            99,
                            235
                        );

                        pdf.setLineWidth(1.5);

                        pdf.rect(
                            12,
                            12,
                            186,
                            273
                        );


                        // --------------------------------------
                        // TITLE
                        // --------------------------------------

                        pdf.setTextColor(
                            37,
                            99,
                            235
                        );

                        pdf.setFontSize(24);

                        pdf.setFont(
                            "helvetica",
                            "bold"
                        );

                        pdf.text(
                            "DECENTRALIZED",
                            105,
                            35,
                            {
                                align: "center"
                            }
                        );


                        pdf.setTextColor(
                            30,
                            41,
                            59
                        );

                        pdf.setFontSize(20);

                        pdf.text(
                            "CERTIFICATE",
                            105,
                            46,
                            {
                                align: "center"
                            }
                        );


                        // --------------------------------------
                        // SUBTITLE
                        // --------------------------------------

                        pdf.setFontSize(11);

                        pdf.setFont(
                            "helvetica",
                            "normal"
                        );

                        pdf.setTextColor(
                            100,
                            116,
                            139
                        );

                        pdf.text(
                            "Blockchain Verified Digital Certificate",
                            105,
                            56,
                            {
                                align: "center"
                            }
                        );


                        // --------------------------------------
                        // DECORATIVE LINE
                        // --------------------------------------

                        pdf.setDrawColor(
                            148,
                            163,
                            184
                        );

                        pdf.setLineWidth(0.4);

                        pdf.line(
                            35,
                            65,
                            175,
                            65
                        );


                        // --------------------------------------
                        // STUDENT NAME
                        // --------------------------------------

                        pdf.setTextColor(
                            30,
                            41,
                            59
                        );

                        pdf.setFontSize(12);

                        pdf.text(
                            "This certificate is proudly presented to",
                            105,
                            82,
                            {
                                align: "center"
                            }
                        );


                        pdf.setFontSize(25);

                        pdf.setFont(
                            "helvetica",
                            "bold"
                        );

                        pdf.setTextColor(
                            37,
                            99,
                            235
                        );

                        pdf.text(
                            studentName,
                            105,
                            96,
                            {
                                align: "center"
                            }
                        );


                        // --------------------------------------
                        // COURSE
                        // --------------------------------------

                        pdf.setFont(
                            "helvetica",
                            "normal"
                        );

                        pdf.setFontSize(12);

                        pdf.setTextColor(
                            71,
                            85,
                            105
                        );

                        pdf.text(
                            "for successfully completing",
                            105,
                            110,
                            {
                                align: "center"
                            }
                        );


                        pdf.setFontSize(17);

                        pdf.setFont(
                            "helvetica",
                            "bold"
                        );

                        pdf.setTextColor(
                            30,
                            41,
                            59
                        );

                        pdf.text(
                            course,
                            105,
                            122,
                            {
                                align: "center"
                            }
                        );


                        // --------------------------------------
                        // CERTIFICATE DETAILS
                        // --------------------------------------

                        pdf.setFont(
                            "helvetica",
                            "normal"
                        );

                        pdf.setFontSize(11);

                        pdf.setTextColor(
                            71,
                            85,
                            105
                        );

                        pdf.text(
                            "Certificate ID:",
                            35,
                            145
                        );

                        pdf.setTextColor(
                            15,
                            23,
                            42
                        );

                        pdf.setFont(
                            "helvetica",
                            "bold"
                        );

                        pdf.text(
                            certificateId,
                            75,
                            145
                        );


                        pdf.setFont(
                            "helvetica",
                            "normal"
                        );

                        pdf.setTextColor(
                            71,
                            85,
                            105
                        );

                        pdf.text(
                            "Issue Date:",
                            35,
                            155
                        );

                        pdf.setTextColor(
                            15,
                            23,
                            42
                        );

                        pdf.text(
                            new Date().toLocaleDateString(),
                            75,
                            155
                        );


                        // --------------------------------------
                        // QR CODE
                        // --------------------------------------

                        pdf.addImage(
                            qrDataURL,
                            "PNG",
                            135,
                            135,
                            40,
                            40
                        );


                        pdf.setFontSize(9);

                        pdf.setTextColor(
                            100,
                            116,
                            139
                        );

                        pdf.text(
                            "Scan to verify",
                            155,
                            180,
                            {
                                align: "center"
                            }
                        );


                        // --------------------------------------
                        // HASH
                        // --------------------------------------

                        pdf.setFontSize(9);

                        pdf.setTextColor(
                            71,
                            85,
                            105
                        );

                        pdf.text(
                            "Blockchain Certificate Hash:",
                            35,
                            175
                        );


                        pdf.setFont(
                            "courier",
                            "normal"
                        );

                        pdf.setFontSize(7);

                        pdf.setTextColor(
                            37,
                            99,
                            235
                        );


                        const hashLines =
                            pdf.splitTextToSize(
                                certificateHash,
                                90
                            );


                        pdf.text(
                            hashLines,
                            35,
                            182
                        );


                        // --------------------------------------
                        // CERTIFICATE STATUS
                        // --------------------------------------

                        pdf.setFont(
                            "helvetica",
                            "bold"
                        );

                        pdf.setFontSize(12);

                        pdf.setTextColor(
                            22,
                            101,
                            52
                        );

                        pdf.text(
                            "VALID CERTIFICATE",
                            35,
                            210
                        );


                        pdf.setFont(
                            "helvetica",
                            "normal"
                        );

                        pdf.setFontSize(9);

                        pdf.setTextColor(
                            71,
                            85,
                            105
                        );

                        pdf.text(
                            "Certificate verification data stored on blockchain",
                            35,
                            218);
                        // --------------------------------------
                        // TRANSACTION HASH
                        // --------------------------------------

                        pdf.setFont(
                            "helvetica",
                            "bold"
                        );

                        pdf.setFontSize(9);

                        pdf.setTextColor(
                            71,
                            85,
                            105
                        );

                        pdf.text(
                            "Blockchain Transaction Hash:",
                            35,
                            228
                        );


                        pdf.setFont(
                            "courier",
                            "normal"
                        );

                        pdf.setFontSize(6.5);

                        pdf.setTextColor(
                            37,
                            99,
                            235
                        );


                        const transactionLines =
                            pdf.splitTextToSize(
                                transactionHash,
                                140
                            );


                        pdf.text(
                            transactionLines,
                            35,
                            235
                        );


                        // --------------------------------------
                        // FOOTER
                        // --------------------------------------

                        pdf.setDrawColor(
                            203,
                            213,
                            225
                        );

                        pdf.line(
                            35,
                            252,
                            175,
                            252
                        );

                        pdf.setFontSize(9);

                        pdf.setTextColor(
                            100,
                            116,
                            139
                        );

                        pdf.text(
                            "Decentralized Certificate Verification",
                            105,
                            262,
                            {
                                align: "center"
                            }
                        );


                        pdf.text(
                            "Designed & Developed by Komal Pandey",
                            105,
                            270,
                            {
                                align: "center"
                            }
                        );


                        pdf.setFontSize(8);

                        // --------------------------------------
                        // SAVE PDF
                        // --------------------------------------

                        pdf.save(
                            certificateId +
                            "-Certificate.pdf"
                        );

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
                .getElementById("verificationResult")
                .innerHTML = `

                    <h3 class="${
                        isValid
                            ? "valid"
                            : "revoked"
                    }">

                        ${
                            isValid
                                ? "✓ Valid Certificate"
                                : "✗ Revoked Certificate"
                        }

                    </h3>

                    <p>
                        <strong>Certificate ID:</strong>
                        ${certificateId}
                    </p>

                    <p>
                        <strong>Student:</strong>
                        ${studentName}
                    </p>

                    <p>
                        <strong>Course:</strong>
                        ${course}
                    </p>

                    <p>
                        <strong>Certificate Hash:</strong>
                        ${certificateHash}
                    </p>

                    <p>
                        <strong>Issue Date:</strong>
                        ${date}
                    </p>

                    <p>
                        <strong>Status:</strong>
                        ${isValid ? "Valid" : "Revoked"}
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
                        sepolia

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