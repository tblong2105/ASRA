package com.asra.developer.repository.basic;

import java.math.BigDecimal;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.asra.developer.models.entity.Deposit;

public interface DepositRepositoryBasic extends JpaRepository<Deposit, Long> {

	@Query("SELECT COUNT(*) " + "FROM Room r " + "LEFT JOIN r.deposits d " + "WHERE r.id = ?1 AND d.status = ?2")
	int countDepositRequest(long roomId, String status);

	@Query(value = "select sum(deposit_cost) from deposit where account_id = ?1 and room_id = ?2", nativeQuery = true)
	BigDecimal getDepositHolder(Long accountId, Long RoomId);

	Page<Deposit> findByAccountId(Long accountId, Pageable pageable);

	
	@Query(value = "select * from deposit where account_id = ?1 and room_id = ?2 and status = 'PENDING_APPROVAL'", nativeQuery = true)
	Optional<Deposit> findByAccountIdAndRoomId(Long accountId, Long roomId);
	
	@Transactional
	@Modifying
	@Query(value = "update deposit set status = 'REFUND' where status = 'PENDING_APPROVAL' and ((select count(*) from room_detail where room_id = ?1 and room_status = 0)) = 0 and room_id = ?1", nativeQuery = true)
	void RefundDepositAfterCreateLastContract(Long roomId);
	
	
	@Transactional
	@Modifying
	@Query(value = "update deposit set status = 'REFUND' where status = 'PENDING_APPROVAL' and DATEDIFF(now(), create_date) > 7", nativeQuery = true)
	int refundDepositAfter7Day();
}
