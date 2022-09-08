package com.asra.developer.services;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.asra.developer.common.constants.ContractConstant;
import com.asra.developer.common.constants.DepositConstant;
import com.asra.developer.common.constants.MessageConstants;
import com.asra.developer.common.constants.PaymentConstant;
import com.asra.developer.common.constants.SystemConstants;
import com.asra.developer.common.enums.EUtilities;
import com.asra.developer.common.error.BussinessExeption;
import com.asra.developer.common.utils.StringUtil;
import com.asra.developer.models.entity.Account;
import com.asra.developer.models.entity.AddressMaster;
import com.asra.developer.models.entity.Bill;
import com.asra.developer.models.entity.Contract;
import com.asra.developer.models.entity.ImageMaster;
import com.asra.developer.models.entity.Room;
import com.asra.developer.models.entity.RoomDetail;
import com.asra.developer.models.entity.RoomType;
import com.asra.developer.models.entity.UtilityMaster;
import com.asra.developer.models.payload.request.CreateRoomRequest;
import com.asra.developer.models.payload.request.EditRoomRequest;
import com.asra.developer.models.payload.request.ImageRequest;
import com.asra.developer.models.payload.request.MyRoomRequest;
import com.asra.developer.models.payload.request.RoomAroundRequest;
import com.asra.developer.models.payload.request.RoomDetailRequest;
import com.asra.developer.models.payload.response.CreateRoomResponse;
import com.asra.developer.models.payload.response.DataRoomDetail;
import com.asra.developer.models.payload.response.DetailRoomResponse;
import com.asra.developer.models.payload.response.EditRoomResponse;
import com.asra.developer.models.payload.response.ImageResponse;
import com.asra.developer.models.payload.response.MessageResponse;
import com.asra.developer.models.payload.response.MyRoomResponse;
import com.asra.developer.models.payload.response.RentedRoomDetailResponse;
import com.asra.developer.models.payload.response.vo.MyRoomResponseVO;
import com.asra.developer.models.payload.response.vo.SearchRoomResponseVO;
import com.asra.developer.repository.AccountRepository;
import com.asra.developer.repository.AddressMasterRepositoty;
import com.asra.developer.repository.BillRepository;
import com.asra.developer.repository.ContractRepository;
import com.asra.developer.repository.DepositRepository;
import com.asra.developer.repository.ImageMasterRepositoty;
import com.asra.developer.repository.RoomDetailRepository;
import com.asra.developer.repository.RoomRepository;

@Service
public class RoomServices {

	@Autowired
	private ModelMapper mapper;

	@Autowired
	private RoomRepository roomRepository;

	@Autowired
	private AddressMasterRepositoty addressMasterRepositoty;

	@Autowired
	private ImageMasterRepositoty imageMasterRepositoty;

	@Autowired
	private RoomDetailRepository roomDetailRepository;

	@Autowired
	private AccountServices accountServices;

	@Autowired
	private AccountRepository accountRepository;

	@Autowired
	private ContractRepository contractRepository;

	@Autowired
	private DepositRepository depositRepository;

	@Autowired
	private DataLogServices dataLogServices;

	@Autowired
	private BillRepository billRepository;

	public Room getRoomById(Long roomId) {
		return roomRepository.getById(roomId);
	}

	public ResponseEntity<List<SearchRoomResponseVO>> getRoomAround(@RequestBody RoomAroundRequest roomAroundRequest) {
		List<Room> listRoomAround = roomRepository.findRoomAround(roomAroundRequest.getCurrentLat(),
				roomAroundRequest.getCurrentLng(), roomAroundRequest.getRadius());
		List<SearchRoomResponseVO> searchRoomResponses = new ArrayList<>();

		listRoomAround.stream().forEach(x -> searchRoomResponses.add(mapper.map(x, SearchRoomResponseVO.class)));

		return new ResponseEntity<>(searchRoomResponses, HttpStatus.OK);
	}

	public String visibleRoom(Long roomId) {
		Room currentRoom = roomRepository.findById(roomId).get();
		String result;

		// Check if avaiable room = 0
		if (roomDetailRepository.countRoomDetailAvailable(roomId) == 0 && !currentRoom.isStatus()) {
			throw new BussinessExeption(MessageConstants.MSE026);
		}

		currentRoom.setStatus(!currentRoom.isStatus());
		Room newRoom = roomRepository.save(currentRoom);

		if (newRoom.isStatus()) {
			result = "This room is visible";
		} else {
			result = "This room is invisible";
		}
		return result;
	}

	public CreateRoomResponse createRoom(CreateRoomRequest createRoomRequest) {

		Room room = new Room();

		room.setTitle(createRoomRequest.getTitle());

		room.setCapacity(createRoomRequest.getCapacity());

		room.setRoomGenderFlg(createRoomRequest.getGender());

		room.setRoomArea(createRoomRequest.getRoomArea());

		room.setRentalPrice(createRoomRequest.getRentalPrice());

		room.setDeposit(createRoomRequest.getDeposit());

		room.setElectricityCost(createRoomRequest.getElectricityCost());

		room.setWaterCost(createRoomRequest.getWaterCost());

		room.setInternetCost(createRoomRequest.getInternetCost());

		room.setDescription(createRoomRequest.getDescription());

		room.setLat(createRoomRequest.getLat());

		room.setLng(createRoomRequest.getLng());

		createRoomRequest.getUtilities().stream().forEach(v -> {
			room.getUtilities().add(new UtilityMaster(v));
		});

		AddressMaster addressMaster = new AddressMaster(createRoomRequest.getCity(), createRoomRequest.getDistrict(),
				createRoomRequest.getWard(), createRoomRequest.getStreetName());

		room.setAddress(addressMasterRepositoty.save(addressMaster));
		
		room.setRoomType(new RoomType(createRoomRequest.getRoomType()));

		if (createRoomRequest.getImageList().isEmpty()) {
			throw new BussinessExeption(MessageConstants.MSE001);
		}

		room.setThubnailImage(createRoomRequest.getImageList().get(0).getImageLink());

		room.setThumbnailImageName(createRoomRequest.getImageList().get(0).getImageName());

		for (int i = 1; i < createRoomRequest.getImageList().size(); i++) {
			ImageMaster img = new ImageMaster(createRoomRequest.getImageList().get(i).getImageLink(),
					createRoomRequest.getImageList().get(i).getImageName());
			room.getRoomImage().add(this.imageMasterRepositoty.save(img));
		}

		Optional<Account> accountOp = accountRepository.findByUserName(accountServices.getCurrentAccountUsername());

		if (!accountOp.isPresent()) {
			throw new BussinessExeption(MessageConstants.MSE001);
		}

		room.setAccount(accountOp.get());

		room.setStatus(true);

		roomRepository.save(room);

		List<RoomDetail> listRoomDetails = new ArrayList<RoomDetail>();

		for (String roomName : createRoomRequest.getRoomsName()) {
			RoomDetail roomDetail = new RoomDetail();
			roomDetail.setRoomNo(roomName);
			roomDetail.setRoomStatus(false);
			roomDetail.setRoom(room);
			listRoomDetails.add(roomDetail);
		}

		room.getRoomDetails().addAll(this.roomDetailRepository.saveAll(listRoomDetails));

		CreateRoomResponse createRoomResponse = new CreateRoomResponse();
		createRoomResponse.setRoomId(room.getId());
		createRoomResponse.setMessage(new MessageResponse(MessageConstants.MSI007));

		return createRoomResponse;
	}

	public ResponseEntity<?> editRoom(EditRoomRequest editRoomRequest) {
		Set<UtilityMaster> utilityMasterSet = new HashSet<>();
		Set<ImageMaster> imageMasterSet = new HashSet<>();
		Set<String> duplicateRoomNoSet = new HashSet<>();
		List<RoomDetail> listRoomDetails = new ArrayList<>();
		EditRoomResponse editRoomResponse = new EditRoomResponse();

		Optional<Room> roomOp = roomRepository.findById(editRoomRequest.getRoomId());
		if (roomOp.isPresent()) {
			Room room = roomOp.get();
			if (editRoomRequest.getDeleteImageFlag() != null && editRoomRequest.getDeleteImageFlag()) {
				ImageRequest imageRequest = editRoomRequest.getThumbnailImage();
				room.setThubnailImage(imageRequest.getImageLink());
				room.setThumbnailImageName(imageRequest.getImageName());

				roomRepository.save(room);

				return new ResponseEntity<>(HttpStatus.OK);
			} else {
				room.setTitle(editRoomRequest.getTitle());
				room.setCapacity(editRoomRequest.getCapacity());
				room.setRoomGenderFlg(editRoomRequest.getGender());
				room.setRoomArea(editRoomRequest.getRoomArea());
				room.setRentalPrice(editRoomRequest.getRentalPrice());
				room.setDeposit(editRoomRequest.getDeposit());
				room.setElectricityCost(editRoomRequest.getElectricityCost());
				room.setWaterCost(editRoomRequest.getWaterCost());
				room.setInternetCost(editRoomRequest.getInternetCost());
				room.setDescription(editRoomRequest.getDescription());
				room.setRoomType(new RoomType(editRoomRequest.getRoomType()));
				room.setLat(editRoomRequest.getLat());
				room.setLng(editRoomRequest.getLng());

				if (null != room.getAddress()) {
					room.getAddress().setCity(editRoomRequest.getCity());
					room.getAddress().setDistrict(editRoomRequest.getDistrict());
					room.getAddress().setWard(editRoomRequest.getWard());
					room.getAddress().setStreetName(editRoomRequest.getStreetName());

					addressMasterRepositoty.save(room.getAddress());
				}

				// Utilities
				for (String utilityId : editRoomRequest.getUtilities()) {
					UtilityMaster utilityMaster = new UtilityMaster(utilityId);
					utilityMasterSet.add(utilityMaster);
				}
				room.setUtilities(utilityMasterSet);
				room.setThubnailImage(editRoomRequest.getThumbnailImage().getImageLink());
				room.setThumbnailImageName(editRoomRequest.getThumbnailImage().getImageName());

				roomRepository.save(room);

				// Images
				for (ImageRequest image : editRoomRequest.getImageList()) {
					ImageMaster imageMaster = new ImageMaster(image.getImageLink(), image.getImageName());
					imageMasterSet.add(imageMaster);
				}
				room.setRoomImage(imageMasterSet);

				imageMasterRepositoty.saveAll(imageMasterSet);

				for (RoomDetail rd : room.getRoomDetails()) {
					duplicateRoomNoSet.add(rd.getRoomNo());
				}
				for (String roomName : editRoomRequest.getRoomsName()) {
					if (!duplicateRoomNoSet.contains(roomName)) {
						RoomDetail roomDetail = new RoomDetail();
						roomDetail.setRoomNo(roomName);
						roomDetail.setRoomStatus(false);
						roomDetail.setRoom(room);
						listRoomDetails.add(roomDetail);
					}
				}

				roomDetailRepository.saveAll(listRoomDetails);

				editRoomResponse.setRoomId(room.getId());
				editRoomResponse.setMessage(new MessageResponse(MessageConstants.MSI022));

				return new ResponseEntity<>(editRoomResponse, HttpStatus.OK);
			}
		} else {
			throw new BussinessExeption(MessageConstants.MSE010, editRoomRequest.getRoomId());
		}
	}

	public DetailRoomResponse getDetailRoom(RoomDetailRequest roomDetailRequest) {

		DetailRoomResponse response = new DetailRoomResponse();
		List<RentedRoomDetailResponse> roomDetailRentedList = new ArrayList<>();
		List<DataRoomDetail> roomDetailmDropdown = new ArrayList<>();
		long roomId = 0L;
		int countDepositRequest = 0;

		try {
			roomId = Long.parseLong(roomDetailRequest.getRoomId());
		} catch (NumberFormatException e) {
			throw new BussinessExeption(MessageConstants.MSE001);
		}

		// Recording data for recomment system
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication.getPrincipal() != "anonymousUser") {
			dataLogServices.DataRecordingViewDetail(roomId);
		}

		Optional<Room> roomOp = roomRepository.findById(roomId);

		if (roomOp.isPresent()) {
			Room room = roomOp.get();

			response.setCreateDate(room.getInsertDate());

			response.setTitle(room.getTitle());

			response.setCapacity(room.getCapacity());

			response.setTotalRoom(room.getRoomDetails().size());

			int countRoomEmpty = 0;

			for (RoomDetail rd : room.getRoomDetails()) {
				if (!rd.isRoomStatus()) {
					countRoomEmpty++;
				}
				roomDetailmDropdown.add(new DataRoomDetail(rd.getId(), rd.getRoomNo(), rd.isRoomStatus()));
			}

			try {
				roomDetailRentedList = contractRepository.findRoomDetailRented(roomDetailRequest.getAccountId(), roomId,
						ContractConstant.IS_ACTIVE);
			} catch (Exception e) {
				e.printStackTrace();
			}

			response.setTotalRoomEmpty(countRoomEmpty);

			response.setRoomArea(room.getRoomArea());

			response.setRentalPrice(room.getRentalPrice());

			response.setDeposit(room.getDeposit());

			response.setElectricityCost(room.getElectricityCost());

			response.setWaterCost(room.getWaterCost());

			response.setInternetCost(room.getInternetCost());

			response.setDescription(room.getDescription());

			room.getRoomImage().forEach(i -> {
				ImageResponse imageMaster = new ImageResponse(i.getId(), i.getImageUrl(), i.getImageName());
				response.getImageList().add(imageMaster);
			});

			response.setRoomGenderFlg(room.getRoomGenderFlg());

			Set<String> setUtils = new HashSet<>();

			room.getUtilities().forEach(v -> {
				setUtils.add(v.getRoomUtilityId());
			});

			response.setUtilities_bed(setUtils.contains(EUtilities.BED.getValue()));
			response.setUtilities_wm(setUtils.contains(EUtilities.WM.getValue()));
			response.setUtilities_time(setUtils.contains(EUtilities.TIME.getValue()));
			response.setUtilities_ac(setUtils.contains(EUtilities.AC.getValue()));
			response.setUtilities_refrigerator(setUtils.contains(EUtilities.REFRIGERATOR.getValue()));
			response.setUtilities_wifi(setUtils.contains(EUtilities.WIFI.getValue()));
			response.setUtilities_parking(setUtils.contains(EUtilities.PARKING.getValue()));
			response.setUtilities_toilet(setUtils.contains(EUtilities.TOILET.getValue()));
			response.setUtilities_kitchen(setUtils.contains(EUtilities.KITCHEN.getValue()));
			response.setUtilities_television(setUtils.contains(EUtilities.TELEVISION.getValue()));

			if (room.getAddress() != null) {
				response.setCity(room.getAddress().getCity());

				response.setDistrict(room.getAddress().getDistrict());

				response.setWard(room.getAddress().getWard());

				response.setStreetName(room.getAddress().getStreetName());
			}
			
			response.setRoomTypeId(room.getRoomType().getRoomTypeId());

			response.setRoomType(room.getRoomType().getRoomTypeName());
			

			response.setCreateRoomDate(room.getInsertDate());

			response.setInnkeeperEmail(room.getAccount().getEmail());

			response.setInnkeeperFullName(room.getAccount().getFullName());

			response.setInnkeeperImage(room.getAccount().getImage());

			response.setInnkeeperPhoneNumber(room.getAccount().getPhoneNumber());

			response.setInnkeeperId(room.getAccount().getId());

			response.setInnkeeperUserName(room.getAccount().getUserName());

			response.setInnkeeperAddress(room.getAccount().getAddress().getStreetName() + ", "
					+ room.getAccount().getAddress().getWard() + ", " + room.getAccount().getAddress().getDistrict()
					+ ", " + room.getAccount().getAddress().getCity());

			try {
				countDepositRequest = depositRepository.countDepositRequest(room.getId(),
						DepositConstant.PENDING_APPROVAL);
			} catch (Exception e) {
				e.printStackTrace();
			}

			response.setDepositRequestCount(countDepositRequest);

			response.setPaymentStatusWaitingCreateCount(contractRepository.totalContractByRoomId(roomId)
					- billRepository.totalBillAvaiablByRoomIdAndMonthAndYear(roomId,
							(Calendar.getInstance().get(Calendar.MONTH) + 1),
							Calendar.getInstance().get(Calendar.YEAR)));

			response.setRoomDetailDropdown(roomDetailmDropdown);

			response.setRoomDetailRentedList(roomDetailRentedList);

			ImageResponse imageListResponse = new ImageResponse(room.getId(), room.getThubnailImage(),
					room.getThumbnailImageName());

			response.setThumbnail(imageListResponse);
		} else {
			throw new BussinessExeption(MessageConstants.MSE010, roomDetailRequest.getRoomId());
		}

		return response;
	}

	public MyRoomResponse getMyRoomsTenant(MyRoomRequest myRoomRequest) {

		if (myRoomRequest.getId() == 0 || myRoomRequest.getId() == null) {
			myRoomRequest.setId(accountServices.getCurrentAccountId());
		}

		List<MyRoomResponseVO> myRoomResponseVOList = new ArrayList<>();
		MyRoomResponse myRoomResponse = new MyRoomResponse();
		Pageable paging = PageRequest.of(myRoomRequest.getPage() - 1, SystemConstants.MAX_RESULT);
//		Page<Room> pageRooms = null;

		Page<Contract> contracts = contractRepository.findAllByAccountTenantAndStatus(myRoomRequest.getId(),
				ContractConstant.IS_ACTIVE, paging);

		for (Contract contract : contracts.getContent()) {
			MyRoomResponseVO myRoomResponseVO = new MyRoomResponseVO();
			
			myRoomResponseVO.setRoomDetailName(contract.getRoomDetail().getRoomNo());
			
			myRoomResponseVO.setRoomDetailId(contract.getRoomDetail().getId());
			
			myRoomResponseVO.setId(contract.getRoomDetail().getRoom().getId());

			myRoomResponseVO.setTitle(contract.getRoomDetail().getRoom().getTitle());

			myRoomResponseVO.setAddress(StringUtil.getAddressFromDB(contract.getRoomDetail().getRoom().getAddress()));

			myRoomResponseVO.setElectricityCost(contract.getElectronicPrice());

			myRoomResponseVO.setRentalPrice(contract.getRentalPrice());

			myRoomResponseVO.setRoomArea(contract.getRoomDetail().getRoom().getRoomArea());

			myRoomResponseVO.setRoomType(contract.getRoomDetail().getRoom().getRoomType().getRoomTypeName());

			myRoomResponseVO.setThubnailImage(contract.getRoomDetail().getRoom().getThubnailImage());

			myRoomResponseVO.setWaterCost(contract.getWaterPrice());

			myRoomResponseVO.setPaymentDate(contract.getPaymentDate());

			myRoomResponseVO.setInsertDate(contract.getInsertDate());

			int currentMonth = Calendar.getInstance().get(Calendar.MONTH) + 1;
			int currentyear = Calendar.getInstance().get(Calendar.YEAR);
			Bill currentBill = billRepository.getBillByContractAndMonthAndYear(contract.getId(), currentMonth,
					currentyear);
			if (currentBill != null) {
				myRoomResponseVO.setPaymentStatus(currentBill.getStatus());
				myRoomResponseVO.setBillId(currentBill.getId());
			} else {
				myRoomResponseVO.setPaymentStatus(PaymentConstant.WAITING_CREATE_BILL);
			}
			myRoomResponseVOList.add(myRoomResponseVO);
		}

//		try {
//			pageRooms = roomRepository.findMyRoomsTenant(myRoomRequest.getId(), paging);
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//
//		for (Room room : pageRooms.getContent()) {
//
//			MyRoomResponseVO myRoomResponseVO = new MyRoomResponseVO();
//
//			myRoomResponseVO.setId(room.getId());
//
//			myRoomResponseVO.setTitle(room.getTitle());
//
//			myRoomResponseVO.setAddress(StringUtil.getAddressFromDB(room.getAddress()));
//
//			myRoomResponseVO.setElectricityCost(room.getElectricityCost());
//
//			myRoomResponseVO.setRentalPrice(room.getRentalPrice());
//
//			myRoomResponseVO.setRoomArea(room.getRoomArea());
//
//			myRoomResponseVO.setRoomType(room.getRoomType().getRoomTypeName());
//
//			myRoomResponseVO.setThubnailImage(room.getThubnailImage());
//
//			myRoomResponseVO.setWaterCost(room.getWaterCost());
//
//			myRoomResponseVOList.add(myRoomResponseVO);
//		}
//
		myRoomResponse.setRooms(myRoomResponseVOList);

		myRoomResponse.setCurrentPage(contracts.getNumber() + 1);

		myRoomResponse.setTotalItems((int) contracts.getTotalElements());

		myRoomResponse.setTotalPages(contracts.getTotalPages());

		return myRoomResponse;
	}

	public MyRoomResponse getMyRoomsInnkeeper(MyRoomRequest myRoomRequest) {

		List<MyRoomResponseVO> myRoomResponseVOList = new ArrayList<>();
		MyRoomResponse myRoomResponse = new MyRoomResponse();
		Pageable paging = PageRequest.of(myRoomRequest.getPage() - 1, SystemConstants.MAX_RESULT);
		Page<Room> pageRooms = null;
		int countDepositRequest = 0;
		int countRoomEmpty = 0;
		try {

			pageRooms = roomRepository.findMyRoomsInnkeeper(myRoomRequest.getId(), paging);

		} catch (Exception e) {
			e.printStackTrace();
		}

		for (Room room : pageRooms.getContent()) {

			MyRoomResponseVO myRoomResponseVO = new MyRoomResponseVO();

			myRoomResponseVO.setId(room.getId());

			myRoomResponseVO.setTitle(room.getTitle());

			myRoomResponseVO.setAddress(StringUtil.getAddressFromDB(room.getAddress()));

			myRoomResponseVO.setElectricityCost(room.getElectricityCost());

			myRoomResponseVO.setRentalPrice(room.getRentalPrice());

			myRoomResponseVO.setRoomArea(room.getRoomArea());

			myRoomResponseVO.setRoomType(room.getRoomType().getRoomTypeName());

			myRoomResponseVO.setThubnailImage(room.getThubnailImage());

			myRoomResponseVO.setWaterCost(room.getWaterCost());

			myRoomResponseVO.setTotalRoom(room.getRoomDetails().size());

			myRoomResponseVO.setStatus(room.isStatus());

			try {
//				Code cu cua Son
//				Count base on contract and room detail
//				countRoomEmpty = roomDetailRepository.countRoomDetail(room.getId(), ContractConstant.IS_ACTIVE);

				// Count base on status of roomdetail
				countRoomEmpty = roomDetailRepository.countRoomDetailAvailable(room.getId());
				countDepositRequest = depositRepository.countDepositRequest(room.getId(),
						DepositConstant.PENDING_APPROVAL);
			} catch (Exception e) {
				e.printStackTrace();
			}

			myRoomResponseVO.setPaymentStatusWaitingCreateCount(contractRepository.totalContractByRoomId(room.getId())
					- billRepository.totalBillAvaiablByRoomIdAndMonthAndYear(room.getId(),
							(Calendar.getInstance().get(Calendar.MONTH) + 1),
							Calendar.getInstance().get(Calendar.YEAR)));

			myRoomResponseVO.setAvailableRoom(countRoomEmpty);

			myRoomResponseVO.setDepositRequest(countDepositRequest);

			myRoomResponseVOList.add(myRoomResponseVO);
		}

		myRoomResponse.setRooms(myRoomResponseVOList);

		myRoomResponse.setCurrentPage(pageRooms.getNumber() + 1);

		myRoomResponse.setTotalItems((int) pageRooms.getTotalElements());

		myRoomResponse.setTotalPages(pageRooms.getTotalPages());

		return myRoomResponse;
	}
}
