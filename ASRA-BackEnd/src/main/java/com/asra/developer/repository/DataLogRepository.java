package com.asra.developer.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.asra.developer.models.entity.DataLog;

public interface DataLogRepository extends JpaRepository<DataLog, Long>{

//	@Query(value = "select distinct am.ward, am.district, am.city from\n"
//			+ "datalog as dl\n"
//			+ "join address_master as am\n"
//			+ "on dl.room_address_id = am.id\n"
//			+ "where am.district = (select distinct am.district from\n"
//			+ "datalog as dl\n"
//			+ "join address_master as am\n"
//			+ "on dl.room_address_id = am.id\n"
//			+ "where am.city = (select distinct am.city from \n"
//			+ "datalog as dl\n"
//			+ "join address_master as am\n"
//			+ "on dl.room_address_id = am.id\n"
//			+ "where dl.type = 'Search' and dl.account_id = ?1\n"
//			+ "group by am.city\n"
//			+ "order by Count(am.city) desc\n"
//			+ "limit 1)\n"
//			+ "group by am.district\n"
//			+ "order by Count(am.district) desc\n"
//			+ "limit 1) \n"
//			+ "group by am.ward, am.district, am.city\n"
//			+ "order by Count(am.ward) desc\n"
//			+ "limit 1", nativeQuery = true)
	
	@Query(value = "select distinct am.ward, am.district, am.city from datalog as dl join address_master as am on dl.room_address_id = am.id\n"
			+ "where dl.type = 'Search' and dl.account_id = ?1 and am.district = \n"
			+ "(\n"
			+ "select distinct am.district from datalog as dl join address_master as am on dl.room_address_id = am.id\n"
			+ "where dl.type = 'Search' and dl.account_id = ?1 and am.city = \n"
			+ "(\n"
			+ "select distinct am.city from datalog as dl join address_master as am on dl.room_address_id = am.id\n"
			+ "where dl.type = 'Search' and dl.account_id = ?1 \n"
			+ "group by am.city\n"
			+ "order by Count(am.city) desc \n"
			+ "limit 1\n"
			+ ")\n"
			+ "group by am.district\n"
			+ "order by Count(am.district) desc \n"
			+ "limit 1\n"
			+ ")\n"
			+ "group by am.ward, am.district, am.city\n"
			+ "order by Count(am.ward) desc \n"
			+ "limit 1;", nativeQuery = true)
	public String getAddressRecomment(long accountId);
	
	@Query(value="\n"
			+ "select distinct r.room_type_id from room r \n"
			+ "Where r.id in (\n"
			+ "	select distinct dl.room_id\n"
			+ "	from datalog as dl\n"
			+ "	where dl.type = 'View' and dl.account_id = ?1 and NOW() - dl.create_date >= 7)\n"
			+ "    group by r.room_type_id\n"
			+ "order by Count(r.room_type_id) desc limit 1", nativeQuery = true)
	public String getRoomTypeRecomment(long accountId);
	
	@Query(value="select avg(r.rental_price)\n"
			+ "from room r where r.id in (select distinct dl.room_id\n"
			+ "from datalog as dl\n"
			+ "where dl.type = 'View' and dl.account_id = ?1 and NOW() - dl.create_date >= 7)", nativeQuery = true)
	public BigDecimal getAverageRentalPriceRecommnet(long accountId);
	
	@Query(value="\n"
			+ "select um.room_utility_id from datalog as dl\n"
			+ "join datalog_utility as du\n"
			+ "on dl.id = du.datalog_id\n"
			+ "join utility_master as um \n"
			+ "on um.room_utility_id = du.utility_id\n"
			+ "where dl.type = 'Search' and dl.account_id = ?1 and NOW() - dl.create_date >= 7\n"
			+ "group by um.room_utility_id\n"
			+ "order by Count(um.room_utility_id) desc limit 3", nativeQuery = true)
	public List<String> getUltilitiesRecomment(long accountId);
	
	@Query(value="\n"
			+ "select distinct district, city \n"
			+ "from address_master \n"
			+ "where id in (select room_address_id from datalog where type = 'search') \n"
			+ "and district is not null \n"
			+ "and district != '' and city = ?1 \n"
			+ "group by district, city\n"
			+ "order by Count(district) desc limit 5", nativeQuery = true)
	public List<String> getSearchTrend(String accountAddress);
	
	
	@Query(value = "SELECT count(*) FROM datalog where account_id = ?1", nativeQuery = true)
	public int countDatalog(Long accountId);
	
}
