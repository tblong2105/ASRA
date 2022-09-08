package com.asra.developer.models.payload.response;

import java.math.BigDecimal;
import java.util.Date;

public class InnkeeperContractResponse {

	private Long Id;

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

	private Long accountInnkeeperId;

	private Long accountTenantId;

	private int paymentDate;

	private Long roomDetailid;

	private String roomDetailName;

	private String paymentStatus;

	public String getPaymentStatus() {
		return paymentStatus;
	}

	public void setPaymentStatus(String paymentStatus) {
		this.paymentStatus = paymentStatus;
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

	public Long getAccountInnkeeperId() {
		return accountInnkeeperId;
	}

	public void setAccountInnkeeperId(Long accountInnkeeperId) {
		this.accountInnkeeperId = accountInnkeeperId;
	}

	public Long getAccountTenantId() {
		return accountTenantId;
	}

	public void setAccountTenantId(Long accountTenantId) {
		this.accountTenantId = accountTenantId;
	}

	public int getPaymentDate() {
		return paymentDate;
	}

	public void setPaymentDate(int paymentDate) {
		this.paymentDate = paymentDate;
	}

	public Long getId() {
		return Id;
	}

	public void setId(Long id) {
		Id = id;
	}

	public Long getRoomDetailid() {
		return roomDetailid;
	}

	public void setRoomDetailid(Long roomDetailid) {
		this.roomDetailid = roomDetailid;
	}

	public String getRoomDetailName() {
		return roomDetailName;
	}

	public void setRoomDetailName(String roomDetailName) {
		this.roomDetailName = roomDetailName;
	}

}
