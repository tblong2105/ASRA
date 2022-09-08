import styles from "./index.module.scss";
import classNames from "classnames/bind";
import { Form, Row, Col, Image } from "antd";
import longtb from "assets/images/longtb.jpg";
import phucnt from "assets/images/phucnt.jpg";
import sonld from "assets/images/sonld.jpg";
import hungnq from "assets/images/hungnq.jpg";
import longltv from "assets/images/longltv.jpg";

const cx = classNames.bind(styles);

function AboutUs(props: any) {
  return (
    <>
      <div className={cx("about-us-screen")}>
        <Form name="basic" autoComplete="off" layout="vertical">
          <div className={cx("about-us-container")}>
            <div className={cx("about-us-box")}>
              <Row>
                <Col span={24}>
                  <div className={cx("about-us-title")}>ABOUT US</div>
                </Col>
                <Col span={24}>
                  <div className={cx("about-us-text")}>
                    We are students of FPT University. All majored in
                    information technology at this school.
                  </div>
                </Col>
                <Col span={24}>
                  <div className={cx("about-us-text")}>
                    Together, we have created a product that can help students
                    who come to other cities to study easily to find
                    accommodation.
                  </div>
                </Col>
                <Col span={24}>
                  <div className={cx("about-us-text")}>
                    We hope to be able to do a small part to make life easier.
                  </div>
                </Col>
                <Col span={24}>
                  <Row className={cx("multi-image")}>
                    <Col span={4}>
                      <Image className={cx("member-image")} src={longtb} />
                    </Col>
                    <Col span={4}>
                      <Image className={cx("member-image")} src={sonld} />
                    </Col>
                    <Col span={4}>
                      <Image className={cx("member-image")} src={phucnt} />
                    </Col>
                    <Col span={4}>
                      <Image className={cx("member-image")} src={hungnq} />
                    </Col>
                    <Col span={4}>
                      <Image className={cx("member-image")} src={longltv} />
                    </Col>
                  </Row>
                </Col>
                <Col span={24}>
                  <Row className={cx("multi-name")}>
                    <Col span={4}>
                      <div className={cx("member-name")}>Thai Binh Long</div>
                    </Col>
                    <Col span={4}>
                      <div className={cx("member-name")}>Le Duc Son</div>
                    </Col>
                    <Col span={4}>
                      <div className={cx("member-name")}>
                        Nguyen Truong Phuc
                      </div>
                    </Col>
                    <Col span={4}>
                      <div className={cx("member-name")}>Nguyen Quang Hung</div>
                    </Col>
                    <Col span={4}>
                      <div className={cx("member-name")}>Le Tran Viet Long</div>
                    </Col>
                  </Row>
                </Col>
                <Col span={24}>
                  <Row className={cx("multi-id")}>
                    <Col span={4}>
                      <div className={cx("member-id")}>DE140036</div>
                    </Col>
                    <Col span={4}>
                      <div className={cx("member-id")}>DE140194</div>
                    </Col>
                    <Col span={4}>
                      <div className={cx("member-id")}>DE140006</div>
                    </Col>
                    <Col span={4}>
                      <div className={cx("member-id")}>DE140016</div>
                    </Col>
                    <Col span={4}>
                      <div className={cx("member-id")}>DE140018</div>
                    </Col>
                  </Row>
                </Col>
                <Col span={24}>
                  <Row className={cx("multi-major")}>
                    <Col span={4}>
                      <div className={cx("member-major")}>
                        Software Engineer
                      </div>
                    </Col>
                    <Col span={4}>
                      <div className={cx("member-major")}>
                        Software Engineer
                      </div>
                    </Col>
                    <Col span={4}>
                      <div className={cx("member-major")}>
                        Software Engineer
                      </div>
                    </Col>
                    <Col span={4}>
                      <div className={cx("member-major")}>
                        Software Engineer
                      </div>
                    </Col>
                    <Col span={4}>
                      <div className={cx("member-major")}>
                        Software Engineer
                      </div>
                    </Col>
                  </Row>
                </Col>
                <Col span={24}>
                  <Row className={cx("multi-address")}>
                    <Col span={4}>
                      <div className={cx("member-address")}>
                        <div className={cx("address-icon")}></div>
                        <div>Gia Lai</div>
                      </div>
                    </Col>
                    <Col span={4}>
                      <div className={cx("member-address")}>
                        <div className={cx("address-icon")}></div>
                        Quang Binh
                      </div>
                    </Col>
                    <Col span={4}>
                      <div className={cx("member-address")}>
                        <div className={cx("address-icon")}></div>
                        Dak Nong
                      </div>
                    </Col>
                    <Col span={4}>
                      <div className={cx("member-address")}>
                        <div className={cx("address-icon")}></div>
                        Da Nang
                      </div>
                    </Col>
                    <Col span={4}>
                      <div className={cx("member-address")}>
                        <div className={cx("address-icon")}></div>
                        Da Nang
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </div>
        </Form>
      </div>
    </>
  );
}

export default AboutUs;
