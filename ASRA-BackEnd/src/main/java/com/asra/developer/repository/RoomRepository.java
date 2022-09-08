package com.asra.developer.repository;

import java.math.BigDecimal;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.asra.developer.models.entity.Room;
import com.asra.developer.repository.basic.RoomRepositotyBasic;
import com.asra.developer.repository.custom.RoomRepositoryCustom;

public interface RoomRepository extends RoomRepositotyBasic, RoomRepositoryCustom {

	@Query(value = "select deposit from room where id = ?1", nativeQuery = true)
	BigDecimal getRoomRentalPriceById(Long roomId);
	
	
	@Transactional
	@Modifying
	@Query(value = "update room set status = 0 where id = ?1 and ((select count(*) from room_detail where room_id = ?1 and room_status = 0) = 0)", nativeQuery = true)
	void CheckVisibleRoomAfterCreateContract(Long roomId);
	
	@Transactional
	@Modifying
	@Query(value = "update room set status = 1 where id = ?1 and ((select count(*) from room_detail where room_id = ?1 and room_status = 0) > 0)", nativeQuery = true)
	void CheckVisibleRoomAfterTerminateContract(Long roomId);
	
	@Query(value = "SELECT * FROM room WHERE \n"
			+ "(((acos(sin((?1*pi()/180)) * \n"
			+ "sin((lat*pi()/180)) + \n"
			+ "cos((?1*pi()/180)) * \n"
			+ "cos((lat*pi()/180)) * \n"
			+ "cos(((?2- lng) * pi()/180)))) * \n"
			+ "180/pi()) * 60 * 1.1515 * 1.609344) <= ?3\n"
			+ "order by create_date desc\n"
			+ "limit 100", nativeQuery = true)
	List<Room> findRoomAround(String curentLat, String curentLng, int raidus);
}
