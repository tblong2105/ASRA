package com.asra.developer.models.payload.response;

import java.math.BigDecimal;
import java.util.Date;

public class DetailContractResponse {

	private Long contractId;

	private Long billId;

	private Long tenantId;

	private Long innkeeperId;

	private Date contractCreateDate;

	private String contractCreateAddress;

	private BigDecimal rentalPrice;

	private BigDecimal deposit;

	private BigDecimal electronicPrice;

	private BigDecimal waterPrice;

	private BigDecimal internetPrice;

	private String paymentType;

	private Date startDate;

	private Date endDate;

	private String tenantName;

	private Date tenantBirthday;

	private String tenantPermanentResidence;

	private String tenantIcNo;

	private Date tenantIcIssueDate;

	private String tenantIcIssueLoc;

	private String tenantPhoneNumber;

	private String innkeeperResponsibility;

	private String tenantResponsibility;

	private String commonResponsibility;

	private String status;

	private String innkeeperBirthdate;

	private String innkeeperDateOfIssuanceOfIdentityCard;

	private String innkeeperIdentityCardNo;

	private String innkeeperName;

	private String innkeeperPermanentResidence;

	private String innkeeperPhoneNumber;

	private String innkeeperThePlaceIdentityCard;
	
	private String innkeeperSignature;
	
	private String tenantSignature;

	public Long getTenantId() {
		return tenantId;
	}

	public void setTenantId(Long tenantId) {
		this.tenantId = tenantId;
	}

	
	public String getInnkeeperSignature() {
		return innkeeperSignature;
	}

	public void setInnkeeperSignature(String innkeeperSignature) {
		this.innkeeperSignature = innkeeperSignature;
	}

	public String getTenantSignature() {
		return tenantSignature;
	}

	public void setTenantSignature(String tenantSignature) {
		this.tenantSignature = tenantSignature;
	}

	public Long getInnkeeperId() {
		return innkeeperId;
	}

	public void setInnkeeperId(Long innkeeperId) {
		this.innkeeperId = innkeeperId;
	}

	public Long getContractId() {
		return contractId;
	}

	public void setContractId(Long contractId) {
		this.contractId = contractId;
	}

	public Long getBillId() {
		return billId;
	}

	public void setBillId(Long billId) {
		this.billId = billId;
	}

	public Date getContractCreateDate() {
		return contractCreateDate;
	}

	public void setContractCreateDate(Date contractCreateDate) {
		this.contractCreateDate = contractCreateDate;
	}

	public String getContractCreateAddress() {
		return contractCreateAddress;
	}

	public void setContractCreateAddress(String contractCreateAddress) {
		this.contractCreateAddress = contractCreateAddress;
	}

	public BigDecimal getRentalPrice() {
		return rentalPrice;
	}

	public void setRentalPrice(BigDecimal rentalPrice) {
		this.rentalPrice = rentalPrice;
	}

	public BigDecimal getDeposit() {
		return deposit;
	}

	public void setDeposit(BigDecimal deposit) {
		this.deposit = deposit;
	}

	public BigDecimal getElectronicPrice() {
		return electronicPrice;
	}

	public void setElectronicPrice(BigDecimal electronicPrice) {
		this.electronicPrice = electronicPrice;
	}

	public BigDecimal getWaterPrice() {
		return waterPrice;
	}

	public void setWaterPrice(BigDecimal waterPrice) {
		this.waterPrice = waterPrice;
	}

	public BigDecimal getInternetPrice() {
		return internetPrice;
	}

	public void setInternetPrice(BigDecimal internetPrice) {
		this.internetPrice = internetPrice;
	}

	public String getPaymentType() {
		return paymentType;
	}

	public void setPaymentType(String paymentType) {
		this.paymentType = paymentType;
	}

	public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	public String getTenantName() {
		return tenantName;
	}

	public void setTenantName(String tenantName) {
		this.tenantName = tenantName;
	}

	public Date getTenantBirthday() {
		return tenantBirthday;
	}

	public void setTenantBirthday(Date tenantBirthday) {
		this.tenantBirthday = tenantBirthday;
	}

	public String getTenantPermanentResidence() {
		return tenantPermanentResidence;
	}

	public void setTenantPermanentResidence(String tenantPermanentResidence) {
		this.tenantPermanentResidence = tenantPermanentResidence;
	}

	public String getTenantIcNo() {
		return tenantIcNo;
	}

	public void setTenantIcNo(String tenantIcNo) {
		this.tenantIcNo = tenantIcNo;
	}

	public Date getTenantIcIssueDate() {
		return tenantIcIssueDate;
	}

	public void setTenantIcIssueDate(Date tenantIcIssueDate) {
		this.tenantIcIssueDate = tenantIcIssueDate;
	}

	public String getTenantIcIssueLoc() {
		return tenantIcIssueLoc;
	}

	public void setTenantIcIssueLoc(String tenantIcIssueLoc) {
		this.tenantIcIssueLoc = tenantIcIssueLoc;
	}

	public String getTenantPhoneNumber() {
		return tenantPhoneNumber;
	}

	public void setTenantPhoneNumber(String tenantPhoneNumber) {
		this.tenantPhoneNumber = tenantPhoneNumber;
	}

	public String getInnkeeperResponsibility() {
		return innkeeperResponsibility;
	}

	public void setInnkeeperResponsibility(String innkeeperResponsibility) {
		this.innkeeperResponsibility = innkeeperResponsibility;
	}

	public String getTenantResponsibility() {
		return tenantResponsibility;
	}

	public void setTenantResponsibility(String tenantResponsibility) {
		this.tenantResponsibility = tenantResponsibility;
	}

	public String getCommonResponsibility() {
		return commonResponsibility;
	}

	public void setCommonResponsibility(String commonResponsibility) {
		this.commonResponsibility = commonResponsibility;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getInnkeeperBirthdate() {
		return innkeeperBirthdate;
	}

	public void setInnkeeperBirthdate(String innkeeperBirthdate) {
		this.innkeeperBirthdate = innkeeperBirthdate;
	}

	public String getInnkeeperDateOfIssuanceOfIdentityCard() {
		return innkeeperDateOfIssuanceOfIdentityCard;
	}

	public void setInnkeeperDateOfIssuanceOfIdentityCard(String innkeeperDateOfIssuanceOfIdentityCard) {
		this.innkeeperDateOfIssuanceOfIdentityCard = innkeeperDateOfIssuanceOfIdentityCard;
	}

	public String getInnkeeperIdentityCardNo() {
		return innkeeperIdentityCardNo;
	}

	public void setInnkeeperIdentityCardNo(String innkeeperIdentityCardNo) {
		this.innkeeperIdentityCardNo = innkeeperIdentityCardNo;
	}

	public String getInnkeeperName() {
		return innkeeperName;
	}

	public void setInnkeeperName(String innkeeperName) {
		this.innkeeperName = innkeeperName;
	}

	public String getInnkeeperPermanentResidence() {
		return innkeeperPermanentResidence;
	}

	public void setInnkeeperPermanentResidence(String innkeeperPermanentResidence) {
		this.innkeeperPermanentResidence = innkeeperPermanentResidence;
	}

	public String getInnkeeperPhoneNumber() {
		return innkeeperPhoneNumber;
	}

	public void setInnkeeperPhoneNumber(String innkeeperPhoneNumber) {
		this.innkeeperPhoneNumber = innkeeperPhoneNumber;
	}

	public String getInnkeeperThePlaceIdentityCard() {
		return innkeeperThePlaceIdentityCard;
	}

	public void setInnkeeperThePlaceIdentityCard(String innkeeperThePlaceIdentityCard) {
		this.innkeeperThePlaceIdentityCard = innkeeperThePlaceIdentityCard;
	}

}
