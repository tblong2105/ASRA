package com.asra.developer.common.utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.URL;
import java.nio.charset.StandardCharsets;

import org.jboss.vfs.VirtualFile;

import com.asra.developer.common.constants.MessageConstants;
import com.asra.developer.common.error.BussinessExeption;

public final class FileUtils {

	public static String readFileHtml(String fileName) throws IOException {

		String resourceDirectory = "templates/email/" + fileName;

		System.out.println(resourceDirectory);

		File file = getResource(resourceDirectory);

		String content = org.apache.commons.io.FileUtils.readFileToString(file, StandardCharsets.UTF_8.name());

		return content;
	}

	public static File getResource(String path) {
		URL url = FileUtils.class.getClassLoader().getResource(path);
		try {
			VirtualFile vf = null;
			Object content = url.getContent();
			if (content instanceof FileInputStream) {
				String tmpPath = path.substring(0, path.lastIndexOf('/'));
				url = FileUtils.class.getClassLoader().getResource(tmpPath);
				vf = (VirtualFile) url.getContent();
				return new File(vf.getPhysicalFile().getPath() + "\\" + path.substring(path.lastIndexOf('/') + 1));
			}

			if (content instanceof VirtualFile) {
				vf = (VirtualFile) content;
				return vf.getPhysicalFile();
			}
		} catch (IOException e) {
			throw new BussinessExeption(MessageConstants.MSE001);
		}
		return new File(url.getPath());
	}
}
