package com.asra.developer.controllers;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.transaction.Transactional;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.asra.developer.common.base.Parameters;
import com.asra.developer.common.constants.MessageConstants;
import com.asra.developer.common.constants.SystemConstants;
import com.asra.developer.common.enums.ERoomTypes;
import com.asra.developer.common.enums.EUtilities;
import com.asra.developer.common.error.BussinessExeption;
import com.asra.developer.common.utils.StringUtil;
import com.asra.developer.models.entity.Account;
import com.asra.developer.models.entity.Room;
import com.asra.developer.models.payload.request.CreateRoomRequest;
import com.asra.developer.models.payload.request.EditRoomRequest;
import com.asra.developer.models.payload.request.MyRoomRequest;
import com.asra.developer.models.payload.request.RoomAroundRequest;
import com.asra.developer.models.payload.request.RoomDetailRequest;
import com.asra.developer.models.payload.request.SearchRoomRequest;
import com.asra.developer.models.payload.request.VisibleRoomRequest;
import com.asra.developer.models.payload.response.AccountInfoResponse;
import com.asra.developer.models.payload.response.CreateRoomResponse;
import com.asra.developer.models.payload.response.DetailRoomResponse;
import com.asra.developer.models.payload.response.MyRoomResponse;
import com.asra.developer.models.payload.response.SearchRoomResponse;
import com.asra.developer.models.payload.response.VisibleRoomResponse;
import com.asra.developer.models.payload.response.vo.SearchRoomResponseVO;
import com.asra.developer.repository.AccountRepository;
import com.asra.developer.repository.RoomRepository;
import com.asra.developer.services.AccountServices;
import com.asra.developer.services.DataLogServices;
import com.asra.developer.services.RoomServices;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api/room")
public class RoomController {

	@Autowired
	private AccountRepository accountRepository;

	@Autowired
	private RoomRepository roomRepositoty;

	@Autowired
	private DataLogServices dataLogServices;

	@Autowired
	private RoomServices roomService;

	@Autowired
	private AccountServices accountServices;

	@GetMapping("/rental-price/{roomId}")
	public BigDecimal getRentalPrice(@PathVariable("roomId") Long roomId) {
		return roomRepositoty.getRoomRentalPriceById(roomId);
	}
	
	
	@GetMapping("/around")
	public ResponseEntity<List<SearchRoomResponseVO>> getRoomAround(@RequestBody RoomAroundRequest roomAroundRequest) {
		return roomService.getRoomAround(roomAroundRequest);
	}

	@Transactional
	@PostMapping("/visible-room")
	public ResponseEntity<VisibleRoomResponse> visibleRoom(@Valid @RequestBody VisibleRoomRequest visibleRoomRequest) {

		VisibleRoomResponse visibleRoomResponse = new VisibleRoomResponse();

		String message = roomService.visibleRoom(visibleRoomRequest.getRoomId());

		visibleRoomResponse.setRoomId(visibleRoomRequest.getRoomId());
		visibleRoomResponse.setMessage(message);
		return new ResponseEntity<>(visibleRoomResponse, HttpStatus.OK);
	}

	@Transactional
	@PostMapping("/create-room")
	public ResponseEntity<?> createRoom(@Valid @RequestBody CreateRoomRequest createRoomRequest) {

		CreateRoomResponse createRoomResponse = roomService.createRoom(createRoomRequest);

		return new ResponseEntity<>(createRoomResponse, HttpStatus.OK);
	}

	@Transactional
	@PostMapping("/edit-room")
	public ResponseEntity<?> editRoom(@Valid @RequestBody EditRoomRequest editRoomRequest) {

		return new ResponseEntity<>(roomService.editRoom(editRoomRequest), HttpStatus.OK);
	}

	@PostMapping("/search-room")
	public ResponseEntity<SearchRoomResponse> searchRoom(@Valid @RequestBody SearchRoomRequest searchRoomRequest,
			boolean isSuggesstion, Integer missingLength) {

		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		// Recording data for recomment system
		if (isSuggesstion != true && authentication.getPrincipal() != "anonymousUser") {
			dataLogServices.DataRecordingSearchAndFilter(searchRoomRequest);
		}

		List<String> utilities = this.getUtilities(searchRoomRequest);

		List<String> roomType = this.getRoomTypes(searchRoomRequest);

		Parameters params = new Parameters();

		params.add(SystemConstants.CITY, searchRoomRequest.getCity());

		String districtTemp = "";
		if (searchRoomRequest.getDistrict() != null && searchRoomRequest.getDistrict().length > 0) {
			districtTemp = this.getListToString(Arrays.asList(searchRoomRequest.getDistrict()));
		}
		params.add(SystemConstants.DISTRICT, districtTemp);

		params.add(SystemConstants.WARD, searchRoomRequest.getWard());

		params.add(SystemConstants.MIN_MONEY, searchRoomRequest.getMinPrice());

		params.add(SystemConstants.MAX_MONEY, searchRoomRequest.getMaxPrice());

		params.add(SystemConstants.UTILITY, this.getListToString(utilities));

		params.add(SystemConstants.UTILITY_NUM, utilities.size());

		params.add(SystemConstants.ROOM_TYPE, this.getListToString(roomType));

		params.add(SystemConstants.ROOM_AREA_MIN, searchRoomRequest.getRoomAreaMin());
		params.add(SystemConstants.ROOM_AREA_MAX, searchRoomRequest.getRoomAreaMax());
		params.add(SystemConstants.LAT, searchRoomRequest.getLat());
		params.add(SystemConstants.LNG, searchRoomRequest.getLng());
		params.add(SystemConstants.RADIUS, searchRoomRequest.getRadius());
		params.add(SystemConstants.SORT_BY, searchRoomRequest.getSortBy());

		Pageable paging = PageRequest.of(searchRoomRequest.getPage() - 1,
				isSuggesstion ? missingLength : SystemConstants.MAX_RESULT);

		Page<Room> pageRooms = roomRepositoty.findRoomCustomSP(params, paging);

		SearchRoomResponse searchRoomResponse = new SearchRoomResponse();

		List<SearchRoomResponseVO> roomVO = new ArrayList<>();

		for (Room room : pageRooms.getContent()) {

			SearchRoomResponseVO responseVO = new SearchRoomResponseVO();

			responseVO.setId(room.getId());

			responseVO.setTitle(room.getTitle());

			responseVO.setAddress(StringUtil.getAddressFromDB(room.getAddress()));

			responseVO.setElectricityCost(room.getElectricityCost());

			responseVO.setRentalPrice(room.getRentalPrice());

			responseVO.setRoomArea(room.getRoomArea());

			responseVO.setRoomType(room.getRoomType().getRoomTypeName());

			responseVO.setThubnailImage(room.getThubnailImage());

			responseVO.setWaterCost(room.getWaterCost());

			roomVO.add(responseVO);
		}

		searchRoomResponse.setRooms(roomVO);

		searchRoomResponse.setCurrentPage(pageRooms.getNumber() + 1);

		searchRoomResponse.setTotalItems((int) pageRooms.getTotalElements());

		searchRoomResponse.setTotalPages(pageRooms.getTotalPages());

		return new ResponseEntity<>(searchRoomResponse, HttpStatus.OK);
	}

	@PostMapping("/detail-room")
	public ResponseEntity<?> getDetailRoom(@RequestBody RoomDetailRequest roomDetailRequest) {

		DetailRoomResponse detailRoomResponse = roomService.getDetailRoom(roomDetailRequest);

		return new ResponseEntity<>(detailRoomResponse, HttpStatus.OK);
	}

	@GetMapping("/search-trend")
	public ResponseEntity<List<String>> getSearchTrend() {
		List<String> dataSearchTrend = dataLogServices.getSearchTrend();
		return new ResponseEntity<>(dataSearchTrend, HttpStatus.OK);
	}

//	@GetMapping("/suggesstion-room")
//	public ResponseEntity<?> SuggesstionRoom() {
//
//		// Get authentication
//		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//
//		// Check authentication is present
//		if (authentication != null && authentication.getPrincipal() != "anonymousUser") {
//
//			// Get datalog behavior
//			SearchRoomRequest searchRoomRequestV0 = dataLogServices.getSearchRoomRequest();
//
//			// Check if is new account
//			if (dataLogServices.checkNewAccount(accountServices.getCurrentAccountId())) {
//				Account currentAccount = accountServices.getCurrentAccount();
//				searchRoomRequestV0.setWard(currentAccount.getAddress().getWard());
//				String[] districtsTemp = { currentAccount.getAddress().getDistrict() };
//				searchRoomRequestV0.setDistrict(districtsTemp);
//				searchRoomRequestV0.setCity(currentAccount.getAddress().getCity());
//			}
//
//			// Data suggestion base on full datalog
//			ResponseEntity<SearchRoomResponse> suggesstionResponseV0 = searchRoom(searchRoomRequestV0, true,
//					SystemConstants.SUGGESSTION_RESULT_LENGTH);
//
//			// Check data, if >= SUGGESSTION_RESULT_LENGTH (20)
//			if (suggesstionResponseV0.getBody().getTotalItems() >= SystemConstants.SUGGESSTION_RESULT_LENGTH) {
//				return suggesstionResponseV0;
//
//				// If data < SUGGESSTION_RESULT_LENGTH (20)
//			} else {
//				String searchTrendCity = dataLogServices.getSearchTrend().get(0).split(",")[1];
//
//				// Reset search condition
//				SearchRoomRequest searchRoomRequestV2 = new SearchRoomRequest();
//				searchRoomRequestV2.setPage(1);
//				searchRoomRequestV2.setSortBy("latest");
//				searchRoomRequestV2.setCity(searchTrendCity);
//				// Get data don't base on any condition with missing length of
//				// SUGGESSTION_RESULT_LENGTH (20)
//				ResponseEntity<SearchRoomResponse> suggesstionResponseV2 = searchRoom(searchRoomRequestV2, true,
//						SystemConstants.SUGGESSTION_RESULT_LENGTH);
//
//				// Filter data don't base on any condition with data base on address user and
//				// datalog are duplicate
//				List<SearchRoomResponseVO> newListV2 = suggesstionResponseV2.getBody().getRooms().stream()
//						.filter((SearchRoomResponseVO roomV2) -> {
//							return !suggesstionResponseV0.getBody().getRooms().stream()
//									.anyMatch(roomV0 -> roomV0.getId() == roomV2.getId());
//						}).collect(Collectors.toList());
//
//				// Add data are not duplicate to data don't base on any condition with missing
//				// length of SUGGESSTION_RESULT_LENGTH (20)
//				suggesstionResponseV0.getBody().getRooms().addAll(newListV2.stream()
//						.limit(20 - suggesstionResponseV0.getBody().getRooms().size()).collect(Collectors.toList()));
//				if (suggesstionResponseV0.getBody().getTotalItems() >= SystemConstants.SUGGESSTION_RESULT_LENGTH) {
//					return suggesstionResponseV0;
//
//					// If data < SUGGESSTION_RESULT_LENGTH (20)
//				} else {
//
//					// Reset search condition
//					SearchRoomRequest searchRoomRequestV3 = new SearchRoomRequest();
//					searchRoomRequestV3.setPage(1);
//					searchRoomRequestV3.setSortBy("latest");
//					// Get data don't base on any condition with missing length of
//					// SUGGESSTION_RESULT_LENGTH (20)
//					ResponseEntity<SearchRoomResponse> suggesstionResponseV3 = searchRoom(searchRoomRequestV3, true,
//							SystemConstants.SUGGESSTION_RESULT_LENGTH);
//
//					// Filter data don't base on any condition with data base on address user and
//					// datalog are duplicate
//					List<SearchRoomResponseVO> newListV3 = suggesstionResponseV3.getBody().getRooms().stream()
//							.filter((SearchRoomResponseVO roomV2) -> {
//								return !suggesstionResponseV0.getBody().getRooms().stream()
//										.anyMatch(roomV0 -> roomV0.getId() == roomV2.getId());
//							}).collect(Collectors.toList());
//
//					// Add data are not duplicate to data don't base on any condition with missing
//					// length of SUGGESSTION_RESULT_LENGTH (20)
//					suggesstionResponseV0.getBody().getRooms()
//							.addAll(newListV3.stream().limit(20 - suggesstionResponseV0.getBody().getRooms().size())
//									.collect(Collectors.toList()));
//					return suggesstionResponseV0;
//				}
//			}
//
//			/*
//			 * // Check data suggestion with full datalog, if >= SUGGESSTION_RESULT_LENGTH
//			 * (20) if (suggesstionResponseV0.getBody().getRooms().size() >=
//			 * SystemConstants.SUGGESSTION_RESULT_LENGTH) { return suggesstionResponseV0;
//			 * 
//			 * // If data suggestion not SUGGESSTION_RESULT_LENGTH (20) yet } else {
//			 * 
//			 * // Copy datalog behavior SearchRoomRequest searchRoomRequestV01 =
//			 * searchRoomRequestV0;
//			 * 
//			 * // Remove ward in behavior searchRoomRequestV01.setWard(null);
//			 * 
//			 * // Data suggestion base on datalog without ward
//			 * ResponseEntity<SearchRoomResponse> suggesstionResponseV01 =
//			 * searchRoom(searchRoomRequestV01, true, 20);
//			 * 
//			 * // Check data suggestion base on datalog without ward, if >= //
//			 * SUGGESSTION_RESULT_LENGTH (20) if
//			 * (suggesstionResponseV01.getBody().getRooms().size() >=
//			 * SystemConstants.SUGGESSTION_RESULT_LENGTH) { return suggesstionResponseV01;
//			 * 
//			 * // If data suggestion base on datalog without ward not
//			 * SUGGESSTION_RESULT_LENGTH // (20) yet } else {
//			 * 
//			 * // Remove district in behavior searchRoomRequestV01.setDistrict(null);
//			 * 
//			 * // Data suggestion base on datalog without ward and district
//			 * ResponseEntity<SearchRoomResponse> suggesstionResponseV02 =
//			 * searchRoom(searchRoomRequestV01, true,
//			 * SystemConstants.SUGGESSTION_RESULT_LENGTH); // Check data suggestion base on
//			 * datalog without ward and district, if >= // SUGGESSTION_RESULT_LENGTH (20)
//			 * 
//			 * if (suggesstionResponseV02.getBody().getRooms() .size() >=
//			 * SystemConstants.SUGGESSTION_RESULT_LENGTH) { return suggesstionResponseV02;
//			 * 
//			 * // If data base on datalog <= SUGGESSTION_RESULT_LENGTH (20) } else {
//			 * 
//			 * // Get AccountInfor AccountInfoResponse accountInfoResponse =
//			 * getInfomation();
//			 * 
//			 * // Binding data for city, district and ward for search condition by address
//			 * user // logged SearchRoomRequest searchRoomRequestV1 = new
//			 * SearchRoomRequest();
//			 * searchRoomRequestV1.setCity(accountInfoResponse.getCity());
//			 * 
//			 * // Init search condition searchRoomRequestV1.setPage(1);
//			 * searchRoomRequestV1.setSortBy("latest");
//			 * 
//			 * // Data suggestion base on address user with missing length of //
//			 * SUGGESSTION_RESULT_LENGTH (20) ResponseEntity<SearchRoomResponse>
//			 * suggesstionResponseV1 = searchRoom(searchRoomRequestV1, true,
//			 * SystemConstants.SUGGESSTION_RESULT_LENGTH);
//			 * 
//			 * // Filter data base on address user with data base on datalog are duplicate
//			 * List<SearchRoomResponseVO> newListV1 =
//			 * suggesstionResponseV1.getBody().getRooms().stream()
//			 * .filter((SearchRoomResponseVO roomV1) -> { return
//			 * !suggesstionResponseV0.getBody().getRooms().stream() .anyMatch(roomV0 ->
//			 * roomV0.getId() == roomV1.getId()); }).collect(Collectors.toList());
//			 * 
//			 * // Add data are not duplicate to data base on datalog with missing length of
//			 * // SUGGESSTION_RESULT_LENGTH (20) suggesstionResponseV0.getBody().getRooms()
//			 * .addAll(newListV1.stream().limit(20 -
//			 * suggesstionResponseV0.getBody().getRooms().size())
//			 * .collect(Collectors.toList()));
//			 * 
//			 * // Check data, if >= SUGGESSTION_RESULT_LENGTH (20) if
//			 * (suggesstionResponseV0.getBody() .getTotalItems() >=
//			 * SystemConstants.SUGGESSTION_RESULT_LENGTH) { return suggesstionResponseV0;
//			 * 
//			 * // If data < SUGGESSTION_RESULT_LENGTH (20) } else { String searchTrendCity =
//			 * dataLogServices.getSearchTrend().get(0).split(",")[1];
//			 * 
//			 * // Reset search condition SearchRoomRequest searchRoomRequestV2 = new
//			 * SearchRoomRequest(); searchRoomRequestV2.setPage(1);
//			 * searchRoomRequestV2.setSortBy("latest");
//			 * searchRoomRequestV2.setCity(searchTrendCity); // Get data don't base on any
//			 * condition with missing length of // SUGGESSTION_RESULT_LENGTH (20)
//			 * ResponseEntity<SearchRoomResponse> suggesstionResponseV2 =
//			 * searchRoom(searchRoomRequestV2, true,
//			 * SystemConstants.SUGGESSTION_RESULT_LENGTH);
//			 * 
//			 * // Filter data don't base on any condition with data base on address user and
//			 * // datalog are duplicate List<SearchRoomResponseVO> newListV2 =
//			 * suggesstionResponseV2.getBody().getRooms().stream()
//			 * .filter((SearchRoomResponseVO roomV2) -> { return
//			 * !suggesstionResponseV0.getBody().getRooms().stream() .anyMatch(roomV0 ->
//			 * roomV0.getId() == roomV2.getId()); }).collect(Collectors.toList());
//			 * 
//			 * // Add data are not duplicate to data don't base on any condition with
//			 * missing // length of SUGGESSTION_RESULT_LENGTH (20)
//			 * suggesstionResponseV0.getBody().getRooms() .addAll(newListV2.stream()
//			 * .limit(20 - suggesstionResponseV0.getBody().getRooms().size())
//			 * .collect(Collectors.toList())); return suggesstionResponseV0; } } } }
//			 */
//			// Check authentication isn't present
//		} else {
////			String searchTrendCity = dataLogServices.getSearchTrend().get(0).split(",")[1];
//			// Reset search condition
//			SearchRoomRequest searchRoomRequestV0 = new SearchRoomRequest();
//			searchRoomRequestV0.setPage(1);
//			searchRoomRequestV0.setSortBy("latest");
//			String currentCity = "Thành Phố Đà Nẵng";
//			searchRoomRequestV0.setCity(currentCity);
//
//			// Get data don't base on any condition
//			ResponseEntity<SearchRoomResponse> suggesstionResponseV0 = searchRoom(searchRoomRequestV0, true,
//					SystemConstants.SUGGESSTION_RESULT_LENGTH);
//			return suggesstionResponseV0;
//		}
//	}
	
	
	@GetMapping("/suggesstion-room")
	public ResponseEntity<?> SuggesstionRoom() {
		int i = 0;
		String defaultCity = "Thành phố Đà Nẵng";

		// Get authentication
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		// Check authentication is present
		if (authentication != null && authentication.getPrincipal() != "anonymousUser") {

			// Get datalog behavior
			SearchRoomRequest searchRoomRequestV0 = dataLogServices.getSearchRoomRequest();

			// Check if is new account
			if (dataLogServices.checkNewAccount(accountServices.getCurrentAccountId())) {
				searchRoomRequestV0.setPage(1);
				searchRoomRequestV0.setSortBy("latest");
				searchRoomRequestV0.setCity(defaultCity);
			}
			
			ResponseEntity<SearchRoomResponse> suggesstionResponseV0 = searchRoom(searchRoomRequestV0, true,
					SystemConstants.SUGGESSTION_RESULT_LENGTH);
			
			while(suggesstionResponseV0.getBody().getRooms().size() <= SystemConstants.SUGGESSTION_RESULT_LENGTH) {
				switch (i) {
				case 0:
					searchRoomRequestV0.setUtilities_ac(false);
					searchRoomRequestV0.setUtilities_bed(false);
					searchRoomRequestV0.setUtilities_kitchen(false);
					searchRoomRequestV0.setUtilities_parking(false);
					searchRoomRequestV0.setUtilities_refrigerator(false);
					searchRoomRequestV0.setUtilities_television(false);
					searchRoomRequestV0.setUtilities_time(false);
					searchRoomRequestV0.setUtilities_toilet(false);
					searchRoomRequestV0.setUtilities_wifi(false);
					searchRoomRequestV0.setUtilities_wm(false);
					searchRoomRequestV0.setDormitory(false);
					searchRoomRequestV0.setApartment(false);
					searchRoomRequestV0.setWholeHouse(false);
					searchRoomRequestV0.setSharedRoom(false);
					searchRoomRequestV0.setRoomForRent(false);
					break;
				case 1:
					searchRoomRequestV0.setMinPrice(BigDecimal.ZERO);
					searchRoomRequestV0.setMaxPrice(new BigDecimal(20000000));
					break;
				case 2:
					searchRoomRequestV0.setWard(null);
					searchRoomRequestV0.setDistrict(null);
					searchRoomRequestV0.setCity(defaultCity);
					break;
				default:
					return suggesstionResponseV0;
				}
				
				ResponseEntity<SearchRoomResponse> suggesstionResponseV1 = searchRoom(searchRoomRequestV0, true,
						SystemConstants.SUGGESSTION_RESULT_LENGTH);
				
				List<SearchRoomResponseVO> newListV1 = suggesstionResponseV1.getBody().getRooms().stream()
						.filter((SearchRoomResponseVO roomV1) -> {
							return !suggesstionResponseV0.getBody().getRooms().stream()
									.anyMatch(roomV0 -> roomV0.getId() == roomV1.getId());
						}).collect(Collectors.toList());

				suggesstionResponseV0.getBody().getRooms().addAll(newListV1.stream()
						.limit(20 - suggesstionResponseV0.getBody().getRooms().size()).collect(Collectors.toList()));
				i++;
			}
			return suggesstionResponseV0;
		} else {
			// Reset search condition
			SearchRoomRequest searchRoomRequestV0 = new SearchRoomRequest();
			searchRoomRequestV0.setPage(1);
			searchRoomRequestV0.setSortBy("latest");
			searchRoomRequestV0.setCity(defaultCity);

			// Get data don't base on any condition
			ResponseEntity<SearchRoomResponse> suggesstionResponseV0 = searchRoom(searchRoomRequestV0, true,
					SystemConstants.SUGGESSTION_RESULT_LENGTH);
			return suggesstionResponseV0;
		}
	}

	@SuppressWarnings("unused")
	private AccountInfoResponse getInfomation() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		AccountInfoResponse accountInfoResponse = new AccountInfoResponse();

		if (authentication != null && authentication.getPrincipal() != null) {
			String userName = ((UserDetails) authentication.getPrincipal()).getUsername();

			Optional<Account> userOp = accountRepository.findByUserName(userName);

			if (userOp.isPresent()) {

				Account user = userOp.get();

				accountInfoResponse.setFullName(StringUtil.nullToEmpty(user.getFullName()));

				accountInfoResponse.setEmail(StringUtil.nullToEmpty(user.getEmail()));

				accountInfoResponse.setAge(user.getAge());

				accountInfoResponse.setGender(user.getGender() == null ? "-1" : user.getGender());

				accountInfoResponse.setProfession(StringUtil.nullToEmpty(user.getProfession()));

				accountInfoResponse.setPhoneNumber(StringUtil.nullToEmpty(user.getPhoneNumber()));

				if (user.getAddress() != null) {
					accountInfoResponse.setCity(user.getAddress().getCity());

					accountInfoResponse.setDistrict(user.getAddress().getDistrict());

					accountInfoResponse.setWard(user.getAddress().getWard());

					accountInfoResponse.setStreetName(user.getAddress().getStreetName());
				}
				accountInfoResponse.setImage(StringUtil.nullToEmpty(user.getImage()));

			} else {
				throw new BussinessExeption(MessageConstants.MSE001);
			}

		} else {
			throw new BussinessExeption(MessageConstants.MSE008);
		}
		return accountInfoResponse;
	}

	@PostMapping("/my-rooms-tenant")
	public ResponseEntity<?> getMyRoomsTenant(@RequestBody MyRoomRequest myRoomRequest) {

		MyRoomResponse myRoomResponse = roomService.getMyRoomsTenant(myRoomRequest);

		return new ResponseEntity<>(myRoomResponse, HttpStatus.OK);
	}

	@PostMapping("/my-rooms-innkeeper")
	public ResponseEntity<?> getMyRoomsInnkeeper(@RequestBody MyRoomRequest myRoomRequest) {

		MyRoomResponse myRoomResponse = roomService.getMyRoomsInnkeeper(myRoomRequest);

		return new ResponseEntity<>(myRoomResponse, HttpStatus.OK);
	}

	private List<String> getUtilities(SearchRoomRequest searchRoomRequest) {
		List<String> utilities = new ArrayList<>();

		if (searchRoomRequest.isUtilities_ac()) {
			utilities.add(EUtilities.AC.getValue());
		}

		if (searchRoomRequest.isUtilities_bed()) {
			utilities.add(EUtilities.BED.getValue());
		}

		if (searchRoomRequest.isUtilities_kitchen()) {
			utilities.add(EUtilities.KITCHEN.getValue());
		}

		if (searchRoomRequest.isUtilities_parking()) {
			utilities.add(EUtilities.PARKING.getValue());
		}

		if (searchRoomRequest.isUtilities_refrigerator()) {
			utilities.add(EUtilities.REFRIGERATOR.getValue());
		}

		if (searchRoomRequest.isUtilities_time()) {
			utilities.add(EUtilities.TIME.getValue());
		}

		if (searchRoomRequest.isUtilities_toilet()) {
			utilities.add(EUtilities.TOILET.getValue());
		}

		if (searchRoomRequest.isUtilities_wifi()) {
			utilities.add(EUtilities.WIFI.getValue());
		}

		if (searchRoomRequest.isUtilities_wm()) {
			utilities.add(EUtilities.WM.getValue());
		}

		if (searchRoomRequest.isUtilities_television()) {
			utilities.add(EUtilities.TELEVISION.getValue());
		}

		return utilities;
	}

	private List<String> getRoomTypes(SearchRoomRequest searchRoomRequest) {
		List<String> roomTypes = new ArrayList<>();

		if (searchRoomRequest.isDormitory()) {
			roomTypes.add(ERoomTypes.DORMITORY.getValue());
		}

		if (searchRoomRequest.isRoomForRent()) {
			roomTypes.add(ERoomTypes.ROOM_FOR_RENT.getValue());
		}

		if (searchRoomRequest.isApartment()) {
			roomTypes.add(ERoomTypes.APARTMENT.getValue());
		}

		if (searchRoomRequest.isWholeHouse()) {
			roomTypes.add(ERoomTypes.WHOLE_HOUSE.getValue());
		}

		if (searchRoomRequest.isSharedRoom()) {
			roomTypes.add(ERoomTypes.SHARED_ROOM.getValue());
		}

		return roomTypes;
	}

	private String getListToString(List<String> input) {
		StringBuilder sp = new StringBuilder();
		if (input != null && input.size() > 0) {
			sp.append("(");
			for (String temp : input) {
				if (temp == null || StringUtil.isEmpty(temp)) {
					return "";
				}
				sp.append("'");
				sp.append(temp);
				sp.append("'");
				sp.append(",");
			}

			sp.delete(sp.length() - 2, sp.length());
			sp.append("')");
			return sp.toString();
		} else {
			return "";
		}
	}
}
