package com.asra.developer.security.services;

import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.asra.developer.models.entity.Account;
import com.fasterxml.jackson.annotation.JsonIgnore;

public class AccountDetailsImpl implements UserDetails {

	private static final long serialVersionUID = 1L;

	private Long id;

	private String userName;

	@JsonIgnore
	private String password;
	
	private String image;

	private Collection<? extends GrantedAuthority> authorities;

	public AccountDetailsImpl(Long id, String userName, String password, String image,
			Collection<? extends GrantedAuthority> authorities) {
		this.id = id;
		this.userName = userName;
		this.password = password;
		this.image = image;
		this.authorities = authorities;
	}

	public static AccountDetailsImpl build(Account account) {
		List<GrantedAuthority> authorities = account.getRoles().stream()
				.map(role -> new SimpleGrantedAuthority(role.getName().name())).collect(Collectors.toList());

		return new AccountDetailsImpl(account.getId(), account.getUserName(), account.getPassword(), account.getImage(), authorities);
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		// TODO Auto-generated method stub
		return authorities;
	}

	@Override
	public String getPassword() {
		// TODO Auto-generated method stub
		return password;
	}

	@Override
	public String getUsername() {
		// TODO Auto-generated method stub
		return userName;
	}
	
	public String getImage() {
		return image;
	}
	
	public void setImage(String image) {
		this.image = image;
	}

	@Override
	public boolean isAccountNonExpired() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isEnabled() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (o == null || getClass() != o.getClass())
			return false;
		AccountDetailsImpl account = (AccountDetailsImpl) o;
		return Objects.equals(id, account.id);
	}

}
