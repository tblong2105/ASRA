package com.asra.developer.models.payload.response;

import java.math.BigDecimal;

public class BillDetailResponse {

	private String billPayeeName;

	private Long billPayeeId;

	private String billPayeeAddress;

	private String billPayerName;

	private Long billPayerId;

	private String billPayerAddesss;

	private String contractCreateAddress;

	private Long contractId;

	private String contractStatus;

	private int year;

	private int month;

	private BigDecimal depositHolder;

	private BigDecimal deposit;

	private BigDecimal rentalPrice;

	private BigDecimal electronicPrice;

	private BigDecimal waterPrice;

	private BigDecimal internetPrice;

	private BigDecimal totalBill;

	private String type;

	private String describe;

	private int dues;

	private int kw;

	private int capacity;

	public String getBillPayeeName() {
		return billPayeeName;
	}

	public void setBillPayeeName(String billPayeeName) {
		this.billPayeeName = billPayeeName;
	}

	public Long getBillPayeeId() {
		return billPayeeId;
	}

	public void setBillPayeeId(Long billPayeeId) {
		this.billPayeeId = billPayeeId;
	}

	public String getBillPayerName() {
		return billPayerName;
	}

	public void setBillPayerName(String billPayerName) {
		this.billPayerName = billPayerName;
	}

	public Long getBillPayerId() {
		return billPayerId;
	}

	public void setBillPayerId(Long billPayerId) {
		this.billPayerId = billPayerId;
	}

	public String getContractCreateAddress() {
		return contractCreateAddress;
	}

	public void setContractCreateAddress(String contractCreateAddress) {
		this.contractCreateAddress = contractCreateAddress;
	}

	public Long getContractId() {
		return contractId;
	}

	public void setContractId(Long contractId) {
		this.contractId = contractId;
	}

	public String getContractStatus() {
		return contractStatus;
	}

	public void setContractStatus(String contractStatus) {
		this.contractStatus = contractStatus;
	}

	public int getYear() {
		return year;
	}

	public void setYear(int year) {
		this.year = year;
	}

	public int getMonth() {
		return month;
	}

	public void setMonth(int month) {
		this.month = month;
	}

	public BigDecimal getDepositHolder() {
		return depositHolder;
	}

	public void setDepositHolder(BigDecimal depositHolder) {
		this.depositHolder = depositHolder;
	}

	public BigDecimal getDeposit() {
		return deposit;
	}

	public void setDeposit(BigDecimal deposit) {
		this.deposit = deposit;
	}

	public BigDecimal getRentalPrice() {
		return rentalPrice;
	}

	public void setRentalPrice(BigDecimal rentalPrice) {
		this.rentalPrice = rentalPrice;
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

	public BigDecimal getTotalBill() {
		return totalBill;
	}

	public void setTotalBill(BigDecimal totalBill) {
		this.totalBill = totalBill;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getBillPayeeAddress() {
		return billPayeeAddress;
	}

	public void setBillPayeeAddress(String billPayeeAddress) {
		this.billPayeeAddress = billPayeeAddress;
	}

	public String getBillPayerAddesss() {
		return billPayerAddesss;
	}

	public void setBillPayerAddesss(String billPayerAddesss) {
		this.billPayerAddesss = billPayerAddesss;
	}

	public String getDescribe() {
		return describe;
	}

	public void setDescribe(String describe) {
		this.describe = describe;
	}

	public int getDues() {
		return dues;
	}

	public void setDues(int dues) {
		this.dues = dues;
	}

	public int getKw() {
		return kw;
	}

	public void setKw(int kw) {
		this.kw = kw;
	}

	public int getCapacity() {
		return capacity;
	}

	public void setCapacity(int capacity) {
		this.capacity = capacity;
	}

}
