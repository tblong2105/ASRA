package com.asra.developer.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.asra.developer.repository.ContractRepository;
import com.asra.developer.repository.ScheduleDatalogRpository;
import com.asra.developer.repository.basic.DepositRepositoryBasic;

@Service
public class Schedule {

	@Autowired
	private ScheduleDatalogRpository scheduleRpository;

	@Autowired
	private ContractRepository contractRepository;
	
	@Autowired
	private DepositRepositoryBasic depositRepositoryBasic;

	/**
	 * remove datalog every day at 0h10:00'
	 */
	@Scheduled(cron = "0 10 0 ? * *")
	public void scheduleTaskCleanDataLog() {
		scheduleRpository.ClearDataDatalogUtility();
		scheduleRpository.ClearDataDatalogAddress();
//		scheduleRpository.ClearDataDatalog();
	}

	// Check status contract
	@Scheduled(cron = "01 0 0 ? * *")
	public void scheduleTaskCheckStatusContract() {
		contractRepository.checkExpiredStatus();
		depositRepositoryBasic.refundDepositAfter7Day();
//		contractRepository.checkAlmostExpiredStatus();
	}

}
