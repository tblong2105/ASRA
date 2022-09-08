package com.asra.developer.controllers;

import javax.transaction.Transactional;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.asra.developer.common.constants.SystemConstants;
import com.asra.developer.models.payload.request.CreateBillRequest;
import com.asra.developer.models.payload.request.PaymentBillRequest;
import com.asra.developer.models.payload.response.BillDetailResponse;
import com.asra.developer.models.payload.response.CreateBillNormalResponse;
import com.asra.developer.models.payload.response.PaymentBillResponse;
import com.asra.developer.services.BillServices;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api/bill")
public class BillController {

	@Autowired
	private BillServices billServices;

	@GetMapping("/view/{billId}")
	public ResponseEntity<BillDetailResponse> getBillById(@PathVariable("billId") String billId) {
		BillDetailResponse billDetailResponse = billServices.getBillById(Long.parseLong(billId));
		return new ResponseEntity<>(billDetailResponse, HttpStatus.OK);
	}

	@Transactional
	@PostMapping("/payment")
	public ResponseEntity<PaymentBillResponse> PaymentBill(@Valid @RequestBody PaymentBillRequest paymentBillRequest) {
		PaymentBillResponse paymentBillResponse = billServices.PaymentBill(paymentBillRequest);

		return new ResponseEntity<>(paymentBillResponse, HttpStatus.OK);
	}

	@Transactional
	@PostMapping("/create")
	public ResponseEntity<CreateBillNormalResponse> CreateBillNormal(
			@Valid @RequestBody CreateBillRequest createBillRequest) {
		createBillRequest.setType(SystemConstants.BILL_NORMAL);
		return new ResponseEntity<>(billServices.createBill(createBillRequest), HttpStatus.OK);
	}
}
