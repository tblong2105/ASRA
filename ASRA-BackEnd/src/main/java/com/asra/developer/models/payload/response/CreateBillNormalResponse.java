package com.asra.developer.models.payload.response;

public class CreateBillNormalResponse {

	private Long billId;

	private String message;

	public Long getBillId() {
		return billId;
	}

	public void setBillId(Long billId) {
		this.billId = billId;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

}
