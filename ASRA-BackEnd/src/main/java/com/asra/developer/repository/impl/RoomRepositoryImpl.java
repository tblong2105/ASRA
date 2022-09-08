package com.asra.developer.repository.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.ParameterMode;
import javax.persistence.PersistenceContext;
import javax.persistence.StoredProcedureQuery;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import com.asra.developer.common.base.Parameters;
import com.asra.developer.common.constants.SystemConstants;
import com.asra.developer.common.utils.StringUtil;
import com.asra.developer.models.entity.Room;
import com.asra.developer.models.payload.request.admin.GetAllRoomRequest;
import com.asra.developer.repository.custom.RoomRepositoryCustom;

public class RoomRepositoryImpl implements RoomRepositoryCustom {

	@PersistenceContext
	EntityManager em;

	@Override
	public Page<Room> findRoomCustom(Parameters params, Pageable pageable) {

		CriteriaBuilder builder = em.getCriteriaBuilder();

		CriteriaQuery<Room> query = builder.createQuery(Room.class);

		query.distinct(true);

		Root<Room> root = query.from(Room.class);

		query.select(root);

		List<Predicate> predicates = new ArrayList<>();

		// Create Count Query
		CriteriaQuery<Long> countQuery = builder.createQuery(Long.class);

		Root<Room> rootCount = countQuery.from(Room.class);

		countQuery.select(builder.countDistinct(rootCount));

		List<Predicate> predicatesCount = new ArrayList<>();

		String paramWard = (String) params.get(SystemConstants.WARD);

		String[] paramDistrict = (String[]) params.get(SystemConstants.DISTRICT);

		String paramCity = (String) params.get(SystemConstants.CITY);

		BigDecimal paramMinMoney = (BigDecimal) params.get(SystemConstants.MIN_MONEY);

		BigDecimal paramMaxMoney = (BigDecimal) params.get(SystemConstants.MAX_MONEY);

		@SuppressWarnings("unchecked")
		List<String> paramUtilities = (List<String>) params.get(SystemConstants.UTILITY);

		@SuppressWarnings("unchecked")
		List<String> paramRoomTypes = (List<String>) params.get(SystemConstants.ROOM_TYPE);

		String paramSortBy = (String) params.get(SystemConstants.SORT_BY);

		if (paramWard != null) {
			predicates.add(builder.equal(root.join("address").get("ward"), paramWard));
			predicatesCount.add(builder.equal(rootCount.join("address").get("ward"), paramWard));
		}

		if (paramDistrict != null) {
			predicates.add(builder.equal(root.join("address").get("district"), paramDistrict));
			predicatesCount.add(builder.equal(rootCount.join("address").get("district"), paramDistrict));
		}

		if (paramCity != null) {
			predicates.add(builder.equal(root.join("address").get("city"), paramCity));
			predicatesCount.add(builder.equal(rootCount.join("address").get("city"), paramCity));
		}

		if (paramMinMoney != null) {
			predicates.add(builder.greaterThanOrEqualTo(root.get("rentalPrice"), paramMinMoney));
			predicatesCount.add(builder.greaterThanOrEqualTo(rootCount.get("rentalPrice"), paramMinMoney));
		}

		if (paramMaxMoney != null) {
			predicates.add(builder.lessThanOrEqualTo(root.get("rentalPrice"), paramMaxMoney));
			predicatesCount.add(builder.lessThanOrEqualTo(rootCount.get("rentalPrice"), paramMaxMoney));
		}

		if (paramUtilities != null) {
			predicates.add(root.join("utilities").get("roomUtilityId").in(paramUtilities));
			predicatesCount.add(rootCount.join("utilities").get("roomUtilityId").in(paramUtilities));
		}

		if (paramRoomTypes != null) {

			predicates.add(root.get("roomType").get("roomTypeId").in(paramRoomTypes));
			predicatesCount.add(rootCount.get("roomType").get("roomTypeId").in(paramRoomTypes));
		}

		predicates.add(builder.equal(root.get("status"), true));
		predicatesCount.add(builder.equal(rootCount.get("status"), true));

		if (paramSortBy != null) {
			switch (paramSortBy) {
			case SystemConstants.SORT_BY_LATEST:
				query.orderBy(builder.desc(root.get("insertDate")));
				break;
			case SystemConstants.SORT_BY_LOWTOHIGH:
				query.orderBy(builder.asc(root.get("rentalPrice")));
				break;
			case SystemConstants.SORT_BY_HIGHTOLOW:
				query.orderBy(builder.desc(root.get("rentalPrice")));
				break;
			default:

				break;
			}
		}

		query.where(builder.and(predicates.toArray(Predicate[]::new)));

		TypedQuery<Room> result = em.createQuery(query);

		result.setFirstResult((int) pageable.getOffset());

		result.setMaxResults(pageable.getPageSize());

		// get total record
		countQuery.where(builder.and(predicatesCount.toArray(Predicate[]::new)));

		Long count = em.createQuery(countQuery).getSingleResult();

		Page<Room> returnValue = new PageImpl<>(result.getResultList(), pageable, count);

		return returnValue;
	}

	@Override
	public Page<Room> findMyRoomsInnkeeper(Long id, Pageable pageable) {
		CriteriaBuilder builder = em.getCriteriaBuilder();

		CriteriaQuery<Room> query = builder.createQuery(Room.class);
		Root<Room> room = query.from(Room.class);

		query.select(room).where(builder.equal(room.get("account").get("id"), id))
				.orderBy(builder.desc(room.get("insertDate")));

		TypedQuery<Room> result = em.createQuery(query);

		CriteriaQuery<Long> countQuery = builder.createQuery(Long.class);
		Root<Room> rootCount = countQuery.from(Room.class);

		result.setFirstResult((int) pageable.getOffset());

		result.setMaxResults(pageable.getPageSize());

		countQuery.select(builder.count(rootCount)).where(builder.equal(room.get("account").get("id"), id));

		Long count = em.createQuery(countQuery).getSingleResult();

		Page<Room> returnValue = new PageImpl<>(result.getResultList(), pageable, count);

		return returnValue;
	}

	@Override
	public Page<Room> findRoomAdminCustom(GetAllRoomRequest request, Pageable pageable) {
		CriteriaBuilder builder = em.getCriteriaBuilder();

		CriteriaQuery<Room> query = builder.createQuery(Room.class);

		Root<Room> root = query.from(Room.class);

		query.select(root);

		List<Predicate> predicates = new ArrayList<>();

		// Create Count Query
		CriteriaQuery<Long> countQuery = builder.createQuery(Long.class);

		Root<Room> rootCount = countQuery.from(Room.class);

		countQuery.select(builder.count(rootCount));

		List<Predicate> predicatesCount = new ArrayList<>();

		if (StringUtil.isNotBlank(request.getKeyword())) {
			predicates.add(builder.like(root.get("account").get("userName"), "%" + request.getKeyword() + "%"));
			predicatesCount
					.add(builder.like(rootCount.get("account").get("userName"), "%" + request.getKeyword() + "%"));
		}

		if (request.isStatus()) {
			predicates.add(builder.equal(root.get("status"), true));
			predicatesCount.add(builder.equal(rootCount.get("status"), true));
		} else {
			predicates.add(builder.equal(root.get("status"), false));
			predicatesCount.add(builder.equal(rootCount.get("status"), false));
		}

		if (StringUtil.isNotBlank(request.getSortBy()) && StringUtil.isNotBlank(request.getSortField())) {

			if ("ASC".equals(request.getSortBy())) {
				if ("userName".equals(request.getSortField())) {
					query.orderBy(builder.asc(root.get("account").get("userName")));
				} else if ("createdDate".equals(request.getSortField())) {
					query.orderBy(builder.asc(root.get("insertDate")));
				} else if ("roomType".equals(request.getSortField())) {
					query.orderBy(builder.asc(root.get("roomType").get("roomTypeName")));
				} else {
					query.orderBy(builder.asc(root.get(request.getSortField())));
				}

			} else if ("DESC".equals(request.getSortBy())) {
				if ("userName".equals(request.getSortField())) {
					query.orderBy(builder.desc(root.get("account").get("userName")));
				} else if ("createdDate".equals(request.getSortField())) {
					query.orderBy(builder.desc(root.get("insertDate")));
				} else if ("roomType".equals(request.getSortField())) {
					query.orderBy(builder.desc(root.get("roomType").get("roomTypeName")));
				} else {
					query.orderBy(builder.desc(root.get(request.getSortField())));
				}
			}
		}

		query.where(builder.and(predicates.toArray(Predicate[]::new)));

		TypedQuery<Room> result = em.createQuery(query);

		result.setFirstResult((int) pageable.getOffset());

		result.setMaxResults(pageable.getPageSize());

		// get total record
		countQuery.where(builder.and(predicatesCount.toArray(Predicate[]::new)));

		Long count = em.createQuery(countQuery).getSingleResult();

		Page<Room> returnValue = new PageImpl<>(result.getResultList(), pageable, count);

		return returnValue;
	}

	@Override
	public Page<Room> findRoomCustomSP(Parameters params, Pageable pageable) {

		StoredProcedureQuery sp = em.createStoredProcedureQuery("SP_SEARCH_ROOM", Room.class);

		sp.registerStoredProcedureParameter("city", String.class, ParameterMode.IN);
		sp.registerStoredProcedureParameter("district", String.class, ParameterMode.IN);
		sp.registerStoredProcedureParameter("ward", String.class, ParameterMode.IN);
		sp.registerStoredProcedureParameter("min_price", BigDecimal.class, ParameterMode.IN);
		sp.registerStoredProcedureParameter("max_price", BigDecimal.class, ParameterMode.IN);
		sp.registerStoredProcedureParameter("utilities", String.class, ParameterMode.IN);
		sp.registerStoredProcedureParameter("utilities_num", Integer.class, ParameterMode.IN);
		sp.registerStoredProcedureParameter("type_room", String.class, ParameterMode.IN);

		sp.registerStoredProcedureParameter("room_area_min", Integer.class, ParameterMode.IN);
		sp.registerStoredProcedureParameter("room_area_max", Integer.class, ParameterMode.IN);
		sp.registerStoredProcedureParameter("lat", String.class, ParameterMode.IN);
		sp.registerStoredProcedureParameter("lng", String.class, ParameterMode.IN);
		sp.registerStoredProcedureParameter("radius", String.class, ParameterMode.IN);

		sp.registerStoredProcedureParameter("order_by", String.class, ParameterMode.IN);
		sp.registerStoredProcedureParameter("page", Integer.class, ParameterMode.IN);
		sp.registerStoredProcedureParameter("page_size", Integer.class, ParameterMode.IN);

		sp.registerStoredProcedureParameter("count_out", Integer.class, ParameterMode.OUT);

		sp.setParameter("city", params.get(SystemConstants.CITY));
		sp.setParameter("district", params.get(SystemConstants.DISTRICT));
		sp.setParameter("ward", params.get(SystemConstants.WARD));
		sp.setParameter("min_price", params.get(SystemConstants.MIN_MONEY));
		sp.setParameter("max_price", params.get(SystemConstants.MAX_MONEY));
		sp.setParameter("utilities", params.get(SystemConstants.UTILITY));
		sp.setParameter("utilities_num", params.get(SystemConstants.UTILITY_NUM));
		sp.setParameter("type_room", params.get(SystemConstants.ROOM_TYPE));

		sp.setParameter("room_area_min", params.get(SystemConstants.ROOM_AREA_MIN));
		sp.setParameter("room_area_max", params.get(SystemConstants.ROOM_AREA_MAX));
		sp.setParameter("lat", params.get(SystemConstants.LAT));
		sp.setParameter("lng", params.get(SystemConstants.LNG));
		sp.setParameter("radius", params.get(SystemConstants.RADIUS));

		sp.setParameter("order_by", params.get(SystemConstants.SORT_BY));
		sp.setParameter("page", ((int)pageable.getOffset()));
		sp.setParameter("page_size", pageable.getPageSize());

		Integer total = (Integer) sp.getOutputParameterValue("count_out");

		@SuppressWarnings("unchecked")
		Page<Room> returnValue = new PageImpl<>(sp.getResultList(), pageable, total);
		return returnValue;
	}
}
