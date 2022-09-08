package com.asra.developer.models.payload.request;

public class BecomeInnkeeperRequest {
	private String frontImage;

	private String backImage;

	private String id;

	private String name;

	private String dob;

	private String address;

	private String issue_date;

	private String issue_loc;

	private String gmailPaypal;

	public BecomeInnkeeperRequest() {

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

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDob() {
		return dob;
	}

	public void setDob(String dob) {
		this.dob = dob;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getIssue_date() {
		return issue_date;
	}

	public void setIssue_date(String issue_date) {
		this.issue_date = issue_date;
	}

	public String getIssue_loc() {
		return issue_loc;
	}

	public void setIssue_loc(String issue_loc) {
		this.issue_loc = issue_loc;
	}

	public String getGmailPaypal() {
		return gmailPaypal;
	}

	public void setGmailPaypal(String gmailPaypal) {
		this.gmailPaypal = gmailPaypal;
	}

}
