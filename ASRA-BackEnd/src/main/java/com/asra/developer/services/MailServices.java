package com.asra.developer.services;

import java.io.IOException;
import java.text.DecimalFormat;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.asra.developer.common.constants.EmailConstants;
import com.asra.developer.common.constants.SystemConstants;
import com.asra.developer.common.utils.EmailUtils;
import com.asra.developer.models.payload.request.SendMailMonthlyVO;

@Service
@Async
public class MailServices {

	@Autowired
	private JavaMailSender emailSender;

	public void sendResetPassword(String email, String hashCode) throws MessagingException, IOException {
		MimeMessage message = emailSender.createMimeMessage();

		boolean multipart = true;

		MimeMessageHelper helper = new MimeMessageHelper(message, multipart, "utf-8");

		String htmlMsg = EmailUtils.addParamToTemplate(getResetTemplate(), hashCode);

		message.setContent(htmlMsg, "text/html");

		helper.setTo(email);

		helper.setSubject(EmailConstants.RESET_SUBJECT);

		this.emailSender.send(message);

	}

	public void sendMonthlyBill(String email, String subject, SendMailMonthlyVO data)
			throws MessagingException, IOException {

		Object[] content = convertDataMail(data);

		StringBuilder sb = new StringBuilder();
		sb.append(SystemConstants.BASE_URL);

		sb.append("manage");

		content[10] = sb.toString();

		MimeMessage message = emailSender.createMimeMessage();

		boolean multipart = true;

		MimeMessageHelper helper = new MimeMessageHelper(message, multipart, "utf-8");

		String htmlMsg = EmailUtils.addParamToTemplate(getMonthlyTemplate(), content);

		message.setContent(htmlMsg, "text/html; charset=utf-8");

		helper.setTo(email);

		helper.setSubject(subject);

		this.emailSender.send(message);

	}

	private Object[] convertDataMail(SendMailMonthlyVO data) {

		Object[] obj = new Object[11];

		obj[0] = String.valueOf(data.getRoomDetailId());

		obj[1] = String.valueOf(data.getRoomName());

		StringBuilder dueDates = new StringBuilder();

		dueDates.append(data.getDay());
		dueDates.append("/");

		dueDates.append(data.getMonth());
		dueDates.append("/");

		dueDates.append(data.getYear());

		obj[2] = String.valueOf(dueDates.toString());

		obj[3] = String.valueOf(data.getBillId());

		DecimalFormat format = new DecimalFormat("#,###");

		obj[4] = format.format(data.getTotalBill());

		obj[5] = format.format(data.getRentalPrice());

		obj[6] = format.format(data.getElectronicPrice());

		obj[7] = format.format(data.getWaterPrice());

		obj[8] = format.format(data.getInternetPrice());

		obj[9] = format.format(data.getTotalBill());

		return obj;
	}

	private String getResetTemplate() {
		StringBuilder sb = new StringBuilder();

		sb.append(" <!DOCTYPE html>");
		sb.append(
				" <html xmlns:v=\"urn:schemas-microsoft-com:vml\" xmlns:o=\"urn:schemas-microsoft-com:office:office\" lang=\"en\">");

		sb.append(" <head>");
		sb.append(" 	<title></title>");
		sb.append(" 	<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">");
		sb.append(" 	<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">");
		sb.append(
				" 	<!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->");
		sb.append(" 	<style>");

		sb.append(" 		body {");
		sb.append(" 			margin: 0;");
		sb.append(" 			padding: 0;");
		sb.append(" 			box-sizing: border-box;");
		sb.append(" 		}");

		sb.append(" 		a[x-apple-data-detectors] {");
		sb.append(" 			color: inherit !important;");
		sb.append(" 			text-decoration: inherit !important;");
		sb.append(" 		}");

		sb.append(" 		#MessageViewBody a {");
		sb.append(" 			color: inherit;");
		sb.append(" 			text-decoration: none;");
		sb.append(" 		}");

		sb.append(" 		p {");
		sb.append(" 			line-height: inherit");
		sb.append(" 		}");

		sb.append(" 		.desktop_hide,");
		sb.append(" 		.desktop_hide table {");
		sb.append(" 			mso-hide: all;");
		sb.append(" 			display: none;");
		sb.append(" 			max-height: 0px;");
		sb.append(" 			overflow: hidden;");
		sb.append(" 		}");

		sb.append(" 		@media (max-width:660px) {");
		sb.append(" 			.desktop_hide table.icons-inner {");
		sb.append(" 				display: inline-block !important;");
		sb.append(" 			}");

		sb.append(" 			.icons-inner {");
		sb.append(" 				text-align: center;");
		sb.append(" 			}");

		sb.append(" 			.icons-inner td {");
		sb.append(" 				margin: 0 auto;");
		sb.append(" 			}");

		sb.append(" 			.image_block img.big,");
		sb.append(" 			.row-content {");
		sb.append(" 				width: 100% !important;");
		sb.append(" 			}");

		sb.append(" 			.mobile_hide {");
		sb.append(" 				display: none;");
		sb.append(" 			}");

		sb.append(" 			.stack .column {");
		sb.append(" 				width: 100%;");
		sb.append(" 				display: block;");
		sb.append(" 			}");

		sb.append(" 			.mobile_hide {");
		sb.append(" 				min-height: 0;");
		sb.append(" 				max-height: 0;");
		sb.append(" 				max-width: 0;");
		sb.append(" 				overflow: hidden;");
		sb.append(" 				font-size: 0px;");
		sb.append(" 			}");

		sb.append(" 			.desktop_hide,");
		sb.append(" 			.desktop_hide table {");
		sb.append(" 				display: table !important;");
		sb.append(" 				max-height: none !important;");
		sb.append(" 			}");
		sb.append(" 		}");
		sb.append(" 	</style>");
		sb.append(" </head>");

		sb.append(
				" <body style=\"background-color: #f8f8f9; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;\">");
		sb.append(
				" 	<table class=\"nl-container\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f8f8f9;\">");
		sb.append(" 		<tbody>");
		sb.append(" 			<tr>");
		sb.append(" 				<td>");
		sb.append(
				" 					<table class=\"row row-1\" align=\"center\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #1aa19c;\">");
		sb.append(" 						<tbody>");
		sb.append(" 							<tr>");
		sb.append(" 								<td>");
		sb.append(
				" 									<table class=\"row-content stack\" align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #1aa19c; color: #000000; width: 640px;\" width=\"640\">");
		sb.append(" 										<tbody>");
		sb.append(" 											<tr>");
		sb.append(
				" 												<td class=\"column column-1\" width=\"100%\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;\">");
		sb.append(
				" 													<table class=\"divider_block\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 														<tr>");
		sb.append(" 															<td>");
		sb.append(" 																<div align=\"center\">");
		sb.append(
				" 																	<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" width=\"100%\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 																		<tr>");
		sb.append(
				" 																			<td class=\"divider_inner\" style=\"font-size: 1px; line-height: 1px; border-top: 4px solid #1AA19C;\"><span>&#8202;</span></td>");
		sb.append(" 																		</tr>");
		sb.append(" 																	</table>");
		sb.append(" 																</div>");
		sb.append(" 															</td>");
		sb.append(" 														</tr>");
		sb.append(" 													</table>");
		sb.append(" 												</td>");
		sb.append(" 											</tr>");
		sb.append(" 										</tbody>");
		sb.append(" 									</table>");
		sb.append(" 								</td>");
		sb.append(" 							</tr>");
		sb.append(" 						</tbody>");
		sb.append(" 					</table>");
		sb.append(
				" 					<table class=\"row row-2\" align=\"center\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-size: auto;\">");
		sb.append(" 						<tbody>");
		sb.append(" 							<tr>");
		sb.append(" 								<td>");
		sb.append(
				" 									<table class=\"row-content stack\" align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-size: auto; background-color: #fff; color: #000000; width: 640px;\" width=\"640\">");
		sb.append(" 										<tbody>");
		sb.append(" 											<tr>");
		sb.append(
				" 												<td class=\"column column-1\" width=\"25%\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; background-color: #ffffff; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;\">");
		sb.append(
				" 													<table class=\"image_block\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 														<tr>");
		sb.append(
				" 															<td style=\"width:100%;padding-right:0px;padding-left:0px;\">");
		sb.append(
				" 																<div align=\"center\" style=\"line-height:10px\"><img src=\"https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/BeeProAgency/834507_818521/editor_images/9f931532-44a5-4efd-b780-f1288bb468c1.png\" style=\"display: block; height: auto; border: 0; width: 96px; max-width: 100%;\" width=\"96\"></div>");
		sb.append(" 															</td>");
		sb.append(" 														</tr>");
		sb.append(" 													</table>");
		sb.append(" 												</td>");
		sb.append(
				" 												<td class=\"column column-2\" width=\"75%\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;\">");
		sb.append(
				" 													<table class=\"empty_block\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 														<tr>");
		sb.append(
				" 															<td style=\"padding-right:0px;padding-bottom:5px;padding-left:0px;padding-top:5px;\">");
		sb.append(" 																<div></div>");
		sb.append(" 															</td>");
		sb.append(" 														</tr>");
		sb.append(" 													</table>");
		sb.append(" 												</td>");
		sb.append(" 											</tr>");
		sb.append(" 										</tbody>");
		sb.append(" 									</table>");
		sb.append(" 								</td>");
		sb.append(" 							</tr>");
		sb.append(" 						</tbody>");
		sb.append(" 					</table>");
		sb.append(
				" 					<table class=\"row row-3\" align=\"center\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 						<tbody>");
		sb.append(" 							<tr>");
		sb.append(" 								<td>");
		sb.append(
				" 									<table class=\"row-content stack\" align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff; color: #000000; width: 640px;\" width=\"640\">");
		sb.append(" 										<tbody>");
		sb.append(" 											<tr>");
		sb.append(
				" 												<td class=\"column column-1\" width=\"100%\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;\">");
		sb.append(
				" 													<table class=\"divider_block\" width=\"100%\" border=\"0\" cellpadding=\"10\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 														<tr>");
		sb.append(" 															<td>");
		sb.append(" 																<div align=\"center\">");
		sb.append(
				" 																	<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" width=\"100%\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 																		<tr>");
		sb.append(
				" 																			<td class=\"divider_inner\" style=\"font-size: 1px; line-height: 1px; border-top: 1px solid #BBBBBB;\"><span>&#8202;</span></td>");
		sb.append(" 																		</tr>");
		sb.append(" 																	</table>");
		sb.append(" 																</div>");
		sb.append(" 															</td>");
		sb.append(" 														</tr>");
		sb.append(" 													</table>");
		sb.append(
				" 													<table class=\"divider_block\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 														<tr>");
		sb.append(
				" 															<td style=\"padding-bottom:12px;padding-top:60px;\">");
		sb.append(" 																<div align=\"center\">");
		sb.append(
				" 																	<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" width=\"100%\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 																		<tr>");
		sb.append(
				" 																			<td class=\"divider_inner\" style=\"font-size: 1px; line-height: 1px; border-top: 0px solid #BBBBBB;\"><span>&#8202;</span></td>");
		sb.append(" 																		</tr>");
		sb.append(" 																	</table>");
		sb.append(" 																</div>");
		sb.append(" 															</td>");
		sb.append(" 														</tr>");
		sb.append(" 													</table>");
		sb.append(
				" 													<table class=\"image_block\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 														<tr>");
		sb.append(
				" 															<td style=\"padding-left:40px;padding-right:40px;width:100%;\">");
		sb.append(
				" 																<div align=\"center\" style=\"line-height:10px\"><img class=\"big\" src=\"https://d1oco4z2z1fhwp.cloudfront.net/templates/default/1341/Img22x.jpg\" style=\"display: block; height: auto; border: 0; width: 352px; max-width: 100%;\" width=\"352\" alt=\"I'm an image\" title=\"I'm an image\"></div>");
		sb.append(" 															</td>");
		sb.append(" 														</tr>");
		sb.append(" 													</table>");
		sb.append(
				" 													<table class=\"divider_block\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 														<tr>");
		sb.append(" 															<td style=\"padding-top:50px;\">");
		sb.append(" 																<div align=\"center\">");
		sb.append(
				" 																	<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" width=\"100%\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 																		<tr>");
		sb.append(
				" 																			<td class=\"divider_inner\" style=\"font-size: 1px; line-height: 1px; border-top: 0px solid #BBBBBB;\"><span>&#8202;</span></td>");
		sb.append(" 																		</tr>");
		sb.append(" 																	</table>");
		sb.append(" 																</div>");
		sb.append(" 															</td>");
		sb.append(" 														</tr>");
		sb.append(" 													</table>");
		sb.append(
				" 													<table class=\"text_block\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;\">");
		sb.append(" 														<tr>");
		sb.append(
				" 															<td style=\"padding-bottom:10px;padding-left:40px;padding-right:40px;padding-top:10px;\">");
		sb.append(
				" 																<div style=\"font-family: sans-serif\">");
		sb.append(
				" 																	<div class=\"txtTinyMce-wrapper\" style=\"font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;\">");
		sb.append(
				" 																		<p style=\"margin: 0; font-size: 16px; text-align: center;\"><span style=\"font-size:30px;color:#2b303a;\"><strong>Forgot Password</strong></span></p>");
		sb.append(" 																	</div>");
		sb.append(" 																</div>");
		sb.append(" 															</td>");
		sb.append(" 														</tr>");
		sb.append(" 													</table>");
		sb.append(
				" 													<table class=\"text_block\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;\">");
		sb.append(" 														<tr>");
		sb.append(
				" 															<td style=\"padding-bottom:10px;padding-left:40px;padding-right:40px;padding-top:10px;\">");
		sb.append(
				" 																<div style=\"font-family: sans-serif\">");
		sb.append(
				" 																	<div class=\"txtTinyMce-wrapper\" style=\"font-size: 12px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 18px; color: #555555; line-height: 1.5;\">");
		sb.append(
				" 																		<p style=\"margin: 0; font-size: 14px; text-align: center;\">We cannot simply send you your old password. A unique link to reset your password has been generated for you. To reset your password, click the following link and follow the instructions.</p>");
		sb.append(" 																	</div>");
		sb.append(" 																</div>");
		sb.append(" 															</td>");
		sb.append(" 														</tr>");
		sb.append(" 													</table>");
		sb.append(
				" 													<table class=\"button_block\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 														<tr>");
		sb.append(
				" 															<td style=\"padding-left:10px;padding-right:10px;padding-top:15px;text-align:center;\">");
		sb.append(" 																<div align=\"center\">");
		sb.append(
				" 																	<!--[if mso]><v:roundrect xmlns:v=\"urn:schemas-microsoft-com:vml\" xmlns:w=\"urn:schemas-microsoft-com:office:word\" style=\"height:62px;width:188px;v-text-anchor:middle;\" arcsize=\"97%\" stroke=\"false\" fillcolor=\"#00bfb9\"><w:anchorlock/><v:textbox inset=\"0px,0px,0px,0px\"><center style=\"color:#ffffff; font-family:Tahoma, sans-serif; font-size:16px\"><![endif]-->");
		sb.append(
				" 																	<a href=\"@@1\" target=\"_blank\">");
		sb.append(
				" 																	<div style=\"text-decoration:none;display:inline-block;color:#ffffff;background-color:#00bfb9;border-radius:60px;width:auto;border-top:1px solid #00bfb9;font-weight:400;border-right:1px solid #00bfb9;border-bottom:1px solid #00bfb9;border-left:1px solid #00bfb9;padding-top:15px;padding-bottom:15px;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;\"><span style=\"padding-left:30px;padding-right:30px;font-size:16px;display:inline-block;letter-spacing:normal;\"><span style=\"font-size: 16px; margin: 0; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;\"><strong>Reset Password</strong></span></span></div>");
		sb.append(" 																	</a>");
		sb.append(
				" 																	<!--[if mso]></center></v:textbox></v:roundrect><![endif]-->");
		sb.append(" 																</div>");
		sb.append(" 															</td>");
		sb.append(" 														</tr>");
		sb.append(" 													</table>");
		sb.append(
				" 													<table class=\"divider_block\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 														<tr>");
		sb.append(
				" 															<td style=\"padding-bottom:12px;padding-top:60px;\">");
		sb.append(" 																<div align=\"center\">");
		sb.append(
				" 																	<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" width=\"100%\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 																		<tr>");
		sb.append(
				" 																			<td class=\"divider_inner\" style=\"font-size: 1px; line-height: 1px; border-top: 0px solid #BBBBBB;\"><span>&#8202;</span></td>");
		sb.append(" 																		</tr>");
		sb.append(" 																	</table>");
		sb.append(" 																</div>");
		sb.append(" 															</td>");
		sb.append(" 														</tr>");
		sb.append(" 													</table>");
		sb.append(" 												</td>");
		sb.append(" 											</tr>");
		sb.append(" 										</tbody>");
		sb.append(" 									</table>");
		sb.append(" 								</td>");
		sb.append(" 							</tr>");
		sb.append(" 						</tbody>");
		sb.append(" 					</table>");
		sb.append(
				" 					<table class=\"row row-4\" align=\"center\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 						<tbody>");
		sb.append(" 							<tr>");
		sb.append(" 								<td>");
		sb.append(
				" 									<table class=\"row-content stack\" align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f8f8f9; color: #000000; width: 640px;\" width=\"640\">");
		sb.append(" 										<tbody>");
		sb.append(" 											<tr>");
		sb.append(
				" 												<td class=\"column column-1\" width=\"100%\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;\">");
		sb.append(
				" 													<table class=\"divider_block\" width=\"100%\" border=\"0\" cellpadding=\"20\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 														<tr>");
		sb.append(" 															<td>");
		sb.append(" 																<div align=\"center\">");
		sb.append(
				" 																	<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" width=\"100%\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 																		<tr>");
		sb.append(
				" 																			<td class=\"divider_inner\" style=\"font-size: 1px; line-height: 1px; border-top: 0px solid #BBBBBB;\"><span>&#8202;</span></td>");
		sb.append(" 																		</tr>");
		sb.append(" 																	</table>");
		sb.append(" 																</div>");
		sb.append(" 															</td>");
		sb.append(" 														</tr>");
		sb.append(" 													</table>");
		sb.append(" 												</td>");
		sb.append(" 											</tr>");
		sb.append(" 										</tbody>");
		sb.append(" 									</table>");
		sb.append(" 								</td>");
		sb.append(" 							</tr>");
		sb.append(" 						</tbody>");
		sb.append(" 					</table>");
		sb.append(
				" 					<table class=\"row row-5\" align=\"center\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 						<tbody>");
		sb.append(" 							<tr>");
		sb.append(" 								<td>");
		sb.append(
				" 									<table class=\"row-content stack\" align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #2b303a; color: #000000; width: 640px;\" width=\"640\">");
		sb.append(" 										<tbody>");
		sb.append(" 											<tr>");
		sb.append(
				" 												<td class=\"column column-1\" width=\"100%\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;\">");
		sb.append(
				" 													<table class=\"divider_block\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 														<tr>");
		sb.append(" 															<td>");
		sb.append(" 																<div align=\"center\">");
		sb.append(
				" 																	<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" width=\"100%\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 																		<tr>");
		sb.append(
				" 																			<td class=\"divider_inner\" style=\"font-size: 1px; line-height: 1px; border-top: 4px solid #1AA19C;\"><span>&#8202;</span></td>");
		sb.append(" 																		</tr>");
		sb.append(" 																	</table>");
		sb.append(" 																</div>");
		sb.append(" 															</td>");
		sb.append(" 														</tr>");
		sb.append(" 													</table>");
		sb.append(
				" 													<table class=\"image_block\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 														<tr>");
		sb.append(
				" 															<td style=\"width:100%;padding-right:0px;padding-left:0px;\">");
		sb.append(
				" 																<div align=\"center\" style=\"line-height:10px\"><img class=\"big\" src=\"https://d1oco4z2z1fhwp.cloudfront.net/templates/default/1341/footer.png\" style=\"display: block; height: auto; border: 0; width: 640px; max-width: 100%;\" width=\"640\" alt=\"I'm an image\" title=\"I'm an image\"></div>");
		sb.append(" 															</td>");
		sb.append(" 														</tr>");
		sb.append(" 													</table>");
		sb.append(
				" 													<table class=\"image_block\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 														<tr>");
		sb.append(
				" 															<td style=\"padding-top:40px;width:100%;padding-right:0px;padding-left:0px;\">");
		sb.append(
				" 																<div align=\"center\" style=\"line-height:10px\"><img src=\"https://d1oco4z2z1fhwp.cloudfront.net/templates/default/1341/Logo-white.png\" style=\"display: block; height: auto; border: 0; width: 149px; max-width: 100%;\" width=\"149\" alt=\"Alternate text\" title=\"Alternate text\"></div>");
		sb.append(" 															</td>");
		sb.append(" 														</tr>");
		sb.append(" 													</table>");
		sb.append(
				" 													<table class=\"social_block\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 														<tr>");
		sb.append(
				" 															<td style=\"padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:28px;text-align:center;\">");
		sb.append(
				" 																<table class=\"social-table\" width=\"208px\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" align=\"center\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 																	<tr>");
		sb.append(
				" 																		<td style=\"padding:0 10px 0 10px;\"><a href=\"https://www.facebook.com/\" target=\"_blank\"><img src=\"https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-outline-circle-white/facebook@2x.png\" width=\"32\" height=\"32\" alt=\"Facebook\" title=\"Facebook\" style=\"display: block; height: auto; border: 0;\"></a></td>");
		sb.append(
				" 																		<td style=\"padding:0 10px 0 10px;\"><a href=\"https://twitter.com/\" target=\"_blank\"><img src=\"https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-outline-circle-white/twitter@2x.png\" width=\"32\" height=\"32\" alt=\"Twitter\" title=\"Twitter\" style=\"display: block; height: auto; border: 0;\"></a></td>");
		sb.append(
				" 																		<td style=\"padding:0 10px 0 10px;\"><a href=\"https://instagram.com/\" target=\"_blank\"><img src=\"https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-outline-circle-white/instagram@2x.png\" width=\"32\" height=\"32\" alt=\"Instagram\" title=\"Instagram\" style=\"display: block; height: auto; border: 0;\"></a></td>");
		sb.append(
				" 																		<td style=\"padding:0 10px 0 10px;\"><a href=\"https://www.linkedin.com/\" target=\"_blank\"><img src=\"https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-outline-circle-white/linkedin@2x.png\" width=\"32\" height=\"32\" alt=\"LinkedIn\" title=\"LinkedIn\" style=\"display: block; height: auto; border: 0;\"></a></td>");
		sb.append(" 																	</tr>");
		sb.append(" 																</table>");
		sb.append(" 															</td>");
		sb.append(" 														</tr>");
		sb.append(" 													</table>");
		sb.append(
				" 													<table class=\"divider_block\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 														<tr>");
		sb.append(
				" 															<td style=\"padding-bottom:10px;padding-left:40px;padding-right:40px;padding-top:25px;\">");
		sb.append(" 																<div align=\"center\">");
		sb.append(
				" 																	<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" width=\"100%\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 																		<tr>");
		sb.append(
				" 																			<td class=\"divider_inner\" style=\"font-size: 1px; line-height: 1px; border-top: 1px solid #555961;\"><span>&#8202;</span></td>");
		sb.append(" 																		</tr>");
		sb.append(" 																	</table>");
		sb.append(" 																</div>");
		sb.append(" 															</td>");
		sb.append(" 														</tr>");
		sb.append(" 													</table>");
		sb.append(
				" 													<table class=\"text_block\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;\">");
		sb.append(" 														<tr>");
		sb.append(
				" 															<td style=\"padding-bottom:30px;padding-left:40px;padding-right:40px;padding-top:20px;\">");
		sb.append(
				" 																<div style=\"font-family: sans-serif\">");
		sb.append(
				" 																	<div class=\"txtTinyMce-wrapper\" style=\"font-size: 12px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;\">");
		sb.append(
				" 																		<p style=\"margin: 0; font-size: 14px; text-align: left;\"><span style=\"color:#95979c;font-size:12px;\">Companify Copyright © 2022</span></p>");
		sb.append(" 																	</div>");
		sb.append(" 																</div>");
		sb.append(" 															</td>");
		sb.append(" 														</tr>");
		sb.append(" 													</table>");
		sb.append(" 												</td>");
		sb.append(" 											</tr>");
		sb.append(" 										</tbody>");
		sb.append(" 									</table>");
		sb.append(" 								</td>");
		sb.append(" 							</tr>");
		sb.append(" 						</tbody>");
		sb.append(" 					</table>");
		sb.append(
				" 					<table class=\"row row-6\" align=\"center\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 						<tbody>");
		sb.append(" 							<tr>");
		sb.append(" 								<td>");
		sb.append(
				" 									<table class=\"row-content stack\" align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 640px;\" width=\"640\">");
		sb.append(" 										<tbody>");
		sb.append(" 											<tr>");
		sb.append(
				" 												<td class=\"column column-1\" width=\"100%\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;\">");
		sb.append(
				" 													<table class=\"icons_block\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 														<tr>");
		sb.append(
				" 															<td style=\"vertical-align: middle; padding-bottom: 5px; padding-top: 5px; color: #9d9d9d; font-family: inherit; font-size: 15px; text-align: center;\">");
		sb.append(
				" 																<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 																	<tr>");
		sb.append(
				" 																		<td style=\"vertical-align: middle; text-align: center;\">");
		sb.append(
				" 																			<!--[if vml]><table align=\"left\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;\"><![endif]-->");
		sb.append(" 																			<!--[if !vml]><!-->");
		sb.append(
				" 																			<table class=\"icons-inner\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\">");
		sb.append(" 																				<!--<![endif]-->");
		sb.append(" 																				<tr>");
		sb.append(
				" 																					<td style=\"vertical-align: middle; text-align: center; padding-top: 5px; padding-bottom: 5px; padding-left: 5px; padding-right: 6px;\"><a href=\"https://www.designedwithbee.com/?utm_source=editor&utm_medium=bee_pro&utm_campaign=free_footer_link\" target=\"_blank\" style=\"text-decoration: none;\"><img class=\"icon\" alt=\"Designed with BEE\" src=\"https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/BeeProAgency/53601_510656/Signature/bee.png\" height=\"32\" width=\"34\" align=\"center\" style=\"display: block; height: auto; margin: 0 auto; border: 0;\"></a></td>");
		sb.append(
				" 																					<td style=\"font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; font-size: 15px; color: #9d9d9d; vertical-align: middle; letter-spacing: undefined; text-align: center;\"><a href=\"https://www.designedwithbee.com/?utm_source=editor&utm_medium=bee_pro&utm_campaign=free_footer_link\" target=\"_blank\" style=\"color: #9d9d9d; text-decoration: none;\">Designed with BEE</a></td>");
		sb.append(" 																				</tr>");
		sb.append(" 																			</table>");
		sb.append(" 																		</td>");
		sb.append(" 																	</tr>");
		sb.append(" 																</table>");
		sb.append(" 															</td>");
		sb.append(" 														</tr>");
		sb.append(" 													</table>");
		sb.append(" 												</td>");
		sb.append(" 											</tr>");
		sb.append(" 										</tbody>");
		sb.append(" 									</table>");
		sb.append(" 								</td>");
		sb.append(" 							</tr>");
		sb.append(" 						</tbody>");
		sb.append(" 					</table>");
		sb.append(" 				</td>");
		sb.append(" 			</tr>");
		sb.append(" 		</tbody>");
		sb.append(" 	</table><!-- End -->");
		sb.append(" </body>");

		sb.append(" </html>");

		return sb.toString();
	}

	private String getMonthlyTemplate() {
		StringBuilder sb = new StringBuilder();
		sb.append(" <!DOCTYPE html>");
		sb.append(
				" <html xmlns:v=\"urn:schemas-microsoft-com:vml\" xmlns:o=\"urn:schemas-microsoft-com:office:office\" lang=\"en\">");
		sb.append(" ");
		sb.append(" <head>");
		sb.append(" 	<title></title>");
		sb.append(" 	<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">");
		sb.append(" 	<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">");
		sb.append(
				" 	<!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->");
		sb.append(" 	<style>");
		sb.append(" 		* {");
		sb.append(" 			box-sizing: border-box;");
		sb.append(" 		}");
		sb.append(" ");
		sb.append(" 		body {");
		sb.append(" 			margin: 0;");
		sb.append(" 			padding: 0;");
		sb.append(" 		}");
		sb.append(" ");
		sb.append(" 		a[x-apple-data-detectors] {");
		sb.append(" 			color: inherit !important;");
		sb.append(" 			text-decoration: inherit !important;");
		sb.append(" 		}");
		sb.append(" ");
		sb.append(" 		#MessageViewBody a {");
		sb.append(" 			color: inherit;");
		sb.append(" 			text-decoration: none;");
		sb.append(" 		}");
		sb.append(" ");
		sb.append(" 		p {");
		sb.append(" 			line-height: inherit");
		sb.append(" 		}");
		sb.append(" ");
		sb.append(" 		.desktop_hide,");
		sb.append(" 		.desktop_hide table {");
		sb.append(" 			mso-hide: all;");
		sb.append(" 			display: none;");
		sb.append(" 			max-height: 0px;");
		sb.append(" 			overflow: hidden;");
		sb.append(" 		}");
		sb.append(" ");
		sb.append(" 		@media (max-width:660px) {");
		sb.append(" 			.desktop_hide table.icons-inner {");
		sb.append(" 				display: inline-block !important;");
		sb.append(" 			}");
		sb.append(" ");
		sb.append(" 			.icons-inner {");
		sb.append(" 				text-align: center;");
		sb.append(" 			}");
		sb.append(" ");
		sb.append(" 			.icons-inner td {");
		sb.append(" 				margin: 0 auto;");
		sb.append(" 			}");
		sb.append(" ");
		sb.append(" 			.image_block img.big,");
		sb.append(" 			.row-content {");
		sb.append(" 				width: 100% !important;");
		sb.append(" 			}");
		sb.append(" ");
		sb.append(" 			.mobile_hide {");
		sb.append(" 				display: none;");
		sb.append(" 			}");
		sb.append(" ");
		sb.append(" 			.stack .column {");
		sb.append(" 				width: 100%;");
		sb.append(" 				display: block;");
		sb.append(" 			}");
		sb.append(" ");
		sb.append(" 			.mobile_hide {");
		sb.append(" 				min-height: 0;");
		sb.append(" 				max-height: 0;");
		sb.append(" 				max-width: 0;");
		sb.append(" 				overflow: hidden;");
		sb.append(" 				font-size: 0px;");
		sb.append(" 			}");
		sb.append(" ");
		sb.append(" 			.desktop_hide,");
		sb.append(" 			.desktop_hide table {");
		sb.append(" 				display: table !important;");
		sb.append(" 				max-height: none !important;");
		sb.append(" 			}");
		sb.append(" 		}");
		sb.append(" 	</style>");
		sb.append(" </head>");
		sb.append(" ");
		sb.append(
				" <body style=\"background-color: #f8f8f9; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;\">");
		sb.append(
				" 	<table class=\"nl-container\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f8f8f9;\">");
		sb.append(" 		<tbody>");
		sb.append(" 			<tr>");
		sb.append(" 				<td>");
		sb.append(
				" 					<table class=\"row row-1\" align=\"center\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #1aa19c;\">");
		sb.append(" 						<tbody>");
		sb.append(" 							<tr>");
		sb.append(" 								<td>");
		sb.append(
				" 									<table class=\"row-content stack\" align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; background-color: #1aa19c; width: 640px;\" width=\"640\">");
		sb.append(" 										<tbody>");
		sb.append(" 											<tr>");
		sb.append(
				" 												<td class=\"column column-1\" width=\"100%\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;\">");
		sb.append(
				" 													<table class=\"divider_block block-1\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 														<tr>");
		sb.append(" 															<td class=\"pad\">");
		sb.append(
				" 																<div class=\"alignment\" align=\"center\">");
		sb.append(
				" 																	<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" width=\"100%\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 																		<tr>");
		sb.append(
				" 																			<td class=\"divider_inner\" style=\"font-size: 1px; line-height: 1px; border-top: 4px solid #1AA19C;\"><span>&#8202;</span></td>");
		sb.append(" 																		</tr>");
		sb.append(" 																	</table>");
		sb.append(" 																</div>");
		sb.append(" 															</td>");
		sb.append(" 														</tr>");
		sb.append(" 													</table>");
		sb.append(" 												</td>");
		sb.append(" 											</tr>");
		sb.append(" 										</tbody>");
		sb.append(" 									</table>");
		sb.append(" 								</td>");
		sb.append(" 							</tr>");
		sb.append(" 						</tbody>");
		sb.append(" 					</table>");
		sb.append(
				" 					<table class=\"row row-2\" align=\"center\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 						<tbody>");
		sb.append(" 							<tr>");
		sb.append(" 								<td>");
		sb.append(
				" 									<table class=\"row-content stack\" align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff; color: #000000; width: 640px;\" width=\"640\">");
		sb.append(" 										<tbody>");
		sb.append(" 											<tr>");
		sb.append(
				" 												<td class=\"column column-1\" width=\"25%\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;\">");
		sb.append(
				" 													<table class=\"image_block block-2\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 														<tr>");
		sb.append(
				" 															<td class=\"pad\" style=\"padding-bottom:25px;padding-top:22px;width:100%;padding-right:0px;padding-left:0px;\">");
		sb.append(
				" 																<div class=\"alignment\" align=\"center\" style=\"line-height:10px\"><img src=\"https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/BeeProAgency/834507_818521/editor_images/9f931532-44a5-4efd-b780-f1288bb468c1.png\" style=\"display: block; height: auto; border: 0; width: 80px; max-width: 100%;\" width=\"80\" alt=\"I'm an image\" title=\"I'm an image\"></div>");
		sb.append(" 															</td>");
		sb.append(" 														</tr>");
		sb.append(" 													</table>");
		sb.append(" 												</td>");
		sb.append(
				" 												<td class=\"column column-2\" width=\"75%\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;\">");
		sb.append(
				" 													<table class=\"empty_block block-2\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 														<tr>");
		sb.append(
				" 															<td class=\"pad\" style=\"padding-right:0px;padding-bottom:5px;padding-left:0px;padding-top:5px;\">");
		sb.append(" 																<div></div>");
		sb.append(" 															</td>");
		sb.append(" 														</tr>");
		sb.append(" 													</table>");
		sb.append(" 												</td>");
		sb.append(" 											</tr>");
		sb.append(" 										</tbody>");
		sb.append(" 									</table>");
		sb.append(" 								</td>");
		sb.append(" 							</tr>");
		sb.append(" 						</tbody>");
		sb.append(" 					</table>");
		sb.append(
				" 					<table class=\"row row-3\" align=\"center\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 						<tbody>");
		sb.append(" 							<tr>");
		sb.append(" 								<td>");
		sb.append(
				" 									<table class=\"row-content stack\" align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff; color: #000000; width: 640px;\" width=\"640\">");
		sb.append(" 										<tbody>");
		sb.append(" 											<tr>");
		sb.append(
				" 												<td class=\"column column-1\" width=\"100%\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;\">");
		sb.append(
				" 													<table class=\"divider_block block-1\" width=\"100%\" border=\"0\" cellpadding=\"10\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 														<tr>");
		sb.append(" 															<td class=\"pad\">");
		sb.append(
				" 																<div class=\"alignment\" align=\"center\">");
		sb.append(
				" 																	<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" width=\"100%\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 																		<tr>");
		sb.append(
				" 																			<td class=\"divider_inner\" style=\"font-size: 1px; line-height: 1px; border-top: 3px solid #00BFB9;\"><span>&#8202;</span></td>");
		sb.append(" 																		</tr>");
		sb.append(" 																	</table>");
		sb.append(" 																</div>");
		sb.append(" 															</td>");
		sb.append(" 														</tr>");
		sb.append(" 													</table>");
		sb.append(
				" 													<table class=\"divider_block block-2\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 														<tr>");
		sb.append(
				" 															<td class=\"pad\" style=\"padding-bottom:12px;padding-top:60px;\">");
		sb.append(
				" 																<div class=\"alignment\" align=\"center\">");
		sb.append(
				" 																	<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" width=\"100%\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 																		<tr>");
		sb.append(
				" 																			<td class=\"divider_inner\" style=\"font-size: 1px; line-height: 1px; border-top: 0px solid #BBBBBB;\"><span>&#8202;</span></td>");
		sb.append(" 																		</tr>");
		sb.append(" 																	</table>");
		sb.append(" 																</div>");
		sb.append(" 															</td>");
		sb.append(" 														</tr>");
		sb.append(" 													</table>");
		sb.append(
				" 													<table class=\"image_block block-3\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 														<tr>");
		sb.append(
				" 															<td class=\"pad\" style=\"padding-left:40px;padding-right:40px;width:100%;\">");
		sb.append(
				" 																<div class=\"alignment\" align=\"center\" style=\"line-height:10px\"><img class=\"big\" src=\"https://d1oco4z2z1fhwp.cloudfront.net/templates/default/1366/Img5_2x.jpg\" style=\"display: block; height: auto; border: 0; width: 352px; max-width: 100%;\" width=\"352\" alt=\"I'm an image\" title=\"I'm an image\"></div>");
		sb.append(" 															</td>");
		sb.append(" 														</tr>");
		sb.append(" 													</table>");
		sb.append(
				" 													<table class=\"divider_block block-4\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 														<tr>");
		sb.append(
				" 															<td class=\"pad\" style=\"padding-top:50px;\">");
		sb.append(
				" 																<div class=\"alignment\" align=\"center\">");
		sb.append(
				" 																	<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" width=\"100%\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 																		<tr>");
		sb.append(
				" 																			<td class=\"divider_inner\" style=\"font-size: 1px; line-height: 1px; border-top: 0px solid #BBBBBB;\"><span>&#8202;</span></td>");
		sb.append(" 																		</tr>");
		sb.append(" 																	</table>");
		sb.append(" 																</div>");
		sb.append(" 															</td>");
		sb.append(" 														</tr>");
		sb.append(" 													</table>");
		sb.append(
				" 													<table class=\"text_block block-5\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;\">");
		sb.append(" 														<tr>");
		sb.append(
				" 															<td class=\"pad\" style=\"padding-bottom:10px;padding-left:40px;padding-right:40px;padding-top:10px;\">");
		sb.append(
				" 																<div style=\"font-family: sans-serif\">");
		sb.append(
				" 																	<div class=\"txtTinyMce-wrapper\" style=\"font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;\">");
		sb.append(
				" 																		<p style=\"margin: 0; font-size: 16px; text-align: center;\"><span style=\"font-size:30px;color:#2b303a;\"><strong>You have an invoice to pay</strong></span></p>");
		sb.append(" 																	</div>");
		sb.append(" 																</div>");
		sb.append(" 															</td>");
		sb.append(" 														</tr>");
		sb.append(" 													</table>");
		sb.append(
				" 													<table class=\"text_block block-6\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;\">");
		sb.append(" 														<tr>");
		sb.append(
				" 															<td class=\"pad\" style=\"padding-bottom:10px;padding-left:40px;padding-right:40px;padding-top:10px;\">");
		sb.append(
				" 																<div style=\"font-family: sans-serif\">");
		sb.append(
				" 																	<div class=\"txtTinyMce-wrapper\" style=\"font-size: 12px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 18px; color: #555555; line-height: 1.5;\">");
		sb.append(
				" 																		<p style=\"margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 22.5px;\"><span style=\"color:#808389;font-size:15px;\">You need to pay the rent for room @@1 at @@2</span></p>");
		sb.append(" 																	</div>");
		sb.append(" 																</div>");
		sb.append(" 															</td>");
		sb.append(" 														</tr>");
		sb.append(" 													</table>");
		sb.append(
				" 													<table class=\"divider_block block-7\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 														<tr>");
		sb.append(
				" 															<td class=\"pad\" style=\"padding-top:50px;\">");
		sb.append(
				" 																<div class=\"alignment\" align=\"center\">");
		sb.append(
				" 																	<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" width=\"100%\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 																		<tr>");
		sb.append(
				" 																			<td class=\"divider_inner\" style=\"font-size: 1px; line-height: 1px; border-top: 0px solid #BBBBBB;\"><span>&#8202;</span></td>");
		sb.append(" 																		</tr>");
		sb.append(" 																	</table>");
		sb.append(" 																</div>");
		sb.append(" 															</td>");
		sb.append(" 														</tr>");
		sb.append(" 													</table>");
		sb.append(" 												</td>");
		sb.append(" 											</tr>");
		sb.append(" 										</tbody>");
		sb.append(" 									</table>");
		sb.append(" 								</td>");
		sb.append(" 							</tr>");
		sb.append(" 						</tbody>");
		sb.append(" 					</table>");
		sb.append(
				" 					<table class=\"row row-4\" align=\"center\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 						<tbody>");
		sb.append(" 							<tr>");
		sb.append(" 								<td>");
		sb.append(
				" 									<table class=\"row-content\" align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff; color: #000000; width: 640px;\" width=\"640\">");
		sb.append(" 										<tbody>");
		sb.append(" 											<tr>");
		sb.append(
				" 												<td class=\"column column-1\" width=\"100%\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; background-color: #f3fafa; border-left: 20px solid #FFF; border-right: 8px solid #FFF; vertical-align: top; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-bottom: 0px;\">");
		sb.append(
				" 													<table class=\"divider_block block-1\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 														<tr>");
		sb.append(" 															<td class=\"pad\">");
		sb.append(
				" 																<div class=\"alignment\" align=\"center\">");
		sb.append(
				" 																	<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" width=\"100%\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 																		<tr>");
		sb.append(
				" 																			<td class=\"divider_inner\" style=\"font-size: 1px; line-height: 1px; border-top: 4px solid #1AA19C;\"><span>&#8202;</span></td>");
		sb.append(" 																		</tr>");
		sb.append(" 																	</table>");
		sb.append(" 																</div>");
		sb.append(" 															</td>");
		sb.append(" 														</tr>");
		sb.append(" 													</table>");
		sb.append(
				" 													<table class=\"text_block block-2\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;\">");
		sb.append(" 														<tr>");
		sb.append(
				" 															<td class=\"pad\" style=\"padding-bottom:40px;padding-left:5px;padding-right:5px;padding-top:35px;\">");
		sb.append(
				" 																<div style=\"font-family: sans-serif\">");
		sb.append(
				" 																	<div class=\"txtTinyMce-wrapper\" style=\"font-size: 12px; mso-line-height-alt: 18px; color: #000000; line-height: 1.5; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;\">");
		sb.append(
				" 																		<p style=\"margin: 0; font-size: 16px; text-align: center; mso-line-height-alt: 18px;\"><span style=\"color:#a2a9ad;font-size:12px;\"><strong>PAYMENT DUE DATE</strong></span></p>");
		sb.append(
				" 																		<p style=\"margin: 0; font-size: 16px; text-align: center;\"><span style=\"color:#ff4848;background-color:#ff4848;\"><span style=\"color:#2b303a;\"><span style=\"font-size:20px;background-color:#ff4848;\"><strong>@@3</strong></span></span></span></p>");
		sb.append(" 																	</div>");
		sb.append(" 																</div>");
		sb.append(" 															</td>");
		sb.append(" 														</tr>");
		sb.append(" 													</table>");
		sb.append(" 												</td>");
		sb.append(" 											</tr>");
		sb.append(" 										</tbody>");
		sb.append(" 									</table>");
		sb.append(" 								</td>");
		sb.append(" 							</tr>");
		sb.append(" 						</tbody>");
		sb.append(" 					</table>");
		sb.append(
				" 					<table class=\"row row-5\" align=\"center\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 						<tbody>");
		sb.append(" 							<tr>");
		sb.append(" 								<td>");
		sb.append(
				" 									<table class=\"row-content\" align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff; color: #000000; width: 640px;\" width=\"640\">");
		sb.append(" 										<tbody>");
		sb.append(" 											<tr>");
		sb.append(
				" 												<td class=\"column column-1\" width=\"50%\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; background-color: #f3fafa; border-left: 20px solid #FFF; border-right: 8px solid #FFF; vertical-align: top; border-top: 0px; border-bottom: 0px;\">");
		sb.append(
				" 													<table class=\"divider_block block-2\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 														<tr>");
		sb.append(" 															<td class=\"pad\">");
		sb.append(
				" 																<div class=\"alignment\" align=\"center\">");
		sb.append(
				" 																	<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" width=\"100%\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 																		<tr>");
		sb.append(
				" 																			<td class=\"divider_inner\" style=\"font-size: 1px; line-height: 1px; border-top: 4px solid #1AA19C;\"><span>&#8202;</span></td>");
		sb.append(" 																		</tr>");
		sb.append(" 																	</table>");
		sb.append(" 																</div>");
		sb.append(" 															</td>");
		sb.append(" 														</tr>");
		sb.append(" 													</table>");
		sb.append(
				" 													<table class=\"text_block block-3\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;\">");
		sb.append(" 														<tr>");
		sb.append(
				" 															<td class=\"pad\" style=\"padding-bottom:40px;padding-left:5px;padding-right:5px;padding-top:35px;\">");
		sb.append(
				" 																<div style=\"font-family: sans-serif\">");
		sb.append(
				" 																	<div class=\"txtTinyMce-wrapper\" style=\"font-size: 12px; mso-line-height-alt: 18px; color: #555555; line-height: 1.5; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;\">");
		sb.append(
				" 																		<p style=\"margin: 0; font-size: 16px; text-align: center; mso-line-height-alt: 18px;\"><span style=\"color:#a2a9ad;font-size:12px;\"><strong>INVOICE NUMBER</strong></span></p>");
		sb.append(
				" 																		<p style=\"margin: 0; font-size: 16px; text-align: center; mso-line-height-alt: 30px;\"><span style=\"color:#2b303a;font-size:20px;\"><strong>#@@4</strong></span></p>");
		sb.append(" 																	</div>");
		sb.append(" 																</div>");
		sb.append(" 															</td>");
		sb.append(" 														</tr>");
		sb.append(" 													</table>");
		sb.append(" 												</td>");
		sb.append(
				" 												<td class=\"column column-2\" width=\"50%\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; background-color: #f3fafa; border-left: 8px solid #FFF; border-right: 20px solid #FFF; vertical-align: top; border-top: 0px; border-bottom: 0px;\">");
		sb.append(
				" 													<table class=\"divider_block block-2\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 														<tr>");
		sb.append(" 															<td class=\"pad\">");
		sb.append(
				" 																<div class=\"alignment\" align=\"center\">");
		sb.append(
				" 																	<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" width=\"100%\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 																		<tr>");
		sb.append(
				" 																			<td class=\"divider_inner\" style=\"font-size: 1px; line-height: 1px; border-top: 4px solid #1AA19C;\"><span>&#8202;</span></td>");
		sb.append(" 																		</tr>");
		sb.append(" 																	</table>");
		sb.append(" 																</div>");
		sb.append(" 															</td>");
		sb.append(" 														</tr>");
		sb.append(" 													</table>");
		sb.append(
				" 													<table class=\"text_block block-3\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;\">");
		sb.append(" 														<tr>");
		sb.append(
				" 															<td class=\"pad\" style=\"padding-bottom:40px;padding-left:5px;padding-right:5px;padding-top:35px;\">");
		sb.append(
				" 																<div style=\"font-family: sans-serif\">");
		sb.append(
				" 																	<div class=\"txtTinyMce-wrapper\" style=\"font-size: 12px; mso-line-height-alt: 18px; color: #555555; line-height: 1.5; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;\">");
		sb.append(
				" 																		<p style=\"margin: 0; font-size: 16px; text-align: center; mso-line-height-alt: 18px;\"><span style=\"color:#a2a9ad;font-size:12px;\"><strong>TOTAL</strong></span></p>");
		sb.append(
				" 																		<p style=\"margin: 0; font-size: 16px; text-align: center; mso-line-height-alt: 30px;\"><span style=\"color:#2b303a;font-size:20px;\"><strong>@@5 VND</strong></span></p>");
		sb.append(" 																	</div>");
		sb.append(" 																</div>");
		sb.append(" 															</td>");
		sb.append(" 														</tr>");
		sb.append(" 													</table>");
		sb.append(" 												</td>");
		sb.append(" 											</tr>");
		sb.append(" 										</tbody>");
		sb.append(" 									</table>");
		sb.append(" 								</td>");
		sb.append(" 							</tr>");
		sb.append(" 						</tbody>");
		sb.append(" 					</table>");
		sb.append(
				" 					<table class=\"row row-6\" align=\"center\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 						<tbody>");
		sb.append(" 							<tr>");
		sb.append(" 								<td>");
		sb.append(
				" 									<table class=\"row-content stack\" align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff; color: #000000; width: 640px;\" width=\"640\">");
		sb.append(" 										<tbody>");
		sb.append(" 											<tr>");
		sb.append(
				" 												<td class=\"column column-1\" width=\"100%\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; background-color: #f3fafa; border-left: 20px solid #FFFFFF; border-right: 20px solid #FFFFFF; border-top: 08px solid #00BFB9; vertical-align: top; padding-top: 0px; padding-bottom: 0px; border-bottom: 0px;\">");
		sb.append(
				" 													<table class=\"text_block block-1\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;\">");
		sb.append(" 														<tr>");
		sb.append(
				" 															<td class=\"pad\" style=\"padding-bottom:35px;padding-top:35px;\">");
		sb.append(
				" 																<div style=\"font-family: sans-serif\">");
		sb.append(
				" 																	<div class=\"txtTinyMce-wrapper\" style=\"font-size: 12px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 18px; color: #555555; line-height: 1.5;\">");
		sb.append(
				" 																		<p style=\"margin: 0; font-size: 12px; text-align: center; mso-line-height-alt: 24px;\"><span style=\"font-size:16px;\"><strong>DETAIL PAYMENT</strong></span></p>");
		sb.append(" 																	</div>");
		sb.append(" 																</div>");
		sb.append(" 															</td>");
		sb.append(" 														</tr>");
		sb.append(" 													</table>");
		sb.append(
				" 													<table class=\"divider_block block-2\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 														<tr>");
		sb.append(" 															<td class=\"pad\">");
		sb.append(
				" 																<div class=\"alignment\" align=\"center\">");
		sb.append(
				" 																	<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" width=\"100%\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 																		<tr>");
		sb.append(
				" 																			<td class=\"divider_inner\" style=\"font-size: 1px; line-height: 1px; border-top: 1px solid #F0F0F0;\"><span>&#8202;</span></td>");
		sb.append(" 																		</tr>");
		sb.append(" 																	</table>");
		sb.append(" 																</div>");
		sb.append(" 															</td>");
		sb.append(" 														</tr>");
		sb.append(" 													</table>");
		sb.append(" 												</td>");
		sb.append(" 											</tr>");
		sb.append(" 										</tbody>");
		sb.append(" 									</table>");
		sb.append(" 								</td>");
		sb.append(" 							</tr>");
		sb.append(" 						</tbody>");
		sb.append(" 					</table>");
		sb.append(
				" 					<table class=\"row row-7\" align=\"center\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 						<tbody>");
		sb.append(" 							<tr>");
		sb.append(" 								<td>");
		sb.append(
				" 									<table class=\"row-content\" align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff; color: #000000; width: 640px;\" width=\"640\">");
		sb.append(" 										<tbody>");
		sb.append(" 											<tr>");
		sb.append(
				" 												<td class=\"column column-1\" width=\"50%\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-left: 30px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;\">");
		sb.append(
				" 													<table class=\"text_block block-2\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;\">");
		sb.append(" 														<tr>");
		sb.append(" 															<td class=\"pad\">");
		sb.append(
				" 																<div style=\"font-family: sans-serif\">");
		sb.append(
				" 																	<div class=\"txtTinyMce-wrapper\" style=\"font-size: 12px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 21.6px; color: #555555; line-height: 1.8;\">");
		sb.append(
				" 																		<p style=\"margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 23.400000000000002px;\"><span style=\"color:#2b303a;font-size:13px;\">Rental Price</span></p>");
		sb.append(
				" 																		<p style=\"margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 23.400000000000002px;\"><span style=\"color:#2b303a;font-size:13px;\">Electronic Cost</span></p>");
		sb.append(
				" 																		<p style=\"margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 23.400000000000002px;\"><span style=\"color:#2b303a;font-size:13px;\">Water Cost</span></p>");
		sb.append(
				" 																		<p style=\"margin: 0; font-size: 14px; text-align: left;\">Internet Cost</p>");
		sb.append(
				" 																		<p style=\"margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 21.6px;\">&nbsp;</p>");
		sb.append(" 																	</div>");
		sb.append(" 																</div>");
		sb.append(" 															</td>");
		sb.append(" 														</tr>");
		sb.append(" 													</table>");
		sb.append(
				" 													<table class=\"text_block block-3\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;\">");
		sb.append(" 														<tr>");
		sb.append(
				" 															<td class=\"pad\" style=\"padding-top:15px;\">");
		sb.append(
				" 																<div style=\"font-family: sans-serif\">");
		sb.append(
				" 																	<div class=\"txtTinyMce-wrapper\" style=\"font-size: 12px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 21.6px; color: #555555; line-height: 1.8;\">");
		sb.append(
				" 																		<p style=\"margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 36px;\"><span style=\"font-size:20px;\"><strong><span style=\"color:#2b303a;\">Total</span></strong></span></p>");
		sb.append(" 																	</div>");
		sb.append(" 																</div>");
		sb.append(" 															</td>");
		sb.append(" 														</tr>");
		sb.append(" 													</table>");
		sb.append(" 												</td>");
		sb.append(
				" 												<td class=\"column column-2\" width=\"50%\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-left: 30px; padding-right: 30px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;\">");
		sb.append(
				" 													<table class=\"text_block block-2\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;\">");
		sb.append(" 														<tr>");
		sb.append(" 															<td class=\"pad\">");
		sb.append(
				" 																<div style=\"font-family: sans-serif\">");
		sb.append(
				" 																	<div class=\"txtTinyMce-wrapper\" style=\"font-size: 12px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 21.6px; color: #555555; line-height: 1.8;\">");
		sb.append(
				" 																		<p style=\"margin: 0; font-size: 14px; text-align: right; mso-line-height-alt: 23.400000000000002px;\"><span style=\"color:#2b303a;font-size:13px;\">@@6 VND</span></p>");
		sb.append(
				" 																		<p style=\"margin: 0; font-size: 14px; text-align: right; mso-line-height-alt: 23.400000000000002px;\"><span style=\"color:#2b303a;font-size:13px;\">@@7 VND</span></p>");
		sb.append(
				" 																		<p style=\"margin: 0; font-size: 14px; text-align: right; mso-line-height-alt: 23.400000000000002px;\"><span style=\"color:#2b303a;font-size:13px;\">@@8 VND</span></p>");
		sb.append(
				" 																		<p style=\"margin: 0; font-size: 14px; text-align: right; mso-line-height-alt: 23.400000000000002px;\"><span style=\"color:#2b303a;font-size:13px;\">@@9 VND</span></p>");
		sb.append(
				" 																		<p style=\"margin: 0; font-size: 14px; text-align: right; mso-line-height-alt: 21.6px;\">&nbsp;</p>");
		sb.append(" 																	</div>");
		sb.append(" 																</div>");
		sb.append(" 															</td>");
		sb.append(" 														</tr>");
		sb.append(" 													</table>");
		sb.append(
				" 													<table class=\"text_block block-3\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;\">");
		sb.append(" 														<tr>");
		sb.append(
				" 															<td class=\"pad\" style=\"padding-top:15px;\">");
		sb.append(
				" 																<div style=\"font-family: sans-serif\">");
		sb.append(
				" 																	<div class=\"txtTinyMce-wrapper\" style=\"font-size: 12px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 21.6px; color: #555555; line-height: 1.8;\">");
		sb.append(
				" 																		<p style=\"margin: 0; font-size: 14px; text-align: right; mso-line-height-alt: 36px;\"><span style=\"font-size:20px;\"><strong><span style=\"color:#2b303a;\">@@10 VND</span></strong></span></p>");
		sb.append(" 																	</div>");
		sb.append(" 																</div>");
		sb.append(" 															</td>");
		sb.append(" 														</tr>");
		sb.append(" 													</table>");
		sb.append(" 												</td>");
		sb.append(" 											</tr>");
		sb.append(" 										</tbody>");
		sb.append(" 									</table>");
		sb.append(" 								</td>");
		sb.append(" 							</tr>");
		sb.append(" 						</tbody>");
		sb.append(" 					</table>");
		sb.append(
				" 					<table class=\"row row-8\" align=\"center\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 						<tbody>");
		sb.append(" 							<tr>");
		sb.append(" 								<td>");
		sb.append(
				" 									<table class=\"row-content stack\" align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff; color: #000000; width: 640px;\" width=\"640\">");
		sb.append(" 										<tbody>");
		sb.append(" 											<tr>");
		sb.append(
				" 												<td class=\"column column-1\" width=\"100%\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;\">");
		sb.append(
				" 													<table class=\"button_block block-1\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 														<tr>");
		sb.append(
				" 															<td class=\"pad\" style=\"padding-left:10px;padding-right:10px;padding-top:40px;text-align:center;\">");
		sb.append(
				" 																<div class=\"alignment\" align=\"center\">");
		sb.append(
				" 																	<!--[if mso]><v:roundrect xmlns:v=\"urn:schemas-microsoft-com:vml\" xmlns:w=\"urn:schemas-microsoft-com:office:word\" style=\"height:62px;width:203px;v-text-anchor:middle;\" arcsize=\"97%\" stroke=\"false\" fillcolor=\"#1aa19c\"><w:anchorlock/><v:textbox inset=\"0px,0px,0px,0px\"><center style=\"color:#ffffff; font-family:Tahoma, sans-serif; font-size:16px\"><![endif]-->");
		sb.append(
				" 																		<a href=\"@@11\" target=\"_blank\">");
		sb.append(
				" 																		<div style=\"text-decoration:none;display:inline-block;color:#ffffff;background-color:#1aa19c;border-radius:60px;width:auto;border-top:1px solid #1aa19c;font-weight:400;border-right:1px solid #1aa19c;border-bottom:1px solid #1aa19c;border-left:1px solid #1aa19c;padding-top:15px;padding-bottom:15px;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;\"><span style=\"padding-left:30px;padding-right:30px;font-size:16px;display:inline-block;letter-spacing:normal;\"><span dir=\"ltr\" style=\"margin: 0; word-break: break-word; line-height: 32px;\"><strong>View Your Invoice</strong></span></span></div>");
		sb.append(" 																		</a>");
		sb.append(
				" 																		<!--[if mso]></center></v:textbox></v:roundrect><![endif]-->");
		sb.append(" 																</div>");
		sb.append(" 															</td>");
		sb.append(" 														</tr>");
		sb.append(" 													</table>");
		sb.append(
				" 													<table class=\"divider_block block-2\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 														<tr>");
		sb.append(
				" 															<td class=\"pad\" style=\"padding-bottom:12px;padding-top:60px;\">");
		sb.append(
				" 																<div class=\"alignment\" align=\"center\">");
		sb.append(
				" 																	<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" width=\"100%\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 																		<tr>");
		sb.append(
				" 																			<td class=\"divider_inner\" style=\"font-size: 1px; line-height: 1px; border-top: 0px solid #BBBBBB;\"><span>&#8202;</span></td>");
		sb.append(" 																		</tr>");
		sb.append(" 																	</table>");
		sb.append(" 																</div>");
		sb.append(" 															</td>");
		sb.append(" 														</tr>");
		sb.append(" 													</table>");
		sb.append(" 												</td>");
		sb.append(" 											</tr>");
		sb.append(" 										</tbody>");
		sb.append(" 									</table>");
		sb.append(" 								</td>");
		sb.append(" 							</tr>");
		sb.append(" 						</tbody>");
		sb.append(" 					</table>");
		sb.append(
				" 					<table class=\"row row-9\" align=\"center\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 						<tbody>");
		sb.append(" 							<tr>");
		sb.append(" 								<td>");
		sb.append(
				" 									<table class=\"row-content stack\" align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; background-color: #f8f8f9; width: 640px;\" width=\"640\">");
		sb.append(" 										<tbody>");
		sb.append(" 											<tr>");
		sb.append(
				" 												<td class=\"column column-1\" width=\"100%\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;\">");
		sb.append(
				" 													<table class=\"divider_block block-1\" width=\"100%\" border=\"0\" cellpadding=\"20\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 														<tr>");
		sb.append(" 															<td class=\"pad\">");
		sb.append(
				" 																<div class=\"alignment\" align=\"center\">");
		sb.append(
				" 																	<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" width=\"100%\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 																		<tr>");
		sb.append(
				" 																			<td class=\"divider_inner\" style=\"font-size: 1px; line-height: 1px; border-top: 0px solid #BBBBBB;\"><span>&#8202;</span></td>");
		sb.append(" 																		</tr>");
		sb.append(" 																	</table>");
		sb.append(" 																</div>");
		sb.append(" 															</td>");
		sb.append(" 														</tr>");
		sb.append(" 													</table>");
		sb.append(" 												</td>");
		sb.append(" 											</tr>");
		sb.append(" 										</tbody>");
		sb.append(" 									</table>");
		sb.append(" 								</td>");
		sb.append(" 							</tr>");
		sb.append(" 						</tbody>");
		sb.append(" 					</table>");
		sb.append(
				" 					<table class=\"row row-10\" align=\"center\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 						<tbody>");
		sb.append(" 							<tr>");
		sb.append(" 								<td>");
		sb.append(
				" 									<table class=\"row-content stack\" align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; background-color: #2b303a; width: 640px;\" width=\"640\">");
		sb.append(" 										<tbody>");
		sb.append(" 											<tr>");
		sb.append(
				" 												<td class=\"column column-1\" width=\"100%\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;\">");
		sb.append(
				" 													<table class=\"divider_block block-1\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 														<tr>");
		sb.append(" 															<td class=\"pad\">");
		sb.append(
				" 																<div class=\"alignment\" align=\"center\">");
		sb.append(
				" 																	<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" width=\"100%\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 																		<tr>");
		sb.append(
				" 																			<td class=\"divider_inner\" style=\"font-size: 1px; line-height: 1px; border-top: 4px solid #1AA19C;\"><span>&#8202;</span></td>");
		sb.append(" 																		</tr>");
		sb.append(" 																	</table>");
		sb.append(" 																</div>");
		sb.append(" 															</td>");
		sb.append(" 														</tr>");
		sb.append(" 													</table>");
		sb.append(
				" 													<table class=\"image_block block-2\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 														<tr>");
		sb.append(
				" 															<td class=\"pad\" style=\"width:100%;padding-right:0px;padding-left:0px;\">");
		sb.append(
				" 																<div class=\"alignment\" align=\"center\" style=\"line-height:10px\"><img class=\"big\" src=\"https://d1oco4z2z1fhwp.cloudfront.net/templates/default/1366/footer.png\" style=\"display: block; height: auto; border: 0; width: 640px; max-width: 100%;\" width=\"640\" alt=\"I'm an image\" title=\"I'm an image\"></div>");
		sb.append(" 															</td>");
		sb.append(" 														</tr>");
		sb.append(" 													</table>");
		sb.append(
				" 													<table class=\"image_block block-3\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 														<tr>");
		sb.append(
				" 															<td class=\"pad\" style=\"padding-top:40px;width:100%;padding-right:0px;padding-left:0px;\">");
		sb.append(
				" 																<div class=\"alignment\" align=\"center\" style=\"line-height:10px\"><img src=\"https://d1oco4z2z1fhwp.cloudfront.net/templates/default/1366/Logo-white.png\" style=\"display: block; height: auto; border: 0; width: 149px; max-width: 100%;\" width=\"149\" alt=\"Alternate text\" title=\"Alternate text\"></div>");
		sb.append(" 															</td>");
		sb.append(" 														</tr>");
		sb.append(" 													</table>");
		sb.append(
				" 													<table class=\"social_block block-4\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 														<tr>");
		sb.append(
				" 															<td class=\"pad\" style=\"padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:28px;text-align:center;\">");
		sb.append(
				" 																<div class=\"alignment\" style=\"text-align:center;\">");
		sb.append(
				" 																	<table class=\"social-table\" width=\"208px\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block;\">");
		sb.append(" 																		<tr>");
		sb.append(
				" 																			<td style=\"padding:0 10px 0 10px;\"><a href=\"https://www.facebook.com/\" target=\"_blank\"><img src=\"https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-outline-circle-white/facebook@2x.png\" width=\"32\" height=\"32\" alt=\"Facebook\" title=\"Facebook\" style=\"display: block; height: auto; border: 0;\"></a></td>");
		sb.append(
				" 																			<td style=\"padding:0 10px 0 10px;\"><a href=\"https://twitter.com/\" target=\"_blank\"><img src=\"https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-outline-circle-white/twitter@2x.png\" width=\"32\" height=\"32\" alt=\"Twitter\" title=\"Twitter\" style=\"display: block; height: auto; border: 0;\"></a></td>");
		sb.append(
				" 																			<td style=\"padding:0 10px 0 10px;\"><a href=\"https://instagram.com/\" target=\"_blank\"><img src=\"https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-outline-circle-white/instagram@2x.png\" width=\"32\" height=\"32\" alt=\"Instagram\" title=\"Instagram\" style=\"display: block; height: auto; border: 0;\"></a></td>");
		sb.append(
				" 																			<td style=\"padding:0 10px 0 10px;\"><a href=\"https://www.linkedin.com/\" target=\"_blank\"><img src=\"https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-outline-circle-white/linkedin@2x.png\" width=\"32\" height=\"32\" alt=\"LinkedIn\" title=\"LinkedIn\" style=\"display: block; height: auto; border: 0;\"></a></td>");
		sb.append(" 																		</tr>");
		sb.append(" 																	</table>");
		sb.append(" 																</div>");
		sb.append(" 															</td>");
		sb.append(" 														</tr>");
		sb.append(" 													</table>");
		sb.append(
				" 													<table class=\"divider_block block-5\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 														<tr>");
		sb.append(
				" 															<td class=\"pad\" style=\"padding-bottom:10px;padding-left:40px;padding-right:40px;padding-top:25px;\">");
		sb.append(
				" 																<div class=\"alignment\" align=\"center\">");
		sb.append(
				" 																	<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" width=\"100%\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 																		<tr>");
		sb.append(
				" 																			<td class=\"divider_inner\" style=\"font-size: 1px; line-height: 1px; border-top: 1px solid #555961;\"><span>&#8202;</span></td>");
		sb.append(" 																		</tr>");
		sb.append(" 																	</table>");
		sb.append(" 																</div>");
		sb.append(" 															</td>");
		sb.append(" 														</tr>");
		sb.append(" 													</table>");
		sb.append(
				" 													<table class=\"text_block block-6\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;\">");
		sb.append(" 														<tr>");
		sb.append(
				" 															<td class=\"pad\" style=\"padding-bottom:30px;padding-left:40px;padding-right:40px;padding-top:20px;\">");
		sb.append(
				" 																<div style=\"font-family: sans-serif\">");
		sb.append(
				" 																	<div class=\"txtTinyMce-wrapper\" style=\"font-size: 12px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;\">");
		sb.append(
				" 																		<p style=\"margin: 0; font-size: 14px; text-align: left;\"><span style=\"color:#95979c;font-size:12px;\">Companify Copyright © 2020</span></p>");
		sb.append(" 																	</div>");
		sb.append(" 																</div>");
		sb.append(" 															</td>");
		sb.append(" 														</tr>");
		sb.append(" 													</table>");
		sb.append(" 												</td>");
		sb.append(" 											</tr>");
		sb.append(" 										</tbody>");
		sb.append(" 									</table>");
		sb.append(" 								</td>");
		sb.append(" 							</tr>");
		sb.append(" 						</tbody>");
		sb.append(" 					</table>");
		sb.append(
				" 					<table class=\"row row-11\" align=\"center\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 						<tbody>");
		sb.append(" 							<tr>");
		sb.append(" 								<td>");
		sb.append(
				" 									<table class=\"row-content stack\" align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 640px;\" width=\"640\">");
		sb.append(" 										<tbody>");
		sb.append(" 											<tr>");
		sb.append(
				" 												<td class=\"column column-1\" width=\"100%\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;\">");
		sb.append(
				" 													<table class=\"icons_block block-1\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 														<tr>");
		sb.append(
				" 															<td class=\"pad\" style=\"vertical-align: middle; color: #9d9d9d; font-family: inherit; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;\">");
		sb.append(
				" 																<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">");
		sb.append(" 																	<tr>");
		sb.append(
				" 																		<td class=\"alignment\" style=\"vertical-align: middle; text-align: center;\">");
		sb.append(
				" 																			<!--[if vml]><table align=\"left\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" style=\"display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;\"><![endif]-->");
		sb.append(" 																			<!--[if !vml]><!-->");
		sb.append(
				" 																			<table class=\"icons-inner\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\">");
		sb.append(" 																				<!--<![endif]-->");
		sb.append(" 																				<tr>");
		sb.append(
				" 																					<td style=\"vertical-align: middle; text-align: center; padding-top: 5px; padding-bottom: 5px; padding-left: 5px; padding-right: 6px;\"><a href=\"https://www.designedwithbee.com/?utm_source=editor&utm_medium=bee_pro&utm_campaign=free_footer_link\" target=\"_blank\" style=\"text-decoration: none;\"><img class=\"icon\" alt=\"Designed with BEE\" src=\"https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/BeeProAgency/53601_510656/Signature/bee.png\" height=\"32\" width=\"34\" align=\"center\" style=\"display: block; height: auto; margin: 0 auto; border: 0;\"></a></td>");
		sb.append(
				" 																					<td style=\"font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; font-size: 15px; color: #9d9d9d; vertical-align: middle; letter-spacing: undefined; text-align: center;\"><a href=\"https://www.designedwithbee.com/?utm_source=editor&utm_medium=bee_pro&utm_campaign=free_footer_link\" target=\"_blank\" style=\"color: #9d9d9d; text-decoration: none;\">Designed with BEE</a></td>");
		sb.append(" 																				</tr>");
		sb.append(" 																			</table>");
		sb.append(" 																		</td>");
		sb.append(" 																	</tr>");
		sb.append(" 																</table>");
		sb.append(" 															</td>");
		sb.append(" 														</tr>");
		sb.append(" 													</table>");
		sb.append(" 												</td>");
		sb.append(" 											</tr>");
		sb.append(" 										</tbody>");
		sb.append(" 									</table>");
		sb.append(" 								</td>");
		sb.append(" 							</tr>");
		sb.append(" 						</tbody>");
		sb.append(" 					</table>");
		sb.append(" 				</td>");
		sb.append(" 			</tr>");
		sb.append(" 		</tbody>");
		sb.append(" 	</table><!-- End -->");
		sb.append(" </body>");
		sb.append(" ");
		sb.append(" </html>");

		return sb.toString();

	}
}
