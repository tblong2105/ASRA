package com.asra.developer.models.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.asra.developer.common.base.BaseEntity;

@Entity
@Table(name = "innkeeper")
public class Innkeeper extends BaseEntity {

	private static final long serialVersionUID = 1L;

	@ManyToOne
	@JoinColumn(name = "account_id")
	private Account account;

	@Column(length = 1000)
	private String frontImage;

	@Column(length = 1000)
	private String backImage;

	@Column(length = 50)
	private String icId;

	@Column(length = 50)
	private String icName;

	@Column(length = 10)
	private String icBirthdate;

	@Column(length = 100)
	private String icAddress;

	@Column(length = 10)
	private String icIssueDate;

	@Column(length = 100)
	private String icIssueLoc;

	@Column(length = 1)
	private String status;

	@Column(length = 50)
	private String gmailPaypal;

	public Innkeeper() {

	}

	public Account getAccount() {
		return account;
	}

	public void setAccount(Account account) {
		this.account = account;
	}

	public String getFrontImage() {
		return frontImage;
	}

	public void setFrontImage(String frontImage) {
		this.frontImage = frontImage;
	}

	public String getBackImage() {
		return backImage;
	}

	public void setBackImage(String backImage) {
		this.backImage = backImage;
	}

	public String getIcId() {
		return icId;
	}

	public void setIcId(String icId) {
		this.icId = icId;
	}

	public String getIcName() {
		return icName;
	}

	public void setIcName(String icName) {
		this.icName = icName;
	}

	public String getIcBirthdate() {
		return icBirthdate;
	}

	public void setIcBirthdate(String icBirthdate) {
		this.icBirthdate = icBirthdate;
	}

	public String getIcAddress() {
		return icAddress;
	}

	public void setIcAddress(String icAddress) {
		this.icAddress = icAddress;
	}

	public String getIcIssueDate() {
		return icIssueDate;
	}

	public void setIcIssueDate(String icIssueDate) {
		this.icIssueDate = icIssueDate;
	}

	public String getIcIssueLoc() {
		return icIssueLoc;
	}

	public void setIcIssueLoc(String icIssueLoc) {
		this.icIssueLoc = icIssueLoc;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getGmailPaypal() {
		return gmailPaypal;
	}

	public void setGmailPaypal(String gmailPaypal) {
		this.gmailPaypal = gmailPaypal;
	}

}
