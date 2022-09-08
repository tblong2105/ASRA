package com.asra.developer.repository.basic;

import org.springframework.data.jpa.repository.JpaRepository;

import com.asra.developer.models.entity.TokenPassword;

public interface TokenPasswordRepositoryBasic extends JpaRepository<TokenPassword, Long> {
}
