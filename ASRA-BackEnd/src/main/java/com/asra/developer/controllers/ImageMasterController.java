package com.asra.developer.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.asra.developer.models.payload.request.DeleteImageRequest;
import com.asra.developer.repository.ImageMasterRepositoty;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api/image-master")
public class ImageMasterController {

	@Autowired
	private ImageMasterRepositoty imageMasterRepositoty;

	@PostMapping("/delete")
	public void deleteImage(@RequestBody DeleteImageRequest deleteImageRequest) {
		try {
			imageMasterRepositoty.deleteById(deleteImageRequest.getImageId());
		} catch (Exception e) {
			e.printStackTrace();
		}

	}
}
