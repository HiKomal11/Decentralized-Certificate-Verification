#  CertiChain — Decentralized Certificate Verification

A blockchain-based certificate issuing, verification, revocation, QR verification, and PDF generation system built using **Solidity, Hardhat, Viem, JavaScript, HTML, CSS, MetaMask, and Ethereum Sepolia**.

CertiChain demonstrates how blockchain technology can be used to create a **tamper-resistant and publicly verifiable certificate system** without depending on a traditional centralized database.

##  Live Application

**Production:**
https://certichain-verify.vercel.app

**GitHub Repository:**
https://github.com/HiKomal11/Decentralized-Certificate-Verification

**Network:** Ethereum Sepolia Testnet
**Chain ID:** `11155111`

---

#  Project Overview

Traditional academic certificates can be forged, altered, or difficult for organizations to verify.

CertiChain provides a decentralized certificate management system where an authorized administrator can:

*  Issue certificates
*  Store certificate verification data on blockchain
*  Generate cryptographic certificate hashes
*  Verify certificates directly from blockchain
*  Revoke certificates
*  Generate QR codes for verification
*  Generate downloadable PDF certificates
*  Display blockchain transaction hashes
*  Connect securely through MetaMask

Certificate verification data is stored in a Solidity smart contract deployed on the **Ethereum Sepolia Testnet**.

---

#  Features

## 1.  MetaMask Wallet Connection

Users can connect their MetaMask wallet to CertiChain.

The application:

* Detects the connected wallet
* Checks the Sepolia network
* Reads the smart contract owner
* Determines the user's role
* Displays administrator or verifier access

### User Roles

**Administrator**

* Issue certificates
* Revoke certificates

**Verifier**

* Verify certificates

Certificate verification can be performed without requiring administrator privileges.

---

# 2.  Issue Certificate

The administrator can create a certificate by entering:

* Certificate ID
* Student Name
* Course / Program

Example:

```text
Certificate ID: CERT005
Student Name: Rahul Sharma
Course: B.Sc Computer Science
```

The application generates a Keccak-256 certificate hash and submits the certificate data to the smart contract.

After blockchain confirmation, the transaction hash is displayed.

---

# 3.  Blockchain Certificate Hash

Each certificate contains a `bytes32` cryptographic hash.

Example:

```text
0x87e6793d6e45cd87b1ee25097e4180c0ce742a0e4c90453025fd861ee7aeb3ff
```

The hash provides a cryptographic representation of the certificate-related data and can help detect changes to the original information.

---

# 4.  Certificate Verification

Anyone can verify a certificate using its Certificate ID.

The blockchain returns:

* Student Name
* Course
* Certificate Hash
* Issue Date
* Validity Status

Example:

```text
✓ Valid Certificate

Certificate ID: CERT005
Student: Rahul Sharma
Course: B.Sc Computer Science
Certificate Hash: 0x87e679...
Issue Date: 14 August 2026
Status: Valid
```

The verification data is retrieved directly from the deployed smart contract.

---

# 5.  Certificate Revocation

Only the smart contract owner can revoke certificates.

When a certificate is revoked:

```text
✗ Certificate Revoked

Certificate ID: CERT005
Student: Rahul Sharma
Course: B.Sc Computer Science
Status: Revoked
```

The certificate record remains on the blockchain, while its `isValid` status becomes `false`.

This preserves the historical record while preventing the revoked certificate from being treated as valid.

---

# 6.  QR Code Verification

After issuing a certificate, CertiChain automatically generates a QR code.

The QR code contains a verification URL similar to:

```text
https://certichain-verify.vercel.app/verify.html?id=CERT005
```

When scanned, the user is taken directly to the certificate verification page.

The verification page:

1. Reads the Certificate ID from the URL
2. Connects to the Sepolia blockchain through a public RPC
3. Retrieves the certificate information
4. Displays the certificate status
5. Shows the certificate hash
6. Displays the issue date

This allows certificate verification from a phone or computer without requiring the verifier to be the contract owner.

---

# 7.  Download QR Code

Generated QR codes can be downloaded as PNG images.

Example:

```text
CERT005-QR.png
```

---

# 8.  PDF Certificate Generation

CertiChain can generate a downloadable PDF certificate after successful certificate issuance.

The PDF contains:

* Certificate ID
* Student Name
* Course
* Issue Date
* Certificate Hash
* Blockchain Transaction Hash
* Certificate status
* QR verification code
* Blockchain verification information

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

Certificate verification data stored on blockchain
```

**Important:** The generated PDF itself is **not stored on the blockchain**. The PDF is generated locally in the user's browser.

---

# 9.  Certificate Hash Copying

The verification interface provides a convenient option to copy the certificate hash for further verification or record keeping.

---

# 10.  Modern Web3 Interface

The frontend provides a modern Web3-inspired interface featuring:

* Dark theme
* Glassmorphism-style cards
* Responsive layout
* Certificate status indicators
* Blockchain verification badges
* Mobile-friendly verification page
* QR-based verification
* Administrator controls
* Blockchain transaction information

---

#  System Architecture

```text
                    ┌──────────────────────┐
                    │ Administrator /      │
                    │ Verifier             │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    Web Frontend      │
                    │   HTML + CSS + JS    │
                    └──────────┬───────────┘
                               │
                  ┌────────────┴────────────┐
                  ▼                         ▼
           ┌─────────────┐          ┌──────────────┐
           │  MetaMask   │          │ Public RPC   │
           │ Transactions│          │   Provider   │
           └──────┬──────┘          └──────┬───────┘
                  │                        │
                  └────────────┬───────────┘
                               ▼
                    ┌──────────────────────┐
                    │ Ethereum Sepolia     │
                    │ Testnet              │
                    └──────────┬───────────┘
                               │
                               ▼
              ┌──────────────────────────────┐
              │ CertificateVerification.sol │
              └──────────────┬───────────────┘
                             │
                 ┌───────────┼───────────┐
                 ▼           ▼           ▼
               Issue       Verify      Revoke
                 │           │           │
                 └───────────┼───────────┘
                             │
                             ▼
                   Blockchain Certificate
                          Data
                             │
                    ┌────────┴────────┐
                    ▼                 ▼
                 QR Code             PDF
              Verification        Generation
```

---

#  Technologies Used

| Technology       | Purpose                                   |
| ---------------- | ----------------------------------------- |
| Solidity         | Smart contract development                |
| Hardhat 3        | Ethereum development and testing          |
| Ethereum Sepolia | Blockchain deployment                     |
| Viem             | Blockchain interaction                    |
| MetaMask         | Wallet connection and transaction signing |
| JavaScript       | Frontend logic                            |
| HTML             | Frontend structure                        |
| CSS              | Frontend styling                          |
| QRCode           | QR code generation                        |
| jsPDF            | PDF certificate generation                |
| Node.js          | Development environment                   |
| npm              | Package management                        |
| Git              | Version control                           |
| GitHub           | Source code hosting                       |
| Vercel           | Production frontend deployment            |

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

The contract provides three primary operations.

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

Returns:

* Student Name
* Course
* Certificate Hash
* Issue Date
* Validity Status

The function is publicly accessible.

---

## `revokeCertificate()`

Revokes an existing certificate.

```solidity
function revokeCertificate(
    string memory _certificateId
)
```

Only the contract owner can revoke certificates.

The certificate remains stored on-chain while its validity status becomes `false`.

---

#  Access Control

CertiChain uses owner-based access control.

Only the contract owner can:

* Issue certificates
* Revoke certificates

Anyone can:

* Verify certificates
* Access the verification page
* Verify certificates through QR codes

This prevents unauthorized users from issuing or revoking certificates.

---

#  Sepolia Deployment

The production application uses the **Ethereum Sepolia Testnet**.

```text
Network: Ethereum Sepolia
Chain ID: 11155111
```

Smart contract:

```text
0xAd731be07A648F67ceE32117AD5C8fFC592A10bb
```

The application uses the Sepolia contract for certificate issuance, verification, and revocation.

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

---

#  Local Development

The project can also be tested using a local Hardhat blockchain.

Start the local blockchain:

```bash
npx hardhat node
```

Default RPC:

```text
http://127.0.0.1:8545
```

Chain ID:

```text
31337
```

Deploy the contract:

```bash
npx hardhat ignition deploy ignition/modules/CertificateVerification.ts --network localhost
```

The local contract address will be displayed after deployment.

> The local contract address can change when the Hardhat blockchain is restarted and the contract is redeployed.

---

#  MetaMask Setup for Local Development

For local testing, add the Hardhat network to MetaMask:

```text
Network Name: Hardhat Local
RPC URL: http://127.0.0.1:8545
Chain ID: 31337
Currency Symbol: ETH
```

For local development, Hardhat provides test accounts containing test ETH.

###  Security Warning

Hardhat private keys are publicly known development keys.

**Never use Hardhat test accounts on:**

* Ethereum Mainnet
* Sepolia
* Any production blockchain
* Accounts containing real funds

---

#  Run the Frontend Locally

The frontend is located in:

```text
frontend/
```

Run:

```bash
cd frontend
python -m http.server 5500
```

Then open:

```text
http://127.0.0.1:5500
```

For local development, MetaMask must be connected to the corresponding local Hardhat network and the frontend must use the locally deployed contract address.

---

#  Production Deployment

The current frontend is deployed using **Vercel**.

Production URL:

```text
https://certichain-verify.vercel.app
```

The production frontend connects to the Ethereum Sepolia Testnet.

Production deployment workflow:

```text
GitHub Repository
       │
       ▼
     main
       │
       ▼
     Vercel
       │
       ▼
Production Frontend
       │
       ▼
Ethereum Sepolia
       │
       ▼
Smart Contract
```

Every update pushed to the `main` branch can trigger a new Vercel deployment.

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

#  Certificate Lifecycle

```text
Issue
  ↓
Store on Blockchain
  ↓
Generate QR Code
  ↓
Generate PDF
  ↓
Verify
  ↓
Revoke if Required
  ↓
Verify Again
  ↓
Revoked Status
```

---

#  Testing Performed

The following functionality has been tested:

* Smart contract compilation
* Smart contract deployment
* MetaMask connection
* Sepolia network detection
* Administrator detection
* Verifier access
* Certificate issuance
* Certificate hash generation
* Certificate verification
* Certificate revocation
* Verification after revocation
* Frontend-to-blockchain interaction
* QR code generation
* QR code download
* QR-based verification
* Certificate hash copying
* PDF certificate generation
* PDF certificate download
* Blockchain transaction hash display
* Production Vercel deployment
* Responsive verification interface

---

#  Advantages

###  Security

Certificate verification data is protected by blockchain and smart-contract rules.

###  Public Verification

Certificate information can be verified directly from the blockchain.

###  Fraud Reduction

Blockchain records make unauthorized modification of stored certificate information significantly more difficult.

###  QR Verification

A certificate can contain a QR code that directly opens its verification page.

###  Cryptographic Integrity

Certificate-related data is represented using a cryptographic hash.

###  Transparency

Blockchain transactions provide a transparent record of certificate operations.

###  Revocation

Authorized administrators can revoke certificates while preserving their blockchain record.

###  Decentralized Verification

Verification does not require a traditional centralized certificate database.

---

#  Current Limitations

Although CertiChain is deployed on Ethereum Sepolia, it is currently an **educational/testnet project**.

Current limitations include:

* Sepolia is a test network rather than Ethereum Mainnet.
* The system currently uses a single contract owner.
* Certificate PDF files are not stored on-chain.
* Certificate documents are not currently stored on IPFS.
* The current smart contract uses owner-based access control.
* Production use would require stronger identity and access management.
* Testnet availability depends on the Sepolia network and RPC provider.
* The project is intended for educational and demonstration purposes.

---

#  Future Improvements

Possible future improvements include:

*  IPFS integration for certificate documents
*  Multiple authorized certificate issuers
*  Role-based access control
*  University/college administration dashboard
*  Certificate expiration
*  Blockchain explorer integration
*  Certificate management dashboard
*  Email notifications
*  Certificate analytics
*  Multi-institution support
*  Digital signatures
*  Advanced certificate templates
*  Improved identity management
*  Enhanced mobile verification
*  Ethereum Mainnet deployment after appropriate security auditing

---

#  Real-World Applications

CertiChain can be adapted for:

* Universities
* Colleges
* Schools
* Online education platforms
* Professional certification organizations
* Training institutes
* Corporate employee certification
* Skill certification platforms
* Government certificate verification systems

---

#  Project Highlights

CertiChain combines:

```text
Blockchain
     +
Smart Contracts
     +
Web3
     +
MetaMask
     +
Ethereum Sepolia
     +
Cryptographic Hashing
     +
QR Verification
     +
PDF Generation
     +
Modern Web Interface
```

The complete certificate lifecycle is:

```text
Issue → Store → Verify → QR Verify → Generate PDF → Revoke
```

---

#  Author

## Komal Pandey

GitHub:

https://github.com/HiKomal11

Project Repository:

https://github.com/HiKomal11/Decentralized-Certificate-Verification

---

#  License

This project is licensed under the **MIT License**.

---
