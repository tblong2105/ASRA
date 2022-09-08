package com.asra.developer.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.asra.developer.common.constants.MessageConstants;
import com.asra.developer.common.error.BussinessExeption;
import com.asra.developer.models.entity.Payment;
import com.asra.developer.models.payload.request.CreatePaymentRequest;
import com.asra.developer.models.payload.response.MessageResponse;
import com.asra.developer.models.payload.response.PaymentResponse;
import com.asra.developer.repository.PaymentRepository;

@Service
public class PaymentServices {

	@Autowired
	private PaymentRepository paymentRepository;

	public PaymentResponse Payment(CreatePaymentRequest createPaymentRequest) {
		try {
			Payment payment = new Payment();
			payment.setIdPayment(createPaymentRequest.getIdPayment());
			payment.setVndAmount(createPaymentRequest.getVndAmount());
			payment.setPaymentAmount(createPaymentRequest.getPaymentAmount());
			payment.setCurrencyCode(createPaymentRequest.getCurrencyCode());
			payment.setDescription(createPaymentRequest.getDescription());
			payment.setLinks(createPaymentRequest.getLinks());
			payment.setPayeeEmailAddres(createPaymentRequest.getPayeeEmailAddres());
			payment.setPayerCountryCode(createPaymentRequest.getPayerCountryCode());
			payment.setPayerEmailAddress(createPaymentRequest.getPayerEmailAddress());
			payment.setPayerGivenName(createPaymentRequest.getPayerGivenName());
			payment.setPayerId(createPaymentRequest.getPayerId());
			payment.setPayerSurname(createPaymentRequest.getPayerSurname());
//			payment = mapper.map(createPaymentRequest, Payment.class);

			Long paymentId = paymentRepository.save(payment).getId();
			PaymentResponse paymentResponse = new PaymentResponse();
			paymentResponse.setPaymentId(paymentId);
			paymentResponse.setMessage(new MessageResponse(MessageConstants.MSI016));
			return paymentResponse;
		} catch (Exception e) {
			throw new BussinessExeption(MessageConstants.MSE001);
		}
	}
}
