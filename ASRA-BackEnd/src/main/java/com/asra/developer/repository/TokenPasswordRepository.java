package com.asra.developer.repository;

import java.util.List;

import com.asra.developer.models.entity.TokenPassword;
import com.asra.developer.repository.basic.TokenPasswordRepositoryBasic;
import com.asra.developer.repository.custom.TokenPasswordRepositoryCustom;

public interface TokenPasswordRepository extends TokenPasswordRepositoryBasic, TokenPasswordRepositoryCustom {
	List<TokenPassword> findByToken(String token);
}
