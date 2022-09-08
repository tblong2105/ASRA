package com.asra.developer.models.payload.request;

public class CreateBillRequest {

	private int capacity;

	private int kw;

	private Long payerId;

	private Long contractId;

	private String type;

	private int dues;

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

	public Long getPayerId() {
		return payerId;
	}

	public void setPayerId(Long payerId) {
		this.payerId = payerId;
	}

	public Long getContractId() {
		return contractId;
	}

	public void setContractId(Long contractId) {
		this.contractId = contractId;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

}
