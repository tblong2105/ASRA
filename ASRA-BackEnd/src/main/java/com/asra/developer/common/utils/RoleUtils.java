package com.asra.developer.common.utils;

import java.util.Set;

import com.asra.developer.common.enums.ERole;
import com.asra.developer.models.entity.Role;

public class RoleUtils {
	public static String getRoleHighest(Set<Role> roles) {

		long temp = 0L;
		ERole roleReturn = ERole.ROLE_GUEST;
		for (Role role : roles) {
			if (role.getId() > temp) {
				roleReturn = role.getName();
				temp = role.getId();
			}
		}

		return roleReturn.name();
	}
}
