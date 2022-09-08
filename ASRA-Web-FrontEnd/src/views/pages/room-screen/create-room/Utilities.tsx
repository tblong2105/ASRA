import { useState, useEffect, useRef, memo } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Modal, Progress, Spin, Alert } from "antd";
import {
  InboxOutlined,
  EyeOutlined,
  LoadingOutlined,
  UploadOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { IMAGE_RESOURCE } from "commons/constants";
import { getBase64 } from "commons/utils/files";
import LoadingIcon from "components/Layout/components/Loading";
import ModalConfirm from "components/helper/ModalConfirm";

function Utilities({
  handleUploadFile,
  handleDeleteFile,
  handleActiveUtility,
  handleStyleDisplayImage,
  setImageListAtUtilityComponent,
  imageList,
  utilities,
  uploading,
  loading,
  progress,
  imagesRef,
  thumbnailImage,
  deletedImageLoading,
  imageId,
  errorMessageImage,
  errorMessageUtility,
  cx,
}: any) {
  const params = useParams<{ roomId: string }>();

  const [previewImage, setPreviewImage] = useState<string>("");
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [hoverInputUpload, setHoverInputUpload] = useState<boolean>(false);
  const inputFileRef = useRef<any>();
  let imageListSort = imageList.sort((a: any, b: any) => {
    if (
      a?.resource !== IMAGE_RESOURCE.LOCAL &&
      b?.resource !== IMAGE_RESOURCE.LOCAL
    ) {
      return (
        a?.imageName?.slice(0, a?.imageName.indexOf("_")) -
        b?.imageName?.slice(0, b?.imageName.indexOf("_"))
      );
    }
  });
  /**
   * Show image detail
   * @param file
   */
  const handlePreviewImage: any = (file: any) => {
    let { imageLink } = file;
    if (imageLink) {
      setPreviewImage(imageLink);
      setPreviewVisible(true);
    }
  };

  /**
   * Close popup preview image detail
   * @returns
   */
  const handleCloseImage = () => setPreviewVisible(false);

  const handleClickInputFile = (event: any, fileImage: any) => {
    let files = event.target.files;
    getBase64(files[0]).then((data: any) => {
      let file = {
        imageLink: data,
        imageName: files[0].name,
        resource: IMAGE_RESOURCE.LOCAL,
      };
      setImageListAtUtilityComponent(file, fileImage, Array.from(files));
    });
  };

  useEffect(() => {
    try {
      handleStyleDisplayImage();
    } catch (error) {}
  }, [imageList]);

  useEffect(() => {
    // Custom style for the image card
    let imageDisplayLayout: any =
      document.getElementsByClassName("image-display")[0];
    let imagesLength = [...imageList, thumbnailImage].length;
    if (imagesLength <= 0 && imageDisplayLayout) {
      imageDisplayLayout.style.display = "block";
      imageDisplayLayout.style.paddingLeft = "8px";
    }
  }, []);
  return (
    <>
      <div className="utilities-tab">
        <div className="inner-utility" style={{ margin: "0 60px 60px 60px" }}>
          <p className="title">Images</p>
          <div className="image_list">
            <Row className="image-display">
              {/* {thumbnailImage?.imageLink && params?.roomId && (
                <>
                  <Col style={{ marginBottom: "8px" }} span={4.8}>
                    <div className="image_border">
                      <div className="image_area">
                        <EyeOutlined
                          onClick={() => handlePreviewImage(thumbnailImage)}
                          className="eye_icon"
                        />
                        {thumbnailImage?.resource ===
                          IMAGE_RESOURCE.THUMBNAIL && (
                          <>
                            <UploadOutlined
                              style={hoverInputUpload ? { color: "#fff" } : {}}
                              className="draff_icon"
                            />
                            <input
                              ref={inputFileRef}
                              type="file"
                              style={{
                                position: "absolute",
                                top: "44%",
                                right: "35%",
                                margin: "0",
                                padding: "0",
                                width: "24px",
                                height: "24px",
                                opacity: "0",
                                zIndex: "10000",
                              }}
                              onMouseOver={() => setHoverInputUpload(true)}
                              onMouseOut={() => setHoverInputUpload(false)}
                              onChange={(event) =>
                                handleClickInputFile(event, thumbnailImage)
                              }
                            />
                          </>
                        )}

                        <img
                          src={thumbnailImage?.imageLink}
                          alt={thumbnailImage?.imageName}
                        />
                        <div className="thumbnail-image">
                          <span>Thumbnail Image</span>
                        </div>
                      </div>
                      {params?.roomId &&
                        imageId === thumbnailImage.id &&
                        deletedImageLoading && (
                          <div className="progress">
                            <Spin
                              indicator={
                                <LoadingIcon customStyles={{ fontSize: 30 }} />
                              }
                            />
                          </div>
                        )}
                    </div>
                    <div className="remove-icon">
                      <CloseCircleOutlined
                        onClick={() => handleDeleteFile(thumbnailImage)}
                      />
                    </div>
                  </Col>
                </>
              )} */}
              {thumbnailImage?.imageLink && params?.roomId
                ? [thumbnailImage, ...imageListSort].map(
                    (file: any, index: number) => {
                      return (
                        <Col
                          style={{ marginBottom: "8px" }}
                          key={index}
                          span={4.8}
                        >
                          <div className="image_border">
                            <div className="image_area">
                              <EyeOutlined
                                onClick={() => handlePreviewImage(file)}
                                className="eye_icon"
                              />
                              <UploadOutlined
                                style={
                                  hoverInputUpload ? { color: "#fff" } : {}
                                }
                                className="draff_icon"
                              />
                              <input
                                ref={inputFileRef}
                                type="file"
                                style={{
                                  position: "absolute",
                                  top: "44%",
                                  right: "35%",
                                  margin: "0",
                                  padding: "0",
                                  width: "24px",
                                  height: "24px",
                                  opacity: "0",
                                  zIndex: "10000",
                                }}
                                onMouseOver={() => setHoverInputUpload(true)}
                                onMouseOut={() => setHoverInputUpload(false)}
                                onChange={(event) =>
                                  handleClickInputFile(event, file)
                                }
                              />

                              <img
                                ref={imagesRef}
                                src={file?.imageLink || file}
                                alt={file?.imageName}
                              />
                              {index === 0 && (
                                <div className="thumbnail-image">
                                  <span>Thumbnail Image</span>
                                </div>
                              )}
                              {uploading &&
                                file?.resource === IMAGE_RESOURCE.LOCAL && (
                                  <Progress
                                    className="progress"
                                    type="circle"
                                    percent={progress}
                                    width={30}
                                  />
                                )}
                            </div>
                            {params?.roomId &&
                              imageId === file.id &&
                              deletedImageLoading && (
                                <div className="progress">
                                  <Spin
                                    indicator={
                                      <LoadingIcon
                                        customStyles={{ fontSize: 30 }}
                                      />
                                    }
                                  />
                                </div>
                              )}
                          </div>
                          <div className="remove-icon">
                            <CloseCircleOutlined
                              onClick={() => handleDeleteFile(file)}
                            />
                          </div>
                        </Col>
                      );
                    }
                  )
                : imageListSort.map((file: any, index: number) => {
                    return (
                      <Col
                        style={{ marginBottom: "8px" }}
                        key={index}
                        span={4.8}
                      >
                        <div className="image_border">
                          <div className="image_area">
                            <EyeOutlined
                              onClick={() => handlePreviewImage(file)}
                              className="eye_icon"
                            />
                            <UploadOutlined
                              style={hoverInputUpload ? { color: "#fff" } : {}}
                              className="draff_icon"
                            />
                            <input
                              ref={inputFileRef}
                              type="file"
                              style={{
                                position: "absolute",
                                top: "44%",
                                right: "35%",
                                margin: "0",
                                padding: "0",
                                width: "24px",
                                height: "24px",
                                opacity: "0",
                                zIndex: "10000",
                              }}
                              onMouseOver={() => setHoverInputUpload(true)}
                              onMouseOut={() => setHoverInputUpload(false)}
                              onChange={(event) =>
                                handleClickInputFile(event, file)
                              }
                            />

                            <img
                              ref={imagesRef}
                              src={file?.imageLink || file}
                              alt={file?.imageName}
                            />
                            {index === 0 && (
                              <div className="thumbnail-image">
                                <span>Thumbnail Image</span>
                              </div>
                            )}
                            {uploading &&
                              file?.resource === IMAGE_RESOURCE.LOCAL && (
                                <Progress
                                  className="progress"
                                  type="circle"
                                  percent={progress}
                                  width={30}
                                />
                              )}
                          </div>
                          {params?.roomId &&
                            imageId === file.id &&
                            deletedImageLoading && (
                              <div className="progress">
                                <Spin
                                  indicator={
                                    <LoadingIcon
                                      customStyles={{ fontSize: 30 }}
                                    />
                                  }
                                />
                              </div>
                            )}
                        </div>
                        <div className="remove-icon">
                          <CloseCircleOutlined
                            onClick={() => handleDeleteFile(file)}
                          />
                        </div>
                      </Col>
                    );
                  })}
              {/* // */}
              <Col span={4.8}>
                <div className="btn_upload">
                  {loading ? (
                    <LoadingOutlined className="sprin_icon" spin />
                  ) : (
                    <>
                      <input
                        className="file_upload_input"
                        type="file"
                        onChange={handleUploadFile}
                        multiple
                      />
                      <InboxOutlined className="inbox-icon" />
                      <p className="upload-title">
                        Click or drag file to this area to upload
                      </p>
                      <p className="file-size">
                        Maximum files size 1 MB Format: .JPEG, .PNG
                      </p>
                    </>
                  )}
                </div>
              </Col>
              {/* {params?.roomId && imageList.length < 9 && (
                <Col span={4.8}>
                  <div className="btn_upload">
                    {loading ? (
                      <LoadingOutlined className="sprin_icon" spin />
                    ) : (
                      <>
                        <input
                          className="file_upload_input"
                          type="file"
                          onChange={handleUploadFile}
                          multiple
                        />
                        <InboxOutlined className="inbox-icon" />
                        <p className="upload-title">
                          Click or drag file to this area to upload
                        </p>
                        <p className="file-size">
                          Maximum file size 1 MB Format: .JPEG, .PNG
                        </p>
                      </>
                    )}
                  </div>
                </Col>
              )} */}
              <ModalConfirm
                title={null}
                zIndex={4}
                isModalVisible={previewVisible}
                footer={null}
                close={handleCloseImage}
                children={
                  <img
                    alt="example"
                    style={{ width: "100%" }}
                    src={previewImage}
                  />
                }
              />
            </Row>
          </div>
          {errorMessageImage && (
            <div className="error">
              <Alert message={errorMessageImage} type="error" showIcon />
            </div>
          )}
        </div>
        <div className="inner-utility">
          <p className="title">Utilities</p>
          <div className="image_list">
            <Row className="utilities">
              {utilities.map((utility: any) => {
                return (
                  <Col
                    key={utility.id}
                    className={utility.border}
                    onClick={() => handleActiveUtility(utility.id)}
                    span={3}
                  >
                    <div className={utility.className}></div>
                  </Col>
                );
              })}
            </Row>
          </div>
          {errorMessageUtility ? (
            <div className="error">
              <Alert message={errorMessageUtility} type="error" showIcon />
            </div>
          ) : (
            <p className="utilities-valid">Choose at least 5 utilities</p>
          )}
        </div>
      </div>
    </>
  );
}

export default memo(Utilities);
