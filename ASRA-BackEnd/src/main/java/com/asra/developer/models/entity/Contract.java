package com.asra.developer.models.entity;

import java.math.BigDecimal;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.asra.developer.common.base.BaseEntity;

@Entity
@Table(name = "contract")
public class Contract extends BaseEntity {

	private static final long serialVersionUID = 1L;

	private Date contractCreateDate;

	@Column(length = 500)
	private String contractCreateAddress;

	private BigDecimal rentalPrice;

	private BigDecimal deposit;

	private BigDecimal electronicPrice;

	private BigDecimal waterPrice;

	private BigDecimal internetPrice;

	@Column(length = 20)
	private String paymentType;

	private Date startDate;

	private Date endDate;

	@Column(length = 50)
	private String tenantName;

	private Date tenantBirthday;

	@Column(length = 200)
	private String tenantPermanentResidence;

	@Column(length = 30)
	private String tenantIcNo;

	private Date tenantIcIssueDate;

	@Column(length = 50)
	private String tenantIcIssueLoc;

	@Column(length = 20)
	private String tenantPhoneNumber;

	@Column(length = 2000)
	private String innkeeperResponsibility;

	@Column(length = 2000)
	private String tenantResponsibility;

	@Column(length = 2000)
	private String commonResponsibility;

	@Column(length = 100)
	private String status;

	private int paymentDate;

	@Column(length = 1000)
	private String innkeeperSignature;

	@Column(length = 1000)
	private String tenantSignature;

	@ManyToOne
	@JoinColumn(name = "room_detail_id")
	private RoomDetail roomDetail;
	
	@ManyToOne
	@JoinColumn(name = "room_id")
	private Room room;

	@ManyToOne
	@JoinColumn(name = "account_id")
	private Account account;

	@ManyToOne
	@JoinColumn(name = "account_tenant_id")
	private Account accountTenant;

	@OneToMany(mappedBy = "contract", cascade = CascadeType.ALL)
	private Set<Bill> bills = new HashSet<>();

	public Contract() {

	}

	public Room getRoom() {
		return room;
	}

	public void setRoom(Room room) {
		this.room = room;
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

	public int getPaymentDate() {
		return paymentDate;
	}

	public void setPaymentDate(int paymentDate) {
		this.paymentDate = paymentDate;
	}

	public RoomDetail getRoomDetail() {
		return roomDetail;
	}

	public void setRoomDetail(RoomDetail roomDetail) {
		this.roomDetail = roomDetail;
	}

	public Account getAccount() {
		return account;
	}

	public void setAccount(Account account) {
		this.account = account;
	}

	public Account getAccountTenant() {
		return accountTenant;
	}

	public void setAccountTenant(Account accountTenant) {
		this.accountTenant = accountTenant;
	}

	public Set<Bill> getBills() {
		return bills;
	}

	public void setBills(Set<Bill> bills) {
		this.bills = bills;
	}

}
