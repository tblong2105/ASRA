package com.asra.developer.models.payload.response;

import java.util.List;

public class JwtResponse {

	private String token;
	private String type = "Bearer";
	private Long id;
	private String username;
	private String image;
	private String email;
	private String fullname;
	private String address;
	private List<String> roles;

	public JwtResponse() {
		
	}

	public JwtResponse(String token, Long id, String username, String image, List<String> roles) {
		this.token = token;
		this.id = id;
		this.username = username;
		this.image = image;
		this.roles = roles;
	}
	
	public JwtResponse(String token, Long id, String username, String email, String fullname, String address, String image, List<String> roles) {
		super();
		this.token = token;
		this.id = id;
		this.username = username;
		this.email = email;
		this.fullname = fullname;
		this.image = image;
		this.address = address;
		this.roles = roles;
	}

	
	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getFullname() {
		return fullname;
	}

	public void setFullname(String fullname) {
		this.fullname = fullname;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public String getTokenType() {
		return type;
	}

	public void setTokenType(String tokenType) {
		this.type = tokenType;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public List<String> getRoles() {
		return roles;
	}

	public void setRoles(List<String> roles) {
		this.roles = roles;
	}

}
