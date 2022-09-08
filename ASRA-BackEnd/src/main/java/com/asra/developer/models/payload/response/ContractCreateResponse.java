package com.asra.developer.models.payload.response;

public class ContractCreateResponse {

	private Long id;
	private MessageResponse message;

	public ContractCreateResponse() {

	}

	public ContractCreateResponse(Long id, MessageResponse message) {
		super();
		this.id = id;
		this.message = message;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public MessageResponse getMessage() {
		return message;
	}

	public void setMessage(MessageResponse message) {
		this.message = message;
	}

}
