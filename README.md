#  Decentralized Certificate Verification

A blockchain-based certificate issuing, verification, and revocation system built using **Solidity, Hardhat, Viem, and MetaMask**.

---

##  Project Overview
Traditional certificates can be forged, altered, or difficult to verify.
This project uses blockchain technology to provide a decentralized system where authorized administrators can:
-  Issue digital certificates
-  Verify certificate authenticity
-  Revoke certificates
-  Store certificate hashes on the blockchain
-  Use MetaMask for blockchain transactions
Once a certificate is issued, its verification data is stored in a Solidity smart contract.
---

##  Features
###  Issue Certificate
An authorized administrator can issue a certificate by providing:
- Certificate ID
- Student name
- Course
- Certificate hash

Example:
```text
Certificate ID: CERT005
Student: Rahul Sharma
Course: B.Sc Computer Science
```
### Verify Certificate
Anyone can enter a certificate ID to retrieve its blockchain-stored information.
The system displays:
Student name
Course
Certificate hash
Issue date
Certificate status

 ###  Revoke Certificate
Only the contract owner can revoke certificates.
After revocation, verification displays:   Revoked Certificate

 ## System Architecture
                 ┌──────────────────────┐
                 │      User/Admin      │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │   Web Frontend       │
                 │ HTML + CSS + JS      │
                 └──────────┬───────────┘
                            │
                            ▼
                     ┌─────────────┐
                     │  MetaMask   │
                     └──────┬──────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │   Hardhat Network   │
                 │     Chain ID 31337  │
                 └──────────┬───────────┘
                            │
                            ▼
              ┌────────────────────────────┐
              │ CertificateVerification.sol│
              └────────────┬───────────────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
           Issue        Verify       Revoke

## Technologies Used
| Technology   | Purpose                                   |
| ------------ | ----------------------------------------- |
| Solidity     | Smart contract development                |
| Hardhat 3    | Ethereum development and local blockchain |
| Viem         | Blockchain interaction                    |
| MetaMask     | Wallet and transaction signing            |
| JavaScript   | Frontend blockchain integration           |
| HTML         | Frontend structure                        |
| CSS          | Frontend styling                          |
| Git & GitHub | Version control                           |

## Project Structure
Decentralized-Certificate-Verification/
│
├── contracts/
│   └── CertificateVerification.sol
│
├── frontend/
│   ├── index.html
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
├── hardhat.config.ts
├── package.json
├── package-lock.json
└── tsconfig.json

## Smart Contract
The main smart contract is:
contracts/CertificateVerification.sol
The contract contains three main functions:
### issueCertificate()
Creates a new certificate on the blockchain.
function issueCertificate(
    string memory _certificateId,
    string memory _studentName,
    string memory _course,
    bytes32 _certificateHash
)
Only the contract owner can issue certificates.

### verifyCertificate()
Retrieves certificate information from the blockchain.
function verifyCertificate(
    string memory _certificateId
)
The function returns:
Student name
Course
Certificate hash
Issue date
Validity status
Certificate verification is publicly accessible.

### revokeCertificate()
Revokes an existing certificate.
function revokeCertificate(
    string memory _certificateId
)
Only the contract owner can revoke certificates.
Once revoked, the certificate remains on the blockchain but its status changes to invalid.

 ### Certificate Hash
Each certificate contains a bytes32 cryptographic hash.
Example:
0x31fe5a8c0e0c0799abc5fbfcfe6e587068cdb512c7f9f807c7559a02f172c19b

The hash provides a cryptographic representation of certificate-related data and can be used to help detect tampering.

 ## Installation
### 1. Clone the Repository
git clone https://github.com/HiKomal11/Decentralized-Certificate-Verification.git
### 2. Enter the Project Directory
cd Decentralized-Certificate-Verification
### 3. Install Dependencies
npm install
### 4. Compile the Smart Contract
Run: npx hardhat compile
If compilation is successful, Hardhat will compile the Solidity contract.
### 5. Start the Local Blockchain
Open a terminal in the project directory and run:  npx hardhat node
Hardhat will start a local Ethereum-compatible blockchain.
The local RPC endpoint is: http://127.0.0.1:8545
The local Chain ID is: 31337
Hardhat also provides local test accounts containing test ETH.
### 6. Deploy the Smart Contract
Keep the Hardhat node running.
Open another terminal in the project directory and run:
npx hardhat ignition deploy ignition/modules/CertificateVerification.ts --network localhost
A successful deployment will display the deployed contract address.
Example:
CertificateVerificationModule#CertificateVerification
- 0x5FbDB2315678afecb367f032d93F642f64180aa3
The contract address can change whenever the local blockchain is restarted and the contract is redeployed.

## MetaMask Setup
Add the local Hardhat network to MetaMask.
Use the following configuration:
Network Name: Hardhat Local
RPC URL: http://127.0.0.1:8545
Chain ID: 31337
Currency Symbol: ETH
For local development, you can import one of the test accounts displayed by:
npx hardhat node

## Important Security Warning
The private keys displayed by Hardhat's local node are publicly known test keys.
Never use these accounts or private keys on:
Ethereum Mainnet
Sepolia
Any real blockchain
Any account containing real funds
They are only for local development and testing.

 ## Run the Frontend
The frontend is located inside:
frontend/
It contains:
index.html
app.js
style.css
From the project directory, run: cd frontend
Then start a simple local web server: python -m http.server 5500
Open the application in your browser: http://127.0.0.1:5500
Make sure MetaMask is connected to: Hardhat Local

## How to Use the Application
### Step 1: Connect MetaMask
Click: Connect MetaMask
The connected wallet address will be displayed.

### Step 2: Issue a Certificate
Enter:
Certificate ID
Student Name
Course
Then click: Issue Certificate
The transaction will be sent to the blockchain.
Example:
Certificate ID: CERT005
Student: Rahul Sharma
Course: B.Sc Computer Science
After successful confirmation, the application displays the transaction hash.

### Step 3: Verify the Certificate
Enter the certificate ID: CERT005
Click: Verify Certificate
The blockchain returns the certificate details.
Example:
 Valid Certificate
Student: Rahul Sharma
Course: B.Sc Computer Science
Certificate Hash: 0x31fe...
Issue Date: ...
Status: Valid

### Step 4: Revoke the Certificate
Enter the certificate ID: CERT005
Click: Revoke Certificate
The administrator's wallet will request a transaction confirmation.
After the transaction is confirmed, the certificate status becomes invalid.

### Step 5: Verify Again
Enter: CERT005
and click: Verify Certificate
The application will display:
 Revoked Certificate
Student: Rahul Sharma
Course: B.Sc Computer Science
Certificate Hash: 0x31fe...
Status: Revoked

## Application Workflow
Administrator
      │
      ▼
Connect MetaMask
      │
      ▼
Enter Certificate Details
      │
      ▼
Issue Certificate
      │
      ▼
Smart Contract
      │
      ▼
Certificate Stored on Blockchain
      │
      ▼
User Enters Certificate ID
      │
      ▼
Verify Certificate
      │
      ├───────────────┐
      ▼               ▼
   Valid            Revoked
      │               │
      ▼               ▼
   Valid            Revoked
  Access Control

The smart contract uses an owner-based access control mechanism.
Only the contract owner can:
- Issue Certificate
- Revoke Certificate
Certificate verification is publicly accessible.
This ensures that unauthorized users cannot issue or revoke certificates.
 Example Smart Contract Data

A certificate is represented by:
Certificate
│
├── Certificate ID
├── Student Name
├── Course
├── Certificate Hash
├── Issue Date
└── Validity Status

Example:
Certificate ID: CERT005
Student Name: Rahul Sharma
Course: B.Sc Computer Science
Certificate Hash: 0x31fe...
Issue Date: 13 August 2026
Status: Valid

## Testing Performed
The project has been tested on a local Hardhat blockchain.
The following operations were successfully tested:
 - Smart contract compilation
 - Smart contract deployment
 - MetaMask connection
 - Certificate issuance
 - Certificate verification
 - Certificate revocation
 - Verification after revocation
 - Frontend-to-blockchain interaction
 ## Advantages
 - Security
Certificate records are stored on a blockchain and are resistant to unauthorized modification.
 - Decentralized Verification
Certificate verification does not require a centralized database.
 - Fraud Reduction
Blockchain records make it more difficult to create or modify fake certificate records.
 - Easy Verification
A certificate can be checked using its unique certificate ID.
 - Transparency
Blockchain transactions provide a transparent record of certificate operations.

## Current Limitations
This project currently uses a local Hardhat blockchain for development and testing.
Therefore:
The blockchain is not publicly accessible.
Data is lost when the local blockchain is reset.
The system currently has a single owner/admin.
Certificate files themselves are not stored on-chain.
The project is intended for educational and demonstration purposes.

## Future Improvements
Possible future improvements include:
-  Mobile-friendly interface
-  QR code certificate verification
-  Automatic PDF certificate generation
-  IPFS integration for certificate documents
-  Multiple authorized certificate issuers
-  Role-based access control
-  University/college administration dashboard
-  Certificate expiration
-  Deployment to an Ethereum testnet
-  Certificate management dashboard
-  Certificate verification notifications

## Real-World Applications
The system can be adapted for:
- Universities
- Colleges
- Schools
- Online education platforms
- Professional certification organizations
- Training institutes
- Corporate employee certification

## Technologies
### Frontend:
- HTML
- CSS
- JavaScript
### Blockchain:
- Ethereum-compatible blockchain
- Solidity
- Hardhat
### Blockchain Interaction:
- Viem
- MetaMask
### Development:
- Node.js
- npm
- Git
- GitHub

## Author
Komal Pandey
GitHub: [HiKomal11](https://github.com/HiKomal11)
Project Repository: [Decentralized Certificate Verification](https://github.com/HiKomal11/Decentralized-Certificate-Verification)

 ## License
This project is licensed under the MIT License.
