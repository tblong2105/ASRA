package com.asra.developer.controllers;

import javax.transaction.Transactional;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.asra.developer.models.payload.request.CreatePaymentRequest;
import com.asra.developer.models.payload.response.PaymentResponse;
import com.asra.developer.services.PaymentServices;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api/payment")
public class PaymentController {

	@Autowired
	private PaymentServices paymentServices;

	@Transactional
	@PostMapping("/create")
	public ResponseEntity<PaymentResponse> Payment(@Valid @RequestBody CreatePaymentRequest createPaymentRequest) {

		PaymentResponse paymentDepositHolderResponse = paymentServices.Payment(createPaymentRequest);
		return new ResponseEntity<>(paymentDepositHolderResponse, HttpStatus.OK);
	}

}
