package com.asra.developer.repository.impl;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
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

import com.asra.developer.common.utils.DateTimeUtil;
import com.asra.developer.common.utils.StringUtil;
import com.asra.developer.models.entity.Payment;
import com.asra.developer.models.payload.request.admin.GetAllPaymentRequest;
import com.asra.developer.repository.custom.PaymentRepositoryCustom;

public class PaymentRepositoryImpl implements PaymentRepositoryCustom {
	@PersistenceContext
	EntityManager em;

	@Override
	public Page<Payment> findPaymentAdmin(GetAllPaymentRequest request, Pageable pageable) {
		CriteriaBuilder builder = em.getCriteriaBuilder();

		CriteriaQuery<Payment> query = builder.createQuery(Payment.class);

		Root<Payment> root = query.from(Payment.class);

		query.select(root);

		List<Predicate> predicates = new ArrayList<>();

		// Create Count Query
		CriteriaQuery<Long> countQuery = builder.createQuery(Long.class);

		Root<Payment> rootCount = countQuery.from(Payment.class);

		countQuery.select(builder.count(rootCount));

		List<Predicate> predicatesCount = new ArrayList<>();

		if (StringUtil.isNotBlank(request.getKeyword())) {
			predicates.add(builder.like(root.get("payerEmailAddress"), "%" + request.getKeyword() + "%"));
			predicatesCount.add(builder.like(rootCount.get("payerEmailAddress"), "%" + request.getKeyword() + "%"));
		}

		if (StringUtil.isNotBlank(request.getStartDate()) && StringUtil.isNotBlank(request.getEndDate())) {
			Date startDate = null;
			Date endDate = null;
			try {
				startDate = DateTimeUtil.convertStringToDate(request.getStartDate());
				endDate = DateTimeUtil.convertStringToDate(request.getEndDate());
			} catch (ParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			predicates.add(builder.between(root.<Date>get("insertDate"), startDate, endDate));
			predicatesCount.add(builder.between(root.<Date>get("insertDate"), startDate, endDate));
		}

		if (StringUtil.isNotBlank(request.getSortBy()) && StringUtil.isNotBlank(request.getSortField())) {

			if ("ASC".equals(request.getSortBy())) {
				if ("createdDate".equals(request.getSortField())) {
					query.orderBy(builder.asc(root.get("insertDate")));
				} else {
					query.orderBy(builder.asc(root.get(request.getSortField())));
				}

			} else if ("DESC".equals(request.getSortBy())) {
				if ("createdDate".equals(request.getSortField())) {
					query.orderBy(builder.desc(root.get("insertDate")));
				} else {
					query.orderBy(builder.desc(root.get(request.getSortField())));
				}
			}
		}

		query.where(builder.and(predicates.toArray(Predicate[]::new)));

		TypedQuery<Payment> result = em.createQuery(query);

		result.setFirstResult((int) pageable.getOffset());

		result.setMaxResults(pageable.getPageSize());

		// get total record
		countQuery.where(builder.and(predicatesCount.toArray(Predicate[]::new)));

		Long count = em.createQuery(countQuery).getSingleResult();

		Page<Payment> returnValue = new PageImpl<>(result.getResultList(), pageable, count);

		return returnValue;// TODO Auto-generated method stub
	}
}
