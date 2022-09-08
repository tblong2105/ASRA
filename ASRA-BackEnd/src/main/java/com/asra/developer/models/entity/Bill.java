package com.asra.developer.models.entity;

import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import org.hibernate.annotations.ColumnDefault;

import com.asra.developer.common.base.BaseEntity;

@Entity
public class Bill extends BaseEntity {

	private static final long serialVersionUID = 1L;

	@ManyToOne
	@JoinColumn(name = "account_payee_id")
	private Account billPayee;

	@ManyToOne
	@JoinColumn(name = "account_payer_id")
	private Account billPayer;

	@ManyToOne
	@JoinColumn(name = "contract_id")
	private Contract contract;

	private Long roomId;

	private Long roomDetailId;

	private Long depositId;

	private Long paymentId;

	private int year;

	private int month;

	private BigDecimal depositHolder;

	private BigDecimal deposit;

	private BigDecimal rentalPrice;

	@ColumnDefault("0")
	private BigDecimal electronicPrice;

	@ColumnDefault("0")
	private BigDecimal waterPrice;

	@ColumnDefault("0")
	private BigDecimal internetPrice;

	private BigDecimal totalBill;

	@Column(length = 50)
	private String type;

	@Column(length = 1000)
	private String describe;

	private int dues;

	private int capacity;

	public Account getBillPayee() {
		return billPayee;
	}

	public void setBillPayee(Account billPayee) {
		this.billPayee = billPayee;
	}

	public Account getBillPayer() {
		return billPayer;
	}

	public void setBillPayer(Account billPayer) {
		this.billPayer = billPayer;
	}

	public Contract getContract() {
		return contract;
	}

	public void setContract(Contract contract) {
		this.contract = contract;
	}

	public Long getRoomId() {
		return roomId;
	}

	public void setRoomId(Long roomId) {
		this.roomId = roomId;
	}

	public Long getRoomDetailId() {
		return roomDetailId;
	}

	public void setRoomDetailId(Long roomDetailId) {
		this.roomDetailId = roomDetailId;
	}

	public Long getDepositId() {
		return depositId;
	}

	public void setDepositId(Long depositId) {
		this.depositId = depositId;
	}

	public Long getPaymentId() {
		return paymentId;
	}

	public void setPaymentId(Long paymentId) {
		this.paymentId = paymentId;
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

	public int getCapacity() {
		return capacity;
	}

	public void setCapacity(int capacity) {
		this.capacity = capacity;
	}

	public int getKw() {
		return kw;
	}

	public void setKw(int kw) {
		this.kw = kw;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	private int kw;

	private String status;

	public Bill() {
		
	}

}
