package com.asra.developer.repository.custom;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.asra.developer.common.base.Parameters;
import com.asra.developer.models.entity.Room;
import com.asra.developer.models.payload.request.admin.GetAllRoomRequest;

public interface RoomRepositoryCustom {

	Page<Room> findRoomCustom(Parameters params, Pageable pageable);
	
	Page<Room> findRoomCustomSP(Parameters params, Pageable pageable);

	Page<Room> findMyRoomsInnkeeper(Long id, Pageable pageable);

	Page<Room> findRoomAdminCustom(GetAllRoomRequest request, Pageable pageable);

}
