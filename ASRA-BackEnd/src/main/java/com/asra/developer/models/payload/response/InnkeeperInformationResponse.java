package com.asra.developer.models.payload.response;

public class InnkeeperInformationResponse {

	private Long accountId;

	private String frontImage;

	private String backImage;

	private String icId;

	private String icName;

	private String icBirthdate;

	private String icAddress;

	private String icIssueDate;

	private String icIssueLoc;

	private String status;

	private String phoneNumber;

	public InnkeeperInformationResponse() {

	}

	public InnkeeperInformationResponse(Long accountId, String frontImage, String backImage, String icId, String icName,
			String icBirthdate, String icAddress, String icIssueDate, String icIssueLoc, String status,
			String phoneNumber) {
		super();
		this.accountId = accountId;
		this.frontImage = frontImage;
		this.backImage = backImage;
		this.icId = icId;
		this.icName = icName;
		this.icBirthdate = icBirthdate;
		this.icAddress = icAddress;
		this.icIssueDate = icIssueDate;
		this.icIssueLoc = icIssueLoc;
		this.status = status;
		this.phoneNumber = phoneNumber;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public Long getAccountId() {
		return accountId;
	}

	public void setAccountId(Long accountId) {
		this.accountId = accountId;
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

	@Override
	public String toString() {
		return "InnkeeperInformationResponse [accountId=" + accountId + ", frontImage=" + frontImage + ", backImage="
				+ backImage + ", icId=" + icId + ", icName=" + icName + ", icBirthdate=" + icBirthdate + ", icAddress="
				+ icAddress + ", icIssueDate=" + icIssueDate + ", icIssueLoc=" + icIssueLoc + ", status=" + status
				+ "]";
	}

}
