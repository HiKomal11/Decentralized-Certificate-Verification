#  Decentralized Certificate Verification

A blockchain-based certificate issuing, verification, revocation, QR verification, and PDF generation system built using **Solidity, Hardhat, Viem, JavaScript, HTML, CSS, and MetaMask**.

The project demonstrates how blockchain technology can be used to create a tamper-resistant certificate verification system without relying on a traditional centralized database.

---

##  Project Overview

Traditional certificates can be forged, altered, or difficult to verify.

This project provides a decentralized certificate management system where an authorized administrator can:

- Issue digital certificates
- Store certificate verification data on the blockchain
- Generate a cryptographic certificate hash
- Verify certificates directly from the blockchain
- Revoke certificates
- Generate QR codes for certificate verification
- Provide a QR-based public verification page
- Generate downloadable PDF certificates
- Display blockchain transaction information
- Connect securely using MetaMask

Once a certificate is issued, its verification information is stored inside a Solidity smart contract deployed on a local Ethereum-compatible blockchain.

---

#  Features

## 1.  MetaMask Wallet Connection

Users can connect their MetaMask wallet to the application.

The application automatically:

- Detects the connected wallet
- Checks the blockchain network
- Identifies the contract owner
- Determines whether the connected wallet is an administrator or verifier

### User Roles

**Administrator**
- Issue certificates
- Revoke certificates

**Verifier**
- Verify certificates

Certificate verification is publicly accessible.

---

## 2.  Issue Certificate

The administrator can issue a certificate by entering:

- Certificate ID
- Student Name
- Course / Program

The application generates a cryptographic certificate hash and sends the certificate information to the smart contract.

Example:

```text
Certificate ID: CERT005
Student Name: Rahul Sharma
Course: B.Sc Computer Science
```

After successful blockchain confirmation, the application displays the transaction hash.

---

## 3.  Blockchain Certificate Hash

Every certificate contains a `bytes32` cryptographic hash.

Example:

```text
0x87e6793d6e45cd87b1ee25097e4180c0ce742a0e4c90453025fd861ee7aeb3ff
```

The hash provides a cryptographic representation of certificate-related data and can help detect unauthorized changes.

---

## 4.  Certificate Verification

Anyone can verify a certificate using its Certificate ID.

The blockchain returns:

- Certificate ID
- Student Name
- Course
- Certificate Hash
- Issue Date
- Certificate Status

Example:

```text
✓ Valid Certificate

Certificate ID: CERT005
Student: Rahul Sharma
Course: B.Sc Computer Science
Certificate Hash: 0x87e679...
Issue Date: 13 August 2026
Status: Valid
```

---

## 5.  Certificate Revocation

Only the contract owner can revoke a certificate.

After revocation, the certificate remains stored on the blockchain, but its status changes to invalid.

Example:

```text
✗ Certificate Revoked

Certificate ID: CERT005
Student: Rahul Sharma
Course: B.Sc Computer Science
Status: Revoked
```

This provides a permanent blockchain record of the certificate while preventing a revoked certificate from being considered valid.

---

## 6.  QR Code Verification

After issuing a certificate, the application automatically generates a QR code.

The QR code contains a verification URL such as:

```text
http://192.168.0.112:5500/verify.html?id=CERT005
```

When the QR code is scanned, the user is taken to the dedicated verification page.

The verification page:

- Reads the Certificate ID from the URL
- Connects to the blockchain
- Retrieves the certificate information
- Displays the certificate status
- Shows certificate details
- Displays the blockchain certificate hash

This allows certificate verification without requiring MetaMask on the verifier's device.

---

## 7.  Download QR Code

The generated QR code can be downloaded as a PNG image.

Example filename:

```text
CERT005-QR.png
```

---

## 8.  PDF Certificate Generation

The application can generate a downloadable PDF certificate containing certificate information.

The generated PDF includes:

- Certificate ID
- Student Name
- Course
- Issue Date
- Certificate Status
- Blockchain Certificate Hash
- Blockchain Transaction Hash
- Blockchain verification information

Example:

```text
Certificate ID: CERT005
Student: Rahul Sharma
Course: B.Sc Computer Science

VALID CERTIFICATE

Blockchain Certificate Hash:
0x87e679...

Blockchain Transaction Hash:
0xe41b5fb1...

✓ Certificate verification data stored on blockchain
```

The PDF is generated locally from the certificate information.

**The PDF file itself is not stored on the blockchain.**

---

## 9.  Copy Certificate Hash

The verification interface provides a convenient way to copy the certificate hash for further verification or record keeping.

---

## 10.  Modern Web3 Interface

The frontend uses a modern Web3-inspired interface featuring:

- Dark theme
- Glassmorphism-style cards
- Responsive layout
- Certificate status indicators
- Blockchain verification badges
- Mobile-friendly verification page
- Dedicated QR verification page

---

#  System Architecture

```text
                  ┌──────────────────────┐
                  │    Administrator     │
                  │      / Verifier      │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │    Web Frontend      │
                  │    HTML + CSS + JS   │
                  └──────────┬───────────┘
                             │
                             ▼
                       ┌─────────────┐
                       │   MetaMask  │
                       └──────┬──────┘
                              │
                              ▼
                  ┌──────────────────────┐
                  │   Hardhat Network    │
                  │    Chain ID 31337    │
                  └──────────┬───────────┘
                             │
                             ▼
             ┌───────────────────────────────┐
             │ CertificateVerification.sol  │
             └──────────────┬────────────────┘
                            │
                 ┌──────────┼──────────┐
                 ▼          ▼          ▼
               Issue      Verify     Revoke
                 │          │          │
                 └──────────┼──────────┘
                            │
                            ▼
                 Blockchain Certificate Data
                            │
                 ┌──────────┴──────────┐
                 ▼                     ▼
             QR Code                PDF
           Verification           Generation
```

---

#  Technologies Used

| Technology | Purpose |
|---|---|
| Solidity | Smart contract development |
| Hardhat 3 | Ethereum development and local blockchain |
| Viem | Blockchain interaction |
| MetaMask | Wallet connection and transaction signing |
| JavaScript | Frontend logic and blockchain integration |
| HTML | Frontend structure |
| CSS | Frontend styling |
| QRCode | QR code generation |
| jsPDF | PDF certificate generation |
| Node.js | Development environment |
| npm | Package management |
| Git | Version control |
| GitHub | Source code hosting |

---

#  Project Structure

```text
Decentralized-Certificate-Verification/
│
├── contracts/
│   └── CertificateVerification.sol
│
├── frontend/
│   ├── index.html
│   ├── verify.html
│   ├── app.js
│   └── style.css
│
├── ignition/
│   └── modules/
│       └── CertificateVerification.ts
│
├── scripts/
│   └── testCertificate.ts
│
├── .gitignore
├── README.md
├── hardhat.config.ts
├── package.json
├── package-lock.json
└── tsconfig.json
```

---

#  Smart Contract

The main smart contract is:

```text
contracts/CertificateVerification.sol
```

The contract provides three main operations.

---

## `issueCertificate()`

Creates a new certificate on the blockchain.

```solidity
function issueCertificate(
    string memory _certificateId,
    string memory _studentName,
    string memory _course,
    bytes32 _certificateHash
)
```

Only the contract owner can issue certificates.

---

## `verifyCertificate()`

Retrieves certificate information from the blockchain.

```solidity
function verifyCertificate(
    string memory _certificateId
)
```

The function returns:

- Student name
- Course
- Certificate hash
- Issue date
- Validity status

Certificate verification is publicly accessible.

---

## `revokeCertificate()`

Revokes an existing certificate.

```solidity
function revokeCertificate(
    string memory _certificateId
)
```

Only the contract owner can revoke certificates.

The certificate remains on the blockchain, but its validity status changes to invalid.

---

#  Access Control

The smart contract uses an owner-based access control mechanism.

Only the contract owner can:

- Issue certificates
- Revoke certificates

Anyone can:

- Verify certificates
- Access the QR verification page

This prevents unauthorized users from issuing or revoking certificates.

---

#  Certificate Data

A certificate is represented by:

```text
Certificate
│
├── Certificate ID
├── Student Name
├── Course
├── Certificate Hash
├── Issue Date
└── Validity Status
```

Example:

```text
Certificate ID: CERT005
Student Name: Rahul Sharma
Course: B.Sc Computer Science
Certificate Hash: 0x31fe...
Issue Date: 13 August 2026
Status: Valid
```

---

#  Installation

## 1. Clone the Repository

```bash
git clone https://github.com/HiKomal11/Decentralized-Certificate-Verification.git
```

## 2. Enter the Project Directory

```bash
cd Decentralized-Certificate-Verification
```

## 3. Install Dependencies

```bash
npm install
```

## 4. Compile the Smart Contract

```bash
npx hardhat compile
```

If compilation is successful, Hardhat will compile the Solidity contract.

---

#  Start the Local Blockchain

Open a terminal in the project directory and run:

```bash
npx hardhat node
```

Hardhat starts a local Ethereum-compatible blockchain.

Default local RPC endpoint:

```text
http://127.0.0.1:8545
```

Chain ID:

```text
31337
```

Hardhat also provides local test accounts containing test ETH.

---

#  Deploy the Smart Contract

Keep the Hardhat node running.

Open another terminal and run:

```bash
npx hardhat ignition deploy ignition/modules/CertificateVerification.ts --network localhost
```

A successful deployment will display the deployed contract address.

Example:

```text
CertificateVerificationModule#CertificateVerification

0x5FbDB2315678afecb367f032d93F642f64180aa3
```

The contract address can change when the local blockchain is restarted and the contract is redeployed.

---

#  MetaMask Setup

Add the local Hardhat network to MetaMask.

Use:

```text
Network Name: Hardhat Local
RPC URL: http://127.0.0.1:8545
Chain ID: 31337
Currency Symbol: ETH
```

For local testing, you can import one of the test accounts displayed by:

```bash
npx hardhat node
```

---

#  Security Warning

The private keys displayed by Hardhat's local node are publicly known test keys.

**Never use these accounts or private keys on:**

- Ethereum Mainnet
- Sepolia
- Any real blockchain
- Any account containing real funds

They are intended only for local development and testing.

---

#  Run the Frontend

The frontend is located inside:

```text
frontend/
```

It contains:

```text
index.html
verify.html
app.js
style.css
```

From the project directory:

```bash
cd frontend
```

Start a simple local web server:

```bash
python -m http.server 5500
```

Then open:

```text
http://127.0.0.1:5500
```

Make sure MetaMask is connected to:

```text
Hardhat Local
```

---

#  QR Verification on Local Network

The QR verification feature uses the computer's local network IP address so that another device on the same Wi-Fi network can scan the QR code.

Example:

```text
http://192.168.0.112:5500/verify.html?id=CERT005
```

The IP address may be different on another computer or network.

For QR verification from a phone:

1. Connect the phone and computer to the same Wi-Fi network.
2. Start the frontend server.
3. Generate a certificate.
4. Scan the generated QR code.
5. The phone opens the verification page.
6. The page retrieves the certificate information from the local blockchain.

---

#  How to Use the Application

## Step 1 — Connect MetaMask

Click:

```text
Connect MetaMask
```

The application displays:

- Connected wallet address
- User role

The role is automatically determined by comparing the connected wallet with the smart contract owner.

---

## Step 2 — Issue a Certificate

Enter:

```text
Certificate ID
Student Name
Course
```

Then click:

```text
Issue on Blockchain
```

MetaMask will request transaction confirmation.

After confirmation, the application displays the blockchain transaction hash.

The application also generates a QR code for the certificate.

---

## Step 3 — Download the QR Code

Click:

```text
Download QR Code
```

The QR code is downloaded as:

```text
CERT005-QR.png
```

---

## Step 4 — Generate PDF Certificate

After issuing the certificate, use the PDF generation option to create a downloadable certificate document.

The PDF contains blockchain-related verification information including:

- Certificate ID
- Student information
- Course
- Certificate hash
- Transaction hash
- Certificate status

---

## Step 5 — Verify the Certificate

Enter:

```text
CERT005
```

Then click:

```text
Verify Certificate
```

The application reads the certificate directly from the blockchain.

---

## Step 6 — Verify Using QR Code

Scan the certificate QR code.

The verification page opens automatically.

Example:

```text
Certificate Verification

✓ Valid Certificate

Certificate ID: CERT005
Student Name: Rahul Sharma
Course: B.Sc Computer Science
Issue Date: 13 August 2026

Certificate Hash:
0x31fe...

✓ Certificate data verified directly from blockchain
```

---

## Step 7 — Revoke the Certificate

The administrator enters:

```text
CERT005
```

and clicks:

```text
Revoke Certificate
```

MetaMask requests transaction confirmation.

After confirmation, the certificate becomes invalid.

---

## Step 8 — Verify Again

Verify:

```text
CERT005
```

The application displays:

```text
✗ Certificate Revoked
```

The original blockchain certificate data remains available, while its status indicates that it has been revoked.

---

#  Application Workflow

```text
              Administrator
                    │
                    ▼
             Connect MetaMask
                    │
                    ▼
          Enter Certificate Details
                    │
                    ▼
           Generate Certificate Hash
                    │
                    ▼
           Issue on Blockchain
                    │
                    ▼
            Smart Contract
                    │
                    ▼
       Certificate Stored On-Chain
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
       QR Code               PDF
          │                Generation
          ▼
    Verification URL
          │
          ▼
      Verify Page
          │
          ▼
   Blockchain Verification
          │
     ┌────┴────┐
     ▼         ▼
   Valid     Revoked
```

---

#  Testing Performed

The project has been tested successfully on a local Hardhat blockchain.

The following operations have been tested:

- Smart contract compilation
- Smart contract deployment
- MetaMask connection
- Network detection
- Administrator detection
- Verifier detection
- Certificate issuance
- Certificate hash generation
- Certificate verification
- Certificate revocation
- Verification after revocation
- Frontend-to-blockchain interaction
- QR code generation
- QR code download
- QR-based certificate verification
- Certificate hash copying
- PDF certificate generation
- PDF certificate download
- Blockchain transaction hash display
- Responsive verification interface

---

#  Advantages

### Security

Certificate verification data is stored on a blockchain and protected by the smart contract.

### Decentralized Verification

Certificate verification does not depend on a traditional centralized database.

### Fraud Reduction

Blockchain records make unauthorized modification and fabrication more difficult.

### Easy Verification

Certificates can be verified using a unique Certificate ID or QR code.

### QR-Based Verification

Users can scan a QR code to open the verification page directly.

### Cryptographic Integrity

Certificate hashes provide a cryptographic representation of certificate-related data.

### Transparency

Blockchain transactions provide a transparent record of certificate operations.

### Revocation

Certificates can be revoked by the authorized administrator while retaining their blockchain record.

---

# Current Limitations

This project currently uses a local Hardhat blockchain for development and demonstration.

Therefore:

- The blockchain is not publicly accessible.
- Blockchain data is reset when the local Hardhat network is restarted.
- The system currently has a single contract owner.
- Certificate PDF files are not stored on-chain.
- Certificate documents are not stored on IPFS.
- QR verification currently depends on local network accessibility.
- The application is intended for educational and demonstration purposes.

---

#  Future Improvements

Possible future improvements include:

- IPFS integration for certificate documents
- Multiple authorized certificate issuers
- Role-based access control
- University / college administration dashboard
- Certificate expiration
- Ethereum testnet deployment
- Public blockchain explorer integration
- Certificate management dashboard
- Email notifications
- Certificate analytics
- Cloud-based certificate storage
- Production deployment
- Enhanced certificate templates
- Digital signatures
- Multi-institution support

---

#  Real-World Applications

The system can be adapted for:

- Universities
- Colleges
- Schools
- Online education platforms
- Professional certification organizations
- Training institutes
- Corporate employee certification
- Skill certification platforms
- Government certificate verification systems

---

#  Project Highlights

This project demonstrates practical integration of:

```text
Blockchain
     +
Smart Contracts
     +
Web3
     +
MetaMask
     +
QR Verification
     +
Cryptographic Hashing
     +
PDF Generation
     +
Modern Web Interface
```

It combines blockchain technology with a user-friendly frontend to demonstrate a complete certificate lifecycle:

```text
Issue → Store → Verify → QR Verify → Generate PDF → Revoke
```

---

#  Author

**Komal Pandey**

GitHub:  
https://github.com/HiKomal11

Project Repository:  
https://github.com/HiKomal11/Decentralized-Certificate-Verification

---

#  License

This project is licensed under the **MIT License**.