package com.asra.developer.repository.custom;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.asra.developer.models.entity.Payment;
import com.asra.developer.models.payload.request.admin.GetAllPaymentRequest;

public interface PaymentRepositoryCustom {
	Page<Payment> findPaymentAdmin(GetAllPaymentRequest request, Pageable pageable);
}
