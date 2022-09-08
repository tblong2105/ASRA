package com.asra.developer.services;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.asra.developer.models.entity.Innkeeper;
import com.asra.developer.models.payload.response.InnkeeperInformationResponse;
import com.asra.developer.repository.InnkeeperRepository;

@Service
public class InnkeeperSevices {

	@Autowired
	private InnkeeperRepository innkeeperRepository;

	@Autowired
	private ModelMapper mapper;

	public InnkeeperInformationResponse getInnkeeperInformation(Long innkeeperId) {

		Innkeeper innkeeperEntity = innkeeperRepository.getByAccountId(innkeeperId);
		InnkeeperInformationResponse innkeeperInformationResponse = mapper.map(innkeeperEntity,
				InnkeeperInformationResponse.class);

		innkeeperInformationResponse.setAccountId(innkeeperEntity.getAccount().getId());
		innkeeperInformationResponse.setPhoneNumber(innkeeperEntity.getAccount().getPhoneNumber());

		return innkeeperInformationResponse;

	}
}
