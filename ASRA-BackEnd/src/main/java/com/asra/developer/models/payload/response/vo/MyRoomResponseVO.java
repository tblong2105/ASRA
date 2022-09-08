package com.asra.developer.models.payload.response.vo;

import java.util.Date;

public class MyRoomResponseVO extends SearchRoomResponseVO {

	private Integer totalRoom;
	
	private Integer availableRoom;
	
	private Integer depositRequest;
	
	private Date insertDate;

	private Integer paymentDate;

	private String paymentStatus;
	
	private Long billId;
	
	private boolean status;

	private Integer paymentStatusWaitingCreateCount;
	
	private Long roomDetailId;
	
	private String roomDetailName;
	
	
	public MyRoomResponseVO() {

	}
	
	
	
	
	public String getRoomDetailName() {
		return roomDetailName;
	}




	public void setRoomDetailName(String roomDetailName) {
		this.roomDetailName = roomDetailName;
	}




	public Long getRoomDetailId() {
		return roomDetailId;
	}




	public void setRoomDetailId(Long roomDetailId) {
		this.roomDetailId = roomDetailId;
	}




	public Integer getPaymentStatusWaitingCreateCount() {
		return paymentStatusWaitingCreateCount;
	}


	public void setPaymentStatusWaitingCreateCount(Integer paymentStatusWaitingCreateCount) {
		this.paymentStatusWaitingCreateCount = paymentStatusWaitingCreateCount;
	}


	public boolean isStatus() {
		return status;
	}


	public void setStatus(boolean status) {
		this.status = status;
	}


	public Long getBillId() {
		return billId;
	}


	public void setBillId(Long billId) {
		this.billId = billId;
	}


	public Integer getPaymentDate() {
		return paymentDate;
	}



	public void setPaymentDate(Integer paymentDate) {
		this.paymentDate = paymentDate;
	}



	public String getPaymentStatus() {
		return paymentStatus;
	}



	public void setPaymentStatus(String paymentStatus) {
		this.paymentStatus = paymentStatus;
	}



	public Integer getTotalRoom() {
		return totalRoom;
	}

	public void setTotalRoom(Integer totalRoom) {
		this.totalRoom = totalRoom;
	}

	public Integer getAvailableRoom() {
		return availableRoom;
	}

	public void setAvailableRoom(Integer availableRoom) {
		this.availableRoom = availableRoom;
	}

	public Integer getDepositRequest() {
		return depositRequest;
	}

	public void setDepositRequest(Integer depositRequest) {
		this.depositRequest = depositRequest;
	}

	public Date getInsertDate() {
		return insertDate;
	}

	public void setInsertDate(Date insertDate) {
		this.insertDate = insertDate;
	}

}
