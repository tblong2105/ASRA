package com.asra.developer.repository;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.asra.developer.models.entity.DataLog;

public interface ScheduleDatalogRpository extends JpaRepository<DataLog, Long> {

	@Transactional
	@Modifying
	@Query(value = "delete from datalog_utility where datalog_id in (select id from datalog where DATEDIFF(now(), create_date) > 7)", nativeQuery = true)
	public void ClearDataDatalogUtility();

	@Transactional
	@Modifying
	@Query(value = "delete from datalog where DATEDIFF(now(), create_date) > 7 and master_type != 'MASTER_DATA'", nativeQuery = true)
	public void ClearDataDatalogAddress();

	@Transactional
	@Modifying
	@Query(value = "delete from address_master where DATEDIFF(now(), create_date) > 7 and type='Datalog'", nativeQuery = true)
	public void ClearDataDatalog();
}
