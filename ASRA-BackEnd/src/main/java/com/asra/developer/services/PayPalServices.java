package com.asra.developer.services;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.paypal.api.payments.Currency;
import com.paypal.api.payments.Payout;
import com.paypal.api.payments.PayoutItem;
import com.paypal.api.payments.PayoutSenderBatchHeader;
import com.paypal.base.rest.APIContext;
import com.paypal.base.rest.PayPalRESTException;

@Service
public class PayPalServices {

	@Autowired
	private APIContext apiContext;

	@SuppressWarnings("deprecation")
	public void createPayment(String email, BigDecimal money, String note) throws PayPalRESTException {
		BigDecimal convert = new BigDecimal("23350");

		BigDecimal usdCurr = money.divide(convert, 2, RoundingMode.HALF_EVEN);

		Random random = new Random();
		PayoutSenderBatchHeader senderBatchHeader = new PayoutSenderBatchHeader();
		senderBatchHeader.setSenderBatchId(new Double(random.nextDouble()).toString())
				.setEmailSubject("You have a Payout!");
		Currency amount = new Currency();
		amount.setValue(usdCurr.toString()).setCurrency("USD");
		PayoutItem senderItem = new PayoutItem();
		senderItem.setRecipientType("Email").setNote(note).setReceiver(email).setSenderItemId("201404324234")
				.setAmount(amount);
		List<PayoutItem> items = new ArrayList<PayoutItem>();
		items.add(senderItem);
		Payout payout = new Payout();

		payout.setSenderBatchHeader(senderBatchHeader).setItems(items);
		Map<String, String> parameters = new HashMap<String, String>();
		payout.create(apiContext, parameters);
	}

	@SuppressWarnings("deprecation")
	public void createPaymentRefund(String email, BigDecimal money, String note) throws PayPalRESTException {
		Random random = new Random();
		PayoutSenderBatchHeader senderBatchHeader = new PayoutSenderBatchHeader();
		senderBatchHeader.setSenderBatchId(new Double(random.nextDouble()).toString())
				.setEmailSubject("You have a Payout!");
		Currency amount = new Currency();
		amount.setValue(money.toString()).setCurrency("USD");
		PayoutItem senderItem = new PayoutItem();
		senderItem.setRecipientType("Email").setNote(note).setReceiver(email).setSenderItemId("201404324234")
				.setAmount(amount);
		List<PayoutItem> items = new ArrayList<PayoutItem>();
		items.add(senderItem);
		Payout payout = new Payout();

		payout.setSenderBatchHeader(senderBatchHeader).setItems(items);
		Map<String, String> parameters = new HashMap<String, String>();
		payout.create(apiContext, parameters);
	}

}
