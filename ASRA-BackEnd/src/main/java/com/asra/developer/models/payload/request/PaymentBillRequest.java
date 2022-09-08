package com.asra.developer.models.payload.request;

public class PaymentBillRequest {

	private Long billId;

	private Long paymentId;

	private String innkeeperSignature;
	
	private String tenantSignature;
	
	
	public Long getPaymentId() {
		return paymentId;
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




	public void setPaymentId(Long paymentId) {
		this.paymentId = paymentId;
	}

	public Long getBillId() {
		return billId;
	}

	public void setBillId(Long billId) {
		this.billId = billId;
	}

	public PaymentBillRequest() {

	}
}
