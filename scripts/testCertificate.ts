import { network } from "hardhat";
import { keccak256, toBytes } from "viem";

async function main() {
  const { viem } = await network.connect();

  const certificate = await viem.getContractAt(
    "CertificateVerification",
    "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  );

  console.log("Contract connected successfully!");

  const certificateHash = keccak256(toBytes("CERT003"));

  console.log("Certificate Hash:", certificateHash);

  await certificate.write.issueCertificate([
    "CERT003",
    "Aarav Sharma",
    "B.Tech Computer Science",
    certificateHash,
  ]);

  console.log("Certificate transaction sent!");

  const result = await certificate.read.verifyCertificate([
    "CERT003",
  ]);

  console.log("\nCertificate Details:");
  console.log("Student Name:", result[0]);
  console.log("Course:", result[1]);
  console.log("Certificate Hash:", result[2]);
  console.log("Issue Date:", result[3].toString());
  console.log("Is Valid:", result[4]);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});