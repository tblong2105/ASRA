import { memo } from "react";
import { Row, Col, Image } from "antd";

function ImageGallery({ linkImages, thumbnailImage, cx }: any) {
  return (
    <>
      {/* IMAGES GALLERY */}
      <Image.PreviewGroup>
        <div className={cx("images-gallery")}>
          <Row>
            <Col span={12}>
              <Image
                className={cx("thumbnail-image")}
                src={thumbnailImage?.imageLink}
              />
            </Col>
            <Col span={12}>
              <Row>
                {linkImages
                  .sort(
                    (a: any, b: any) =>
                      a?.imageName?.slice(0, a?.imageName.indexOf("_")) -
                      b?.imageName?.slice(0, b?.imageName.indexOf("_"))
                  )
                  .map((image: any, index: number) => {
                    return (
                      <Col
                        key={index}
                        span={12}
                        className={cx("image-detail-border")}
                      >
                        <Image
                          className={cx("image-detail")}
                          src={image.imageLink}
                          alt=""
                        />
                      </Col>
                    );
                  })}
              </Row>
            </Col>
          </Row>
        </div>
      </Image.PreviewGroup>
    </>
  );
}

export default memo(ImageGallery);
