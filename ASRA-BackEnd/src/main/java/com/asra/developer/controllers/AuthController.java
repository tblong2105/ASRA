package com.asra.developer.controllers;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import javax.transaction.Transactional;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.asra.developer.common.constants.MessageConstants;
import com.asra.developer.common.enums.ERole;
import com.asra.developer.common.error.BussinessExeption;
import com.asra.developer.models.entity.Account;
import com.asra.developer.models.entity.AddressMaster;
import com.asra.developer.models.entity.Role;
import com.asra.developer.models.payload.request.LoginRequest;
import com.asra.developer.models.payload.request.SignupRequest;
import com.asra.developer.models.payload.response.JwtResponse;
import com.asra.developer.models.payload.response.MessageResponse;
import com.asra.developer.repository.AccountRepository;
import com.asra.developer.repository.AddressMasterRepositoty;
import com.asra.developer.repository.RoleRepository;
import com.asra.developer.security.jwt.JwtUtils;
import com.asra.developer.security.services.AccountDetailsImpl;
import com.asra.developer.services.AccountServices;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api/auth")
public class AuthController {

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private AccountRepository userRepository;
	
	@Autowired
	private AccountServices accountServices;

	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	private PasswordEncoder encoder;

	@Autowired
	private JwtUtils jwtUtils;

	@Autowired
	private AddressMasterRepositoty addressMasterRepositoty;

	@PostMapping("/signin")
	public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

		Authentication authentication;
		try {
			authentication = authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
		} catch (AuthenticationException e) {
			throw new BussinessExeption(MessageConstants.MSE004);
		}

		SecurityContextHolder.getContext().setAuthentication(authentication);
		String jwt = jwtUtils.generateJwtToken(authentication);

		AccountDetailsImpl userDetails = (AccountDetailsImpl) authentication.getPrincipal();
		List<String> roles = userDetails.getAuthorities().stream().map(item -> item.getAuthority())
				.collect(Collectors.toList());
		
		Account currentAccount = accountServices.getAccountById(userDetails.getId());
		
		String currentAccountAddress = currentAccount.getAddress().getStreetName() + ", " + currentAccount.getAddress().getWard() + ", " + currentAccount.getAddress().getDistrict() + ", " + currentAccount.getAddress().getCity();
		return ResponseEntity.ok(new JwtResponse(jwt, userDetails.getId(), userDetails.getUsername(), currentAccount.getEmail(), currentAccount.getFullName(), currentAccountAddress, userDetails.getImage(), roles));
	}

	@Transactional
	@PostMapping("/signup")
	public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
		if (userRepository.existsByUserName(signUpRequest.getUsername())) {
			throw new BussinessExeption(MessageConstants.MSE002, signUpRequest.getUsername());
		}

		if (userRepository.existsByEmail(signUpRequest.getEmail())) {
			throw new BussinessExeption(MessageConstants.MSE003, signUpRequest.getEmail());
		}
		// Create new user's account
		Account account = new Account(signUpRequest.getUsername(), encoder.encode(signUpRequest.getPassword()));

		Set<Role> roles = new HashSet<>();
		Role userRole = roleRepository.findByName(ERole.ROLE_USER)
				.orElseThrow(() -> new BussinessExeption(MessageConstants.MSE001));
		roles.add(userRole);

		account.setRoles(roles);

		AddressMaster addressMaster = new AddressMaster();

		addressMaster.setCity(signUpRequest.getCity());

		addressMaster.setDistrict(signUpRequest.getDistrict());

		addressMaster.setWard(signUpRequest.getWard());

		addressMaster.setStreetName(signUpRequest.getStreetName());

		account.setAddress(this.addressMasterRepositoty.save(addressMaster));

		account.setFullName(signUpRequest.getFullname());

		account.setPhoneNumber(signUpRequest.getPhoneNumber());

		account.setEmail(signUpRequest.getEmail());
		userRepository.save(account);
		return ResponseEntity.ok(new MessageResponse(MessageConstants.MSI006));
	}
}
