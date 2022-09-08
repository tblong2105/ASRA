package com.asra.developer.repository.basic;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.asra.developer.models.entity.Bill;

public interface BillRepositoryBasic extends JpaRepository<Bill, Long> {
	@Query(value = "SELECT * FROM bill where contract_id = ?1 and type = ?2", nativeQuery = true)
	Bill getBillByContractIdAndType(Long contractId, String type);

	@Query(value = "select status from bill where contract_id = ?1 and month = ?2 and year = ?3", nativeQuery = true)
	String getBillStatusByContractAndMonthAndYear(Long contractId, int month, int year);
	
	@Query(value = "select * from bill where contract_id = ?1 and month = ?2 and year = ?3", nativeQuery = true)
	Bill getBillByContractAndMonthAndYear(Long contractId, int month, int year);

	@Query(value = "SELECT count(*) as billAvaiable FROM bill as b join contract as c on b.contract_id = c.id where b.room_id = ?1 and b.month = ?2 and b.year = ?3 and (c.status = 'IS_ACTIVE' or c.status = 'ALMOST_EXPIRED' or c.status = 'REQUEST_TERMINATE')", nativeQuery = true)
	int totalBillAvaiablByRoomIdAndMonthAndYear(Long roomId, int month, int year);
}
