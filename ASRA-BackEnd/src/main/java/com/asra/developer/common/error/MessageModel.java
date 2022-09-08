package com.asra.developer.common.error;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.asra.developer.common.utils.MessageUtil;
import com.asra.developer.common.utils.StringUtil;
import com.asra.developer.security.jwt.JwtUtils;

public class MessageModel {

	private final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

	private String messageId;

	private List<Object> messageParams;

	private String messageDetail;

	public MessageModel() {

	}

	public MessageModel(String messageId, Object... messageParams) {
		String[] stringParams = new String[messageParams.length];
		for (int i = 0; i < messageParams.length; i++) {
			stringParams[i] = StringUtil.nullToEmpty(messageParams[i]);

		}

		String msg = MessageUtil.createMessage(messageId, (Object[]) stringParams);
		if (msg == null) {
			String msgString = "MessageID:" + messageId + "Not found!";
			this.logger.error(msgString);
			this.setMessageDetail(null);

			this.setMessageId(messageId);

			List<Object> paramList = new ArrayList<>();
			paramList.add(messageParams);
			this.setMessageParams(paramList);
		} else {
			this.setMessageId(messageId);

			List<Object> paramList = new ArrayList<>();

			paramList.add(messageParams);

			this.setMessageDetail(msg);

			this.setMessageParams(paramList);
		}
	}

	public String getMessageId() {
		return messageId;
	}

	public void setMessageId(String messageId) {
		this.messageId = messageId;
	}

	public List<Object> getMessageParams() {
		return messageParams;
	}

	public void setMessageParams(List<Object> messageParams) {
		this.messageParams = messageParams;
	}

	public String getMessageDetail() {
		return messageDetail;
	}

	public void setMessageDetail(String messageDetail) {
		this.messageDetail = messageDetail;
	}

}
