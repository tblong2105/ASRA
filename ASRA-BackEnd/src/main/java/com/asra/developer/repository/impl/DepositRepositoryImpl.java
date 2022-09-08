package com.asra.developer.repository.impl;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import com.asra.developer.common.constants.DepositConstant;
import com.asra.developer.common.utils.StringUtil;
import com.asra.developer.models.entity.Deposit;
import com.asra.developer.models.payload.response.GetAllDepositRequest;
import com.asra.developer.repository.custom.DepositRepositoryCustom;

public class DepositRepositoryImpl implements DepositRepositoryCustom {

	@PersistenceContext
	EntityManager em;

	@Override
	public Page<Deposit> findAllDeposits(GetAllDepositRequest request, Pageable pageable) {
		CriteriaBuilder builder = em.getCriteriaBuilder();

		CriteriaQuery<Deposit> query = builder.createQuery(Deposit.class);

		Root<Deposit> root = query.from(Deposit.class);

		query.select(root).where(builder.equal(root.get("status"), DepositConstant.PENDING_APPROVAL));

		List<Predicate> predicates = new ArrayList<>();

		// Create Count Query
		CriteriaQuery<Long> countQuery = builder.createQuery(Long.class);

		Root<Deposit> rootCount = countQuery.from(Deposit.class);

		countQuery.select(builder.count(rootCount));

		List<Predicate> predicatesCount = new ArrayList<>();


		if (StringUtil.isNotBlank(String.valueOf(request.getRoomId()))) {
			predicates.add(builder.equal(root.get("room").get("id"), request.getRoomId()));
			predicatesCount
					.add(builder.equal(root.get("room").get("id"), request.getRoomId()));
		}
		
		if (StringUtil.isNotBlank(request.getKeyword())) {
			predicates.add(builder.equal(root.get("account").get("userName"), request.getKeyword()));
			predicatesCount
					.add(builder.equal(root.get("account").get("userName"), request.getKeyword()));
		}

		if (StringUtil.isNotBlank(request.getStatus())) {
			predicates.add(builder.equal(root.get("status"), request.getStatus()));
			predicatesCount.add(builder.equal(rootCount.get("status"), request.getStatus()));
		}

		query.where(builder.and(predicates.toArray(Predicate[]::new)));

		TypedQuery<Deposit> result = em.createQuery(query);

		result.setFirstResult((int) pageable.getOffset());

		result.setMaxResults(pageable.getPageSize());

		// get total record
		countQuery.where(builder.and(predicatesCount.toArray(Predicate[]::new)));

		Long count = em.createQuery(countQuery).getSingleResult();

		Page<Deposit> returnValue = new PageImpl<>(result.getResultList(), pageable, count);

		return returnValue;
	}

}
