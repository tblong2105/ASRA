package com.asra.developer.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.asra.developer.common.constants.SystemConstants;
import com.asra.developer.models.entity.Deposit;
import com.asra.developer.models.payload.response.GetAllDepositRequest;
import com.asra.developer.repository.DepositRepository;

@Service
public class DepositServices {
	
	@Autowired
	DepositRepository depositRepository;
	
	public Page<Deposit> getAllDeposit(GetAllDepositRequest request) {

		Pageable paging = PageRequest.of(request.getPage() - 1, SystemConstants.MAX_RESULT);

		Page<Deposit> pageDeposits = depositRepository.findAllDeposits(request, paging);

		return pageDeposits;
	}
	
}
