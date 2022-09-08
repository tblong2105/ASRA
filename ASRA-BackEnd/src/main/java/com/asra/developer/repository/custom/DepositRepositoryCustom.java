package com.asra.developer.repository.custom;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.asra.developer.models.entity.Deposit;
import com.asra.developer.models.payload.response.GetAllDepositRequest;

public interface DepositRepositoryCustom {
	Page<Deposit> findAllDeposits(GetAllDepositRequest request, Pageable pageable);
}
