package com.asra.developer.models.payload.request;

import java.math.BigDecimal;

public class DepositRequest {

	private String roomId;
	
	private String username;

	private BigDecimal depositCost;
	
	private long paymentId;

	public DepositRequest() {

	}
	
	

	public long getPaymentId() {
		return paymentId;
	}



	public void setPaymentId(long paymentId) {
		this.paymentId = paymentId;
	}



	public String getRoomId() {
		return roomId;
	}

	public void setRoomId(String roomId) {
		this.roomId = roomId;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public BigDecimal getDepositCost() {
		return depositCost;
	}

	public void setDepositCost(BigDecimal depositCost) {
		this.depositCost = depositCost;
	}

}
