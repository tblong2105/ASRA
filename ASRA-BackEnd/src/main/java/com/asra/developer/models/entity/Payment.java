package com.asra.developer.models.entity;

import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.asra.developer.common.base.BaseEntity;

@Entity
@Table(name = "payment")
public class Payment extends BaseEntity {

	private static final long serialVersionUID = 1L;

	@Column(length = 30)
	private String idPayment;

	@Column(length = 1000)
	private String links;

	@Column(length = 30)
	private String payerId;

	@Column(length = 50)
	private String payerGivenName;

	@Column(length = 50)
	private String payerSurname;

	@Column(length = 50)
	private String payerEmailAddress;

	@Column(length = 3)
	private String payerCountryCode;

	private BigDecimal vndAmount;

	private BigDecimal paymentAmount;

	@Column(length = 5)
	private String currencyCode;

	@Column(length = 1000)
	private String description;

	@Column(length = 50)
	private String payeeEmailAddres;
	
	@OneToOne(mappedBy = "payment")
    private Deposit deposit;

	public Payment() {

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

}
