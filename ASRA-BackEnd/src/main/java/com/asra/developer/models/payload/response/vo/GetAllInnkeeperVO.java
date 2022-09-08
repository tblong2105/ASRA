package com.asra.developer.models.payload.response.vo;

import java.util.Date;

public class GetAllInnkeeperVO {
	private Long id;

	private String userName;

	private String fullName;

	private String frontImage;

	private String backImage;

	private String icId;

	private String icName;

	private String icBirthdate;

	private String icAddress;

	private String icIssueDate;

	private String icIssueLoc;

	private String gmailPaypal;

	private Date createdDate;

	private String status;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
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

	public String getGmailPaypal() {
		return gmailPaypal;
	}

	public void setGmailPaypal(String gmailPaypal) {
		this.gmailPaypal = gmailPaypal;
	}

	public Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

}
