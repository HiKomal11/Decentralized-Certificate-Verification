// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CertificateVerification {

    address public owner;

    struct Certificate {
        string certificateId;
        string studentName;
        string course;
        bytes32 certificateHash;
        uint256 issueDate;
        bool isValid;
    }

    mapping(string => Certificate) private certificates;

    event CertificateIssued(
        string certificateId,
        string studentName,
        string course,
        bytes32 certificateHash,
        uint256 issueDate
    );

    event CertificateRevoked(
        string certificateId
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function issueCertificate(
        string memory _certificateId,
        string memory _studentName,
        string memory _course,
        bytes32 _certificateHash
    ) public onlyOwner {

        require(
            bytes(_certificateId).length > 0,
            "Certificate ID cannot be empty"
        );

        require(
            bytes(certificates[_certificateId].certificateId).length == 0,
            "Certificate already exists"
        );

        certificates[_certificateId] = Certificate({
            certificateId: _certificateId,
            studentName: _studentName,
            course: _course,
            certificateHash: _certificateHash,
            issueDate: block.timestamp,
            isValid: true
        });

        emit CertificateIssued(
            _certificateId,
            _studentName,
            _course,
            _certificateHash,
            block.timestamp
        );
    }

    function verifyCertificate(
        string memory _certificateId
    )
        public
        view
        returns (
            string memory studentName,
            string memory course,
            bytes32 certificateHash,
            uint256 issueDate,
            bool isValid
        )
    {
        Certificate memory certificate = certificates[_certificateId];

        require(
            bytes(certificate.certificateId).length > 0,
            "Certificate not found"
        );

        return (
            certificate.studentName,
            certificate.course,
            certificate.certificateHash,
            certificate.issueDate,
            certificate.isValid
        );
    }

    function revokeCertificate(
        string memory _certificateId
    ) public onlyOwner {

        require(
            bytes(certificates[_certificateId].certificateId).length > 0,
            "Certificate not found"
        );

        require(
            certificates[_certificateId].isValid,
            "Certificate already revoked"
        );

        certificates[_certificateId].isValid = false;

        emit CertificateRevoked(_certificateId);
    }
}