package com.asra.developer.repository;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.asra.developer.models.entity.RoomDetail;

public interface RoomDetailRepository extends JpaRepository<RoomDetail, Long> {

	@Query("SELECT COUNT(*) FROM Contract c " + "INNER JOIN c.roomDetail rd " + "INNER JOIN rd.room r "
			+ "WHERE r.id = ?1 AND c.status = ?2 ")
	int countRoomDetail(Long roomId, String status);

	@Query(value = "select * from room_detail where room_id = ?1 and room_status = 0;", nativeQuery = true)
	List<RoomDetail> getByRoomId(Long id);

	@Transactional
	@Modifying
	@Query(value = "update room_detail set room_status = 1 where id = ?1", nativeQuery = true)
	void setStatusRoomDetailRented(Long roomDetailId);
	
	@Query(value = "select count(*) from room_detail where room_id = ?1 and room_status = 0", nativeQuery = true)
	int countRoomDetailAvailable(Long roomId);

}
