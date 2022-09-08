package com.asra.developer.models.payload.response.vo;

import java.math.BigDecimal;
import java.util.Date;

public class GetAllPaymentVO {
	private long id;

	private String idPayment;

	private String links;

	private String payerId;

	private String payerGivenName;

	private String payerSurname;

	private String payerEmailAddress;

	private String payerCountryCode;

	private BigDecimal vndAmount;

	private BigDecimal paymentAmount;

	private String currencyCode;

	private String description;

	private String payeeEmailAddres;

	private Date createdDate;

	public GetAllPaymentVO() {
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getIdPayment() {
		return idPayment;
	}

	public void setIdPayment(String idPayment) {
		this.idPayment = idPayment;
	}

	public String getLinks() {
		return links;
	}

	public void setLinks(String links) {
		this.links = links;
	}

	public String getPayerId() {
		return payerId;
	}

	public void setPayerId(String payerId) {
		this.payerId = payerId;
	}

	public String getPayerGivenName() {
		return payerGivenName;
	}

	public void setPayerGivenName(String payerGivenName) {
		this.payerGivenName = payerGivenName;
	}

	public String getPayerSurname() {
		return payerSurname;
	}

	public void setPayerSurname(String payerSurname) {
		this.payerSurname = payerSurname;
	}

	public String getPayerEmailAddress() {
		return payerEmailAddress;
	}

	public void setPayerEmailAddress(String payerEmailAddress) {
		this.payerEmailAddress = payerEmailAddress;
	}

	public String getPayerCountryCode() {
		return payerCountryCode;
	}

	public void setPayerCountryCode(String payerCountryCode) {
		this.payerCountryCode = payerCountryCode;
	}

	public BigDecimal getVndAmount() {
		return vndAmount;
	}

	public void setVndAmount(BigDecimal vndAmount) {
		this.vndAmount = vndAmount;
	}

	public BigDecimal getPaymentAmount() {
		return paymentAmount;
	}

	public void setPaymentAmount(BigDecimal paymentAmount) {
		this.paymentAmount = paymentAmount;
	}

	public String getCurrencyCode() {
		return currencyCode;
	}

	public void setCurrencyCode(String currencyCode) {
		this.currencyCode = currencyCode;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getPayeeEmailAddres() {
		return payeeEmailAddres;
	}

	public void setPayeeEmailAddres(String payeeEmailAddres) {
		this.payeeEmailAddres = payeeEmailAddres;
	}

	public Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}

}
