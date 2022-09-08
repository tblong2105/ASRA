package com.asra.developer.common.utils;

import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.ResourceBundle;
import java.util.stream.Collectors;

public class MessageUtil {
	private static final String FILE_MESSAGE = "SystemMessage";

	private static Map<String, String[]> messageMap;

	static {
		List<String[]> messageList = new ArrayList<>();

		ResourceBundle bundle = ResourceBundle.getBundle(FILE_MESSAGE);
		for (String key : bundle.keySet()) {
			messageList.add(new String[] { key, bundle.getString(key) });
		}
		messageMap = messageList.stream().collect(Collectors.toMap(s -> s[0], s -> s));
	}

	public MessageUtil() {

	}

	public static String createMessage(String messageId, Object... params) {
		String[] message = messageMap.get(messageId);
		if (message == null) {
			return null;
		}

		StringBuilder sb = new StringBuilder();
		if (params == null || params.length == 0) {
			sb.append(message[1]);
		} else {
			String[] newParam = new String[params.length + 1];
			newParam[0] = "";
			System.arraycopy(params, 0, newParam, 1, params.length);

			MessageFormat format = new MessageFormat(message[1]);
			sb.append(format.format(newParam));
		}

		return sb.toString();
	}

}
