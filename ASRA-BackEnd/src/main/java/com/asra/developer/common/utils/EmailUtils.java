package com.asra.developer.common.utils;

public class EmailUtils {

	public static String addParamToTemplate(String template, Object... params) {

		String temp = setParam(template, params);

		return temp;
	}

	private static String setParam(String template, Object... params) {

		String returnValue = "";
		String[] stringParams = new String[params.length];
		for (int i = 0; i < params.length; i++) {
			stringParams[i] = StringUtil.nullToEmpty(params[i]);

		}
		if (params == null || params.length == 0) {
			returnValue = template;
		} else {
			int i = 1;
			for (String pa : stringParams) {
				String index = "@@" + String.valueOf(i++);
				template = template.replaceFirst(index, pa);
			}
			returnValue = template;
		}
		return returnValue;
	}
}
