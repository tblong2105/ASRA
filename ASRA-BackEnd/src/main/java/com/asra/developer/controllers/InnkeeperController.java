package com.asra.developer.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.asra.developer.models.payload.response.InnkeeperInformationResponse;
import com.asra.developer.services.InnkeeperSevices;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api/innkeeper")
public class InnkeeperController {

	@Autowired
	private InnkeeperSevices innkeeperSevices;

	@GetMapping("/information/{innkeeperId}")
	public ResponseEntity<InnkeeperInformationResponse> getInnkeeperInformation(
			@PathVariable("innkeeperId") String innkeeperId) {
		InnkeeperInformationResponse innkeeperInformationResponse = innkeeperSevices
				.getInnkeeperInformation(Long.parseLong(innkeeperId));
		return new ResponseEntity<>(innkeeperInformationResponse, HttpStatus.OK);
	}
}
