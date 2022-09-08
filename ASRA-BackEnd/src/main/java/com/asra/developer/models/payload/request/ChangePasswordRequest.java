package com.asra.developer.models.payload.request;

public class ChangePasswordRequest {

	private String oldPassword;

	private String newPassword;

	public ChangePasswordRequest() {

	}

	public String getOldPassword() {
		return oldPassword;
	}

	public void setOldPassword(String oldPassword) {
		this.oldPassword = oldPassword;
	}

	public String getNewPassword() {
		return newPassword;
	}

	public void setNewPassword(String newPassword) {
		this.newPassword = newPassword;
	}

}
