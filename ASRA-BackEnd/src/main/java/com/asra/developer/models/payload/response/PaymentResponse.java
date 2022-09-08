package com.asra.developer.models.payload.response;

public class PaymentResponse {
	
	private long id;

	private Long roomId;

	private Long paymentId;

	private MessageResponse message;

	public PaymentResponse() {

	}
	
	

	public long getId() {
		return id;
	}



	public void setId(long id) {
		this.id = id;
	}



	public Long getPaymentId() {
		return paymentId;
	}

	public void setPaymentId(Long paymentId) {
		this.paymentId = paymentId;
	}

	public Long getRoomId() {
		return roomId;
	}

	public void setRoomId(Long roomId) {
		this.roomId = roomId;
	}

	public MessageResponse getMessage() {
		return message;
	}

	public void setMessage(MessageResponse message) {
		this.message = message;
	}

}
