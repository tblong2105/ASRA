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

import com.asra.developer.common.enums.ERole;
import com.asra.developer.common.utils.StringUtil;
import com.asra.developer.models.entity.Account;
import com.asra.developer.models.payload.request.admin.GetAllUserRequest;
import com.asra.developer.repository.custom.AccountRepositoryCustom;

public class AccountRepositoryImpl implements AccountRepositoryCustom {

	@PersistenceContext
	EntityManager em;

	@Override
	public Page<Account> findUserAdminCustom(GetAllUserRequest request, Pageable pageable) {
		CriteriaBuilder builder = em.getCriteriaBuilder();

		CriteriaQuery<Account> query = builder.createQuery(Account.class);

		Root<Account> root = query.from(Account.class);

		query.select(root);

		List<Predicate> predicates = new ArrayList<>();

		// Create Count Query
		CriteriaQuery<Long> countQuery = builder.createQuery(Long.class);

		Root<Account> rootCount = countQuery.from(Account.class);

		countQuery.select(builder.count(rootCount));

		List<Predicate> predicatesCount = new ArrayList<>();

		if (StringUtil.isNotBlank(request.getKeyword())) {
			predicates.add(builder.like(root.get("userName"), "%" + request.getKeyword() + "%"));
			predicatesCount.add(builder.like(rootCount.get("userName"), "%" + request.getKeyword() + "%"));
		}

		if (StringUtil.isNotBlank(request.getRole())) {
			predicates.add(builder.equal(root.join("roles").get("name"), ERole.valueOf(request.getRole())));
			predicatesCount.add(builder.equal(rootCount.join("roles").get("name"), ERole.valueOf(request.getRole())));
		}

		if (StringUtil.isNotBlank(request.getSortBy()) && StringUtil.isNotBlank(request.getSortField())) {

			if ("ASC".equals(request.getSortBy())) {
				if ("role".equals(request.getSortField())) {
					query.orderBy(builder.asc(root.join("roles").get("name")));
				} else if ("createdDate".equals(request.getSortField())) {
					query.orderBy(builder.asc(root.get("insertDate")));
				} else {
					query.orderBy(builder.asc(root.get(request.getSortField())));
				}

			} else if ("DESC".equals(request.getSortBy())) {
				if ("role".equals(request.getSortField())) {
					query.orderBy(builder.desc(root.join("roles").get("name")));
				} else if ("createdDate".equals(request.getSortField())) {
					query.orderBy(builder.desc(root.get("insertDate")));
				} else {
					query.orderBy(builder.desc(root.get(request.getSortField())));
				}
			}
		}

		query.where(builder.and(predicates.toArray(Predicate[]::new)));

		TypedQuery<Account> result = em.createQuery(query);

		result.setFirstResult((int) pageable.getOffset());

		result.setMaxResults(pageable.getPageSize());

		// get total record
		countQuery.where(builder.and(predicatesCount.toArray(Predicate[]::new)));

		Long count = em.createQuery(countQuery).getSingleResult();

		Page<Account> returnValue = new PageImpl<>(result.getResultList(), pageable, count);

		return returnValue;
	}
}
