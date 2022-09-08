package com.asra.developer.security.services;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.asra.developer.models.entity.Account;
import com.asra.developer.repository.AccountRepository;

@Service
public class AccountDetailsServiceImpl implements UserDetailsService {

	@Autowired
	private AccountRepository accountRepository;

	@Override
	@Transactional
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

		Account account = accountRepository.findByUserName(username)
				.orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));

		return AccountDetailsImpl.build(account);
	}

}
