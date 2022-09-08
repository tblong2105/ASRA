package com.asra.developer.repository;

import java.math.BigInteger;
import java.time.LocalDate;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.ParameterMode;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.persistence.StoredProcedureQuery;

import org.apache.commons.lang3.ArrayUtils;
import org.springframework.stereotype.Repository;

import com.asra.developer.common.constants.ContractConstant;
import com.asra.developer.models.payload.response.vo.AdminDashBoardMonthlyVO;
import com.asra.developer.models.payload.response.vo.AdminDashBoardStatusVO;

@Repository
public class CustomRepository {
	@PersistenceContext
	EntityManager em;

	public String checkExitsTokenCustom(String email) {
		StoredProcedureQuery sp = em.createStoredProcedureQuery("SP_FORGOT_PASSWORD");

		sp.registerStoredProcedureParameter("email", String.class, ParameterMode.IN);
		sp.registerStoredProcedureParameter("flag", String.class, ParameterMode.OUT);

		sp.setParameter("email", email);

		String status = (String) sp.getOutputParameterValue("flag");

		return status;
	}

	public int adminCountRoom() {
		Query query = em.createNativeQuery("SELECT COUNT(1) FROM room");

		int result = ((BigInteger) query.getSingleResult()).intValue();

		return result;
	}

	public int adminCountContract() {
		Query query = em.createNativeQuery("SELECT COUNT(1) FROM contract");

		int result = ((BigInteger) query.getSingleResult()).intValue();

		return result;
	}

	public int adminCountAccount() {
		Query query = em.createNativeQuery("SELECT COUNT(1) FROM account");

		int result = ((BigInteger) query.getSingleResult()).intValue();

		return result;
	}

	public AdminDashBoardMonthlyVO adminCountMonthly() {

		StringBuilder sb = new StringBuilder();

		sb.append(" SELECT");
		sb.append(" 	MONTH(c.create_date),");
		sb.append(" 	COUNT(1)");
		sb.append(" FROM");
		sb.append(" 	contract c");
		sb.append(" WHERE");
		sb.append(" 	YEAR(c.create_date)* 100 + MONTH(c.create_date) BETWEEN ");
		sb.append(
				" 	YEAR(DATE_SUB(CURRENT_DATE, INTERVAL 5 MONTH))* 100 + MONTH(DATE_SUB(CURRENT_DATE, INTERVAL 5 MONTH))");
		sb.append(" 	AND YEAR(CURRENT_DATE)* 100 + MONTH(CURRENT_DATE)");
		sb.append(" GROUP BY");
		sb.append(" 	MONTH(c.create_date)");

		Query query = em.createNativeQuery(sb.toString());

		@SuppressWarnings("unchecked")
		List<Object[]> result = query.getResultList();

		int[] monthArr = new int[6];
		int[] contractArr = new int[6];

		LocalDate currentdate = LocalDate.now();

		int currentMonth = currentdate.getMonth().getValue();

		int currentYear = currentdate.getYear();

		for (int i = 0; i < 6; i++) {
			int month = currentMonth - i;
			if (month <= 0) {
				month = month + 12;
			}
			monthArr[i] = month;
			contractArr[i] = 0;
		}

		for (int i = 0; i < 6; i++) {
			for (Object[] o : result) {
				int rowMonth = 0;
				if (o[0] instanceof BigInteger) {
					rowMonth = ((BigInteger) o[0]).intValue();
				} else if (o[0] instanceof Integer) {
					rowMonth = (int) o[0];
				}
				if (monthArr[i] == rowMonth) {
					contractArr[i] = ((BigInteger) o[1]).intValue();
					break;
				}
			}
		}
		AdminDashBoardMonthlyVO boardMonthlyVO = new AdminDashBoardMonthlyVO();
		ArrayUtils.reverse(monthArr);
		ArrayUtils.reverse(contractArr);

		String[] dateArr = new String[6];

		for (int i = 0; i < 6; i++) {
			StringBuilder date = new StringBuilder();
			date.append(String.format("%02d", monthArr[i]));
			date.append("/");
			if (monthArr[i] > currentMonth) {
				date.append(String.format("%04d", currentYear - 1));
			} else {
				date.append(String.format("%04d", currentYear));
			}

			dateArr[i] = date.toString();
		}

		boardMonthlyVO.setMonth(dateArr);
		boardMonthlyVO.setContractCount(contractArr);
		return boardMonthlyVO;
	}

	public AdminDashBoardStatusVO adminCountStatus() {

		Query query = em.createNativeQuery("SELECT c.status, count(1) FROM contract c GROUP BY c.status");

		@SuppressWarnings("unchecked")
		List<Object[]> result = query.getResultList();

		String[] status = new String[5];

		int[] contractArr = new int[5];

		status[0] = ContractConstant.WAITING_TENANT_CONFIRM;
		status[1] = ContractConstant.IS_ACTIVE;
		status[2] = ContractConstant.EXPIRED;
		status[3] = ContractConstant.TERMINATE;
		status[4] = ContractConstant.REQUEST_TERMINATE;

		for (int i = 0; i < 5; i++) {
			for (Object[] o : result) {
				if (status[i].equals(o[0])) {
					contractArr[i] = ((BigInteger) o[1]).intValue();
					break;
				}
				contractArr[i] = 0;
			}
		}

		AdminDashBoardStatusVO boardStatusVO = new AdminDashBoardStatusVO();
		boardStatusVO.setStatusName(status);

		boardStatusVO.setCountContract(contractArr);

		return boardStatusVO;
	}
}
