package com.asra.developer.services;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.asra.developer.common.constants.RoomTypeConstants;
import com.asra.developer.common.enums.ERoomTypes;
import com.asra.developer.common.enums.EUtilities;
import com.asra.developer.models.entity.AddressMaster;
import com.asra.developer.models.entity.DataLog;
import com.asra.developer.models.entity.UtilityMaster;
import com.asra.developer.models.payload.request.SearchRoomRequest;
import com.asra.developer.repository.AddressMasterRepositoty;
import com.asra.developer.repository.DataLogRepository;
import com.asra.developer.repository.UtilityMasterRepositoty;

@Service
public class DataLogServices {

	@Autowired
	private DataLogRepository dataLogRepository;

	@Autowired
	private AccountServices accountServices;

	@Autowired
	private AddressMasterRepositoty addressMasterRepositoty;

	@Autowired
	private UtilityMasterRepositoty utilityMasterRepositoty;

	public List<String> getSearchTrend() {
		List<String> searchTrend = new ArrayList<>();
		String curentAddress = "Thành Phố Đà Nẵng";
		searchTrend = dataLogRepository.getSearchTrend(curentAddress);
		return searchTrend;
	}

	public SearchRoomRequest getSearchRoomRequest() {
		SearchRoomRequest searchRoomRequest = new SearchRoomRequest();
		String[] addressRecomment = getAddressRecomment();

		// Address
		if (addressRecomment != null && addressRecomment.length > 2) {
			searchRoomRequest.setWard(addressRecomment[0]);
			String[] districtTemp = { addressRecomment[1] };
			searchRoomRequest.setDistrict(districtTemp);
			searchRoomRequest.setCity(addressRecomment[2]);
		} else {
			searchRoomRequest.setWard(null);
			searchRoomRequest.setDistrict(null);
			searchRoomRequest.setCity(null);
		}

		// RoomType
		String roomTypeRecomment = getRoomTypeRecomment();
		if (roomTypeRecomment != null) {
			switch (roomTypeRecomment) {
			case RoomTypeConstants.R01:
				searchRoomRequest.setDormitory(true);
				break;
			case RoomTypeConstants.R02:
				searchRoomRequest.setRoomForRent(true);
				break;
			case RoomTypeConstants.R03:
				searchRoomRequest.setApartment(true);
				break;
			case RoomTypeConstants.R04:
				searchRoomRequest.setWholeHouse(true);
				break;
			case RoomTypeConstants.R05:
				searchRoomRequest.setSharedRoom(true);
				break;
			default:
				break;
			}
		}

		// Utility
		List<String> utilitiesRecomment = getUltilitiesRecomment();

		Set<String> setUtils = new HashSet<>();
		utilitiesRecomment.forEach(v -> {
			setUtils.add(v);
		});

		searchRoomRequest.setUtilities_bed(setUtils.contains(EUtilities.BED.getValue()));
		searchRoomRequest.setUtilities_wm(setUtils.contains(EUtilities.WM.getValue()));
		searchRoomRequest.setUtilities_time(setUtils.contains(EUtilities.TIME.getValue()));
		searchRoomRequest.setUtilities_ac(setUtils.contains(EUtilities.AC.getValue()));
		searchRoomRequest.setUtilities_refrigerator(setUtils.contains(EUtilities.REFRIGERATOR.getValue()));
		searchRoomRequest.setUtilities_wifi(setUtils.contains(EUtilities.WIFI.getValue()));
		searchRoomRequest.setUtilities_parking(setUtils.contains(EUtilities.PARKING.getValue()));
		searchRoomRequest.setUtilities_toilet(setUtils.contains(EUtilities.TOILET.getValue()));
		searchRoomRequest.setUtilities_kitchen(setUtils.contains(EUtilities.KITCHEN.getValue()));
		searchRoomRequest.setUtilities_television(setUtils.contains(EUtilities.TELEVISION.getValue()));

		// Rental Price
		int averateRentalPrice = getAverageRentalPriceRecommnet();
		if (averateRentalPrice == -1) {
			searchRoomRequest.setMinPrice(new BigDecimal(0));
			searchRoomRequest.setMaxPrice(new BigDecimal(20000000));
		} else {
			searchRoomRequest.setMinPrice(new BigDecimal(averateRentalPrice - averateRentalPrice / 2));
			searchRoomRequest.setMaxPrice(new BigDecimal(averateRentalPrice + averateRentalPrice / 2));
		}

		// Pagination
		searchRoomRequest.setPage(1);
		searchRoomRequest.setSortBy("latest");
		return searchRoomRequest;
	}

	public String[] getAddressRecomment() {

		try {
			String stringAddressBetakeCare = dataLogRepository
					.getAddressRecomment(accountServices.getCurrentAccountId());
			if (stringAddressBetakeCare != null) {
				String[] addressBetakeCare = stringAddressBetakeCare.split(",");
				return addressBetakeCare;
			} else {
				return null;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		return null;
	}

	public String getRoomTypeRecomment() {
		return dataLogRepository.getRoomTypeRecomment(accountServices.getCurrentAccountId());
	}

	public List<String> getUltilitiesRecomment() {
		List<String> listUtilitiesBeTakeCare = dataLogRepository
				.getUltilitiesRecomment(accountServices.getCurrentAccountId());
		return listUtilitiesBeTakeCare;
	}

	public int getAverageRentalPriceRecommnet() {
		int averagePriceBeTakeCare = -1;
		try {
			averagePriceBeTakeCare = dataLogRepository
					.getAverageRentalPriceRecommnet(accountServices.getCurrentAccountId()).intValue();
		} catch (Exception e) {
			averagePriceBeTakeCare = -1;
		}
		return averagePriceBeTakeCare;

	}

	public void DataRecordingViewDetail(Long roomId) {
		DataLog dataLog = new DataLog(roomId, accountServices.getCurrentAccountId(), "View");
		dataLogRepository.save(dataLog);

	}

	public void DataRecordingSearchAndFilter(SearchRoomRequest searchRoomRequest) {
		DataLog dataLog = new DataLog();
		
		String districtTemp = (searchRoomRequest.getDistrict() != null && searchRoomRequest.getDistrict().length > 0) ? searchRoomRequest.getDistrict()[0]
				: "";
		
		AddressMaster addressMaster = new AddressMaster(searchRoomRequest.getCity(),
				districtTemp,
				searchRoomRequest.getWard(), searchRoomRequest.getStreetName(), "Datalog");

		List<String> getUtilities = this.getUtilities(searchRoomRequest);
		Set<UtilityMaster> setUtilityMasters = new HashSet<>();
		getUtilities.stream().forEach(v -> {
			UtilityMaster utilityMastersOP = utilityMasterRepositoty.getById(v);
			setUtilityMasters.add(utilityMastersOP);
		});

		dataLog.setAccountId(accountServices.getCurrentAccountId());
		dataLog.setAddress(addressMasterRepositoty.save(addressMaster));
		dataLog.setUtilities(setUtilityMasters);
		dataLog.setType("Search");

		dataLogRepository.save(dataLog);
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

	@SuppressWarnings("unused")
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

	public SearchRoomRequest copyParamSearchRoomRequest(SearchRoomRequest searchRoomRequestV0,
			SearchRoomRequest searchRoomRequestResult) {
		if (searchRoomRequestV0.getMinPrice() != null) {
			searchRoomRequestResult.setMinPrice(searchRoomRequestV0.getMinPrice());
		}
		if (searchRoomRequestV0.getMaxPrice() != null) {
			searchRoomRequestResult.setMaxPrice(searchRoomRequestV0.getMaxPrice());
		}

		if (searchRoomRequestV0.isApartment() || searchRoomRequestV0.isDormitory()
				|| searchRoomRequestV0.isRoomForRent() || searchRoomRequestV0.isWholeHouse()
				|| searchRoomRequestV0.isSharedRoom()) {
			searchRoomRequestResult.setApartment(searchRoomRequestV0.isApartment());
			searchRoomRequestResult.setDormitory(searchRoomRequestV0.isDormitory());
			searchRoomRequestResult.setRoomForRent(searchRoomRequestV0.isRoomForRent());
			searchRoomRequestResult.setWholeHouse(searchRoomRequestV0.isWholeHouse());
			searchRoomRequestResult.setSharedRoom(searchRoomRequestV0.isSharedRoom());
		}

		if (searchRoomRequestV0.isUtilities_bed() || searchRoomRequestV0.isUtilities_wm()
				|| searchRoomRequestV0.isUtilities_time() || searchRoomRequestV0.isUtilities_ac()
				|| searchRoomRequestV0.isUtilities_refrigerator() || searchRoomRequestV0.isUtilities_wifi()
				|| searchRoomRequestV0.isUtilities_parking() || searchRoomRequestV0.isUtilities_toilet()
				|| searchRoomRequestV0.isUtilities_kitchen() || searchRoomRequestV0.isUtilities_television()) {
			searchRoomRequestResult.setUtilities_bed(searchRoomRequestV0.isUtilities_bed());
			searchRoomRequestResult.setUtilities_wm(searchRoomRequestV0.isUtilities_wm());
			searchRoomRequestResult.setUtilities_time(searchRoomRequestV0.isUtilities_time());
			searchRoomRequestResult.setUtilities_ac(searchRoomRequestV0.isUtilities_ac());
			searchRoomRequestResult.setUtilities_refrigerator(searchRoomRequestV0.isUtilities_refrigerator());
			searchRoomRequestResult.setUtilities_wifi(searchRoomRequestV0.isUtilities_wifi());
			searchRoomRequestResult.setUtilities_parking(searchRoomRequestV0.isUtilities_parking());
			searchRoomRequestResult.setUtilities_toilet(searchRoomRequestV0.isUtilities_toilet());
			searchRoomRequestResult.setUtilities_kitchen(searchRoomRequestV0.isUtilities_kitchen());
			searchRoomRequestResult.setUtilities_television(searchRoomRequestV0.isUtilities_television());
		}

		searchRoomRequestResult.setPage(1);
		searchRoomRequestResult.setSortBy("latest");

		return searchRoomRequestResult;
	}

	public boolean checkNewAccount(Long accountId) {
		return dataLogRepository.countDatalog(accountId) == 0;
	}
}
