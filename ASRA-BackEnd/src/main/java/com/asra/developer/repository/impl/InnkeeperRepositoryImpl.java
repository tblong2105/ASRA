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

import com.asra.developer.common.utils.StringUtil;
import com.asra.developer.models.entity.Innkeeper;
import com.asra.developer.models.payload.request.admin.GetAllBecomeInnkeeperRequest;
import com.asra.developer.repository.custom.InnkeeperRepositoryCustom;

public class InnkeeperRepositoryImpl implements InnkeeperRepositoryCustom {

	@PersistenceContext
	EntityManager em;

	@Override
	public Page<Innkeeper> findAllBecomeInnkeeper(GetAllBecomeInnkeeperRequest request, Pageable pageable) {
		CriteriaBuilder builder = em.getCriteriaBuilder();

		CriteriaQuery<Innkeeper> query = builder.createQuery(Innkeeper.class);

		Root<Innkeeper> root = query.from(Innkeeper.class);

		query.select(root).where(builder.equal(root.get("status"), "1"));

		List<Predicate> predicates = new ArrayList<>();

		// Create Count Query
		CriteriaQuery<Long> countQuery = builder.createQuery(Long.class);

		Root<Innkeeper> rootCount = countQuery.from(Innkeeper.class);

		countQuery.select(builder.count(rootCount));

		List<Predicate> predicatesCount = new ArrayList<>();

		if (StringUtil.isNotBlank(request.getKeyword())) {
			predicates.add(builder.like(root.get("account").get("userName"), "%" + request.getKeyword() + "%"));
			predicatesCount
					.add(builder.like(rootCount.get("account").get("userName"), "%" + request.getKeyword() + "%"));
		}

		if (StringUtil.isNotBlank(request.getStatus())) {
			predicates.add(builder.equal(root.get("status"), request.getStatus()));
			predicatesCount.add(builder.equal(rootCount.get("status"), request.getStatus()));
		}

		if (StringUtil.isNotBlank(request.getSortBy()) && StringUtil.isNotBlank(request.getSortField())) {

			if ("ASC".equals(request.getSortBy())) {
				switch (request.getSortField()) {
				case "createdDate":
					query.orderBy(builder.desc(root.get("insertDate")));
					break;
				case "userName":
					query.orderBy(builder.desc(root.get("account").get("userName")));
					break;

				case "fullName":
					query.orderBy(builder.desc(root.get("account").get("fullName")));
					break;
				default:
					query.orderBy(builder.desc(root.get(request.getSortField())));
					break;
				}

			} else if ("DESC".equals(request.getSortBy())) {
				switch (request.getSortField()) {
				case "createdDate":
					query.orderBy(builder.desc(root.get("insertDate")));
					break;
				case "userName":
					query.orderBy(builder.desc(root.get("account").get("userName")));
					break;

				case "fullName":
					query.orderBy(builder.desc(root.get("account").get("fullName")));
					break;
				default:
					query.orderBy(builder.desc(root.get(request.getSortField())));
					break;
				}
			}
		}

		query.where(builder.and(predicates.toArray(Predicate[]::new)));

		TypedQuery<Innkeeper> result = em.createQuery(query);

		result.setFirstResult((int) pageable.getOffset());

		result.setMaxResults(pageable.getPageSize());

		// get total record
		countQuery.where(builder.and(predicatesCount.toArray(Predicate[]::new)));

		Long count = em.createQuery(countQuery).getSingleResult();

		Page<Innkeeper> returnValue = new PageImpl<>(result.getResultList(), pageable, count);

		return returnValue;
	}

}
