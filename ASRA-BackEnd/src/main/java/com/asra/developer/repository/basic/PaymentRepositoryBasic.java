package com.asra.developer.repository.basic;

import org.springframework.data.jpa.repository.JpaRepository;

import com.asra.developer.models.entity.Payment;

public interface PaymentRepositoryBasic extends JpaRepository<Payment, Long> {

}
