package com.asra.developer.repository.basic;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.asra.developer.models.entity.Room;

public interface RoomRepositotyBasic extends JpaRepository<Room, Long> {

	@Query("SELECT DISTINCT new com.asra.developer.models.entity.Room(r.id, c.insertDate ,r.title, r.roomArea, r.rentalPrice, r.electricityCost, "
			+ "r.waterCost, r.internetCost, r.thubnailImage, r.address, r.roomType) " + "FROM Contract c "
			+ "INNER JOIN c.accountTenant a " + "INNER JOIN c.roomDetail rd " + "INNER JOIN rd.room r "
			+ "WHERE a.id = ?1 ")
	Page<Room> findMyRoomsTenant(Long id, Pageable pageable);

}
