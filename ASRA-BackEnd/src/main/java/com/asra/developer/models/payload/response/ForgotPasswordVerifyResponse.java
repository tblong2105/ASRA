package com.asra.developer.models.payload.response;

public class ForgotPasswordVerifyResponse {
	private String userName;

	private String token;

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

}
