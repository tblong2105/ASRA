package com.asra.developer.models.entity;

import java.math.BigDecimal;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.asra.developer.common.base.BaseEntity;

@Entity
@Table(name = "deposit")
public class Deposit extends BaseEntity {

	private static final long serialVersionUID = 1L;

	@ManyToOne
	@JoinColumn(name = "account_id")
	private Account account;

	@ManyToOne
	@JoinColumn(name = "room_id")
	private Room room;
	
	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "payment_id", referencedColumnName = "Id")
	private Payment payment;

	private BigDecimal depositCost;

	@Column(length = 20)
	private String status;

	public Deposit() {

	}
	
	

	public Payment getPayment() {
		return payment;
	}



	public void setPayment(Payment payment) {
		this.payment = payment;
	}



	public Account getAccount() {
		return account;
	}

	public void setAccount(Account account) {
		this.account = account;
	}

	public Room getRoom() {
		return room;
	}

	public void setRoom(Room room) {
		this.room = room;
	}

	public BigDecimal getDepositCost() {
		return depositCost;
	}

	public void setDepositCost(BigDecimal depositCost) {
		this.depositCost = depositCost;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

}
