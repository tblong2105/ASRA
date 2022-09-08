package com.asra.developer.repository.basic;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.asra.developer.common.enums.ERole;
import com.asra.developer.models.entity.Account;

public interface AccountRepositoryBasic extends JpaRepository<Account, Long> {
	Optional<Account> findByUserName(String userName);

	Optional<Account> findByEmail(String email);

	Boolean existsByUserName(String userName);

	Boolean existsByEmail(String email);

	@Query("SELECT a FROM Account a " + "INNER JOIN a.roles r " + "WHERE r.name = ?1 ")
	List<Account> getAllAccountByRoleName(ERole roleName);

	@Query("SELECT a FROM Account a WHERE UPPER(a.userName) LIKE UPPER(CONCAT('%',:username,'%'))")
	List<Account> getAcountsByUsername(@Param("username") String username);

	@Query("SELECT DISTINCT a FROM Account a " + "INNER JOIN a.roles r "
			+ "WHERE UPPER(a.userName) LIKE UPPER(CONCAT('%', ?1 ,'%')) " + "AND (r.name = 'ROLE_INNKEEPER' OR r.name = 'ROLE_USER')")
	List<Account> getAcountsByUsernameAndInnkeeperRole(String username);

	@Query("SELECT a FROM Room r INNER JOIN r.deposits d INNER JOIN d.account a WHERE r.id = ?1")
	List<Account> getAccountsByRoomIdAndDeposit(Long roomId);

}
