package com.asra.developer.repository.basic;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.asra.developer.models.entity.Contract;
import com.asra.developer.models.payload.response.RentedRoomDetailResponse;

public interface ContractRepositoryBasic extends JpaRepository<Contract, Long> {
	@Query("SELECT c FROM RoomDetail rd " + "INNER JOIN rd.contracts c " + "INNER JOIN c.account a "
			+ "WHERE a.id = ?1 AND rd.id = ?2 ")
	Contract findContract(Long accountId, Long roomDetailId);

	@Query("SELECT new com.asra.developer.models.payload.response.RentedRoomDetailResponse(rd.id, rd.roomNo, c.status) FROM Room r "
			+ "INNER JOIN r.roomDetails rd " + "INNER JOIN rd.contracts c " + "WHERE c.accountTenant.id = ?1 AND r.id = ?2 AND (c.status = ?3 or c.status = 'ALMOST_EXPIRED' or c.status = 'REQUEST_TERMINATE')")
	
	List<RentedRoomDetailResponse> findRoomDetailRented(Long accountId, Long roomId, String status);

	@Query(value = "select * from contract where account_id = ?1 and room_id = ?2", nativeQuery = true)
	List<Contract> findContractByAccountIdAndRoomId(Long accountId, Long roomId);

	@Transactional
	@Modifying
	@Query(value = "update contract set status = 'EXPIRED' where NOW() > end_date and status != 'EXPIRED'", nativeQuery = true)
	int checkExpiredStatus();

	@Transactional
	@Modifying
	@Query(value = "update contract set status = 'ALMOST_EXPIRED' where TIMESTAMPDIFF(MONTH, NOW(), end_date) = 0 and status = 'IS_ACTIVE'", nativeQuery = true)
	int checkAlmostExpiredStatus();

	@Query("SELECT c FROM Contract c WHERE c.accountTenant.id = ?1 AND (c.status = ?2 or c.status = 'ALMOST_EXPIRED' or c.status = 'REQUEST_TERMINATE')")
	Page<Contract> findAllByAccountTenantAndStatus(Long roomId, String status, Pageable pageable);
	
	@Query("SELECT c FROM Contract c WHERE c.accountTenant.id = ?1 AND c.status = ?2")
	Page<Contract> findAllWaitingContract(Long roomId, String status, Pageable pageable);

	@Query(value = "select count(*) as totalContract from contract where room_id = ?1 and (status = 'IS_ACTIVE' or status = 'ALMOST_EXPIRED' or status = 'REQUEST_TERMINATE')", nativeQuery = true)
	int totalContractByRoomId(Long roomId);
}
