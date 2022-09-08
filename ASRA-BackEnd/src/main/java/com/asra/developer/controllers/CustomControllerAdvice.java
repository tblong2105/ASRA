package com.asra.developer.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.asra.developer.common.error.BussinessExeption;
import com.asra.developer.common.error.MessageModel;
import com.asra.developer.models.payload.response.MessageResponse;

@ControllerAdvice
public class CustomControllerAdvice {
	@ExceptionHandler(BussinessExeption.class) // exception handled
	public ResponseEntity<MessageResponse> handleExceptions(Exception e) {

		MessageResponse messageResponse = new MessageResponse();

		HttpStatus status = HttpStatus.BAD_REQUEST; // 404

		if (e instanceof BussinessExeption) {
			status = HttpStatus.INTERNAL_SERVER_ERROR;
			BussinessExeption b = (BussinessExeption) e;
			messageResponse.setMessage(new MessageModel(b.getMessageId(), b.getParams()));
		} else {
			messageResponse.setMessage(new MessageModel("MS001"));
		}

		return new ResponseEntity<MessageResponse>(messageResponse, status);
	}
}
