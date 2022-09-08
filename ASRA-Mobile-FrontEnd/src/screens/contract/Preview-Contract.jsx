import { View } from "native-base";
import { useEffect, useRef, useState } from "react";
import { Image, SafeAreaView, ScrollView, Text } from "react-native";
import { Modal } from "native-base";
import { v4 } from "uuid";
import { storage } from "../../utils/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import * as WebBrowser from "expo-web-browser";

import { currencyViCodeNoIcon } from "../../utils/currency-util";
import { COLORS, TABS } from "../../constants";
import { utcToVNTime } from "../../utils/date-util";
import { getContractDetail } from "../../api/contract";
import { DOMAIN } from "../../constants";

import CustomButton from "../../components/custom/Button";
import Header from "../../components/layout/header/Header";
import FocusedStatusBar from "../../components/layout/focused-status-bar/FocusedStatusBar";
import SignatureScreen from "react-native-signature-canvas";
import Loading from "../../components/loading/Loading";

export default function PreviewContract(props) {
  const refSigPad = useRef();
  const { navigation, route } = props;

  const [contract, setContract] = useState();
  const [contractLoading, setContractLoading] = useState(false);
  const [disableSignBtnFlag, setdisableSignBtnFlag] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [result, setResult] = useState(null);
  const style = `.m-signature-pad--footer {display: none; margin: 0px;}`;
  let sigPad = {};

  useEffect(() => {
    setContractLoading(true);
    getContractDetail(route?.params?.contractId).then((res) => {
      setContract(res);
      setContractLoading(false);
    });
  }, [result]);

  const handleCloseSignature = () => {
    setShowSignatureModal(false);
    sigPad?.clearSignature();
  };

  const handleClearSignature = () => {
    sigPad?.clearSignature();
  };

  const handleSubmitSignature = () => {
    //Trigger call handleOk
    sigPad.readSignature();
  };

  const handleOK = async (signature) => {
    setdisableSignBtnFlag(true);
    urlToBlob(signature).then((blob) => {
      handleUploadFileFirebase(blob).then(async (res) => {
        handleCloseSignature();
        let result = await WebBrowser.openBrowserAsync(
          `${DOMAIN.ONLINE}/payment/bill/native/${contract.billId}?tenantSignUrl=${res}`
        );
        setResult(result?.type);
        setdisableSignBtnFlag(false);
      });
    });
  };

  const handleUploadFileFirebase = (imageUpload) => {
    let metadata = {
      contentType: ["image/jpeg", "image/png"],
    };
    let imageRef = ref(storage, `signature/signature_${v4()}`);
    let uploadTask = uploadBytesResumable(imageRef, imageUpload);
    if (Object.getPrototypeOf(imageUpload) === Object.prototype) {
      return Promise.resolve(null);
    }
    // Listen for state changes, errors, and completion of the upload.
    let imageUploadPromise = new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          switch (snapshot.state) {
            case "paused":
              break;
            case "running":
              break;
          }
        },
        (error) => {
          switch (error.code) {
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              break;
            case "storage/canceled":
              // User canceled the upload
              break;
            case "storage/unknown":
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        },
        async () => {
          // Get images uploaded from firebase
          await getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              resolve(downloadURL);
              return downloadURL;
            })
            .catch((err) => reject(err))
            .finally(() => {});
        }
      );
    });

    return imageUploadPromise;
  };

  function urlToBlob(url) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onerror = reject;
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          resolve(xhr.response);
        }
      };
      xhr.open("GET", url);
      xhr.responseType = "blob"; // convert type
      xhr.send();
    });
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <FocusedStatusBar backgroundColor={COLORS.primary} />
      <Header title={TABS.contract} navigation={navigation} />
      {contractLoading ? (
        <Loading />
      ) : (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ paddingTop: 10, paddingHorizontal: 16 }}
          >
            <View>
              <Text
                style={{
                  marginTop: 4,
                  textAlign: "center",
                  fontWeight: "600",
                }}
              >
                CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "400",
                }}
              >
                Độc lập – Tự do – Hạnh phúc
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 20,
                  fontWeight: "bold",
                }}
              >
                HỢP ĐỒNG THUÊ PHÒNG TRỌ
              </Text>
              <Text
                style={{
                  marginTop: 8,
                  fontSize: 12,
                }}
              >
                Hôm nay: ngày {new Date(contract?.contractCreateDate).getDate()}{" "}
                tháng {new Date(contract?.contractCreateDate).getMonth() + 1}{" "}
                năm {new Date(contract?.contractCreateDate).getFullYear()}
              </Text>
              <Text
                style={{
                  marginTop: 4,
                  fontSize: 12,
                }}
              >
                Tại địa chỉ: {contract?.contractCreateAddress}
              </Text>
              <Text
                style={{
                  marginTop: 16,
                  fontSize: 12,
                }}
              >
                Chúng tôi gồm:
              </Text>
              <Text
                style={{
                  marginTop: 6,
                  fontSize: 12,
                }}
              >
                1. Đại diện bên cho thuê phòng trọ (Innkeeper):
              </Text>
              <Text
                style={{
                  marginTop: 4,
                  fontSize: 12,
                }}
              >
                Ông/bà: {contract?.innkeeperName?.toUpperCase()}
              </Text>
              <Text
                style={{
                  marginTop: 2,
                  fontSize: 12,
                }}
              >
                Sinh ngày: {contract?.innkeeperBirthdate}
              </Text>
              <Text
                style={{
                  marginTop: 2,
                  fontSize: 12,
                }}
              >
                Nơi đăng ký HK: {contract?.innkeeperPermanentResidence}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    marginTop: 2,
                    fontSize: 12,
                  }}
                >
                  CMND/CCCD số: {contract?.innkeeperIdentityCardNo}
                </Text>
                <Text
                  style={{
                    marginTop: 2,
                    marginLeft: 20,
                    fontSize: 12,
                  }}
                >
                  Cấp ngày: {contract?.innkeeperDateOfIssuanceOfIdentityCard}
                </Text>
              </View>
              <Text
                style={{
                  marginTop: 2,
                  fontSize: 12,
                }}
              >
                Tại: {contract?.innkeeperThePlaceIdentityCard}
              </Text>
              <Text
                style={{
                  marginTop: 2,
                  fontSize: 12,
                }}
              >
                Số điện thoại: {contract?.innkeeperPhoneNumber}
              </Text>

              {/* Tenant Section */}
              <Text
                style={{
                  marginTop: 16,
                  fontSize: 12,
                }}
              >
                2. Đại diện bên thuê phòng trọ (Tenant):
              </Text>
              <Text
                style={{
                  marginTop: 4,
                  fontSize: 12,
                }}
              >
                Ông/bà: {contract?.tenantName?.toUpperCase()}
              </Text>
              <Text
                style={{
                  marginTop: 2,
                  fontSize: 12,
                }}
              >
                Sinh ngày: {utcToVNTime(new Date(contract?.tenantBirthday))}
              </Text>

              <Text
                style={{
                  marginTop: 2,
                  fontSize: 12,
                }}
              >
                Nơi đăng ký HK: {contract?.tenantPermanentResidence}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    marginTop: 2,
                    fontSize: 12,
                  }}
                >
                  CMND/CCCD số: {contract?.tenantIcNo}
                </Text>
                <Text
                  style={{
                    marginTop: 2,
                    marginLeft: 20,
                    fontSize: 12,
                  }}
                >
                  Cấp ngày: {utcToVNTime(new Date(contract?.tenantIcIssueDate))}
                </Text>
              </View>
              <Text
                style={{
                  marginTop: 2,
                  fontSize: 12,
                }}
              >
                Tại: {contract?.tenantIcIssueLoc?.toUpperCase()}
              </Text>
              <Text
                style={{
                  marginTop: 2,
                  fontSize: 12,
                }}
              >
                Số điện thoại: {contract?.tenantPhoneNumber}
              </Text>

              <Text
                style={{
                  marginTop: 20,
                  fontSize: 12,
                }}
              >
                Sau khi bàn bạc trên tinh thần dân chủ, hai bên cùng có lợi,
                cùng thống nhất như sau:
              </Text>
              <Text
                style={{
                  marginTop: 6,
                  fontSize: 12,
                }}
              >
                Bên cho thuê phòng trọ đồng ý cho bên thuê phòng trọ thuê 01
                phòng ở tại địa chỉ: {contract?.contractCreateAddress}.
              </Text>
              <Text
                style={{
                  marginTop: 2,
                  fontSize: 12,
                }}
              >
                Giá thuê: {currencyViCodeNoIcon(contract?.rentalPrice)} đồng.
              </Text>
              <Text
                style={{
                  marginTop: 2,
                  fontSize: 12,
                }}
              >
                Hình thức thanh toán: Thanh toán qua {contract?.paymentType}.
              </Text>
              <Text
                style={{
                  marginTop: 2,
                  fontSize: 12,
                }}
              >
                Tiền điện: {currencyViCodeNoIcon(contract?.electronicPrice)}{" "}
                đồng/kwh tính theo chỉ số công tơ, thanh toán vào cuối các
                tháng.
              </Text>
              <Text
                style={{
                  marginTop: 2,
                  fontSize: 12,
                }}
              >
                Tiền nước: {currencyViCodeNoIcon(contract?.waterPrice)}{" "}
                đồng/người thanh toán vào đầu các tháng.
              </Text>
              <Text
                style={{
                  marginTop: 2,
                  fontSize: 12,
                }}
              >
                Tiền đặt cọc: {currencyViCodeNoIcon(contract?.deposit)} đồng.
              </Text>

              <Text
                style={{
                  marginTop: 20,
                  fontSize: 12,
                }}
              >
                Trách nhiệm của các bên:
              </Text>

              <Text
                style={{
                  marginTop: 8,
                  fontSize: 12,
                }}
              >
                1. Trách nhiệm của bên cho thuê phòng trọ (Innkeeper):
              </Text>
              <Text
                style={{
                  marginTop: 4,
                  fontSize: 12,
                }}
              >
                {!contract?.innkeeperResponsibility ? (
                  <View>
                    <Text
                      style={{
                        marginTop: 2,
                        fontSize: 12,
                      }}
                    >
                      - Tạo mọi điều kiện thuận lợi để bên B thực hiện theo hợp
                      đồng.
                    </Text>
                    <Text
                      style={{
                        marginTop: 2,
                        fontSize: 12,
                      }}
                    >
                      - Cung cấp nguồn điện, nước, wifi cho bên B sử dụng.
                    </Text>
                  </View>
                ) : (
                  <>
                    {contract?.innkeeperResponsibility?.split("/n").map((x) => (
                      <Text
                        key={x}
                        style={{
                          marginTop: 2,
                          fontSize: 12,
                        }}
                      >
                        {x}
                      </Text>
                    ))}
                  </>
                )}
              </Text>

              <Text
                style={{
                  marginTop: 8,
                  fontSize: 12,
                }}
              >
                2. Trách nhiệm của bên thuê phòng trọ (Tenant):
              </Text>
              <Text
                style={{
                  marginTop: 4,
                  fontSize: 12,
                }}
              >
                {!contract?.tenantResponsibility ? (
                  <View>
                    <Text
                      style={{
                        marginTop: 2,
                        fontSize: 12,
                      }}
                    >
                      - Thanh toán đầy đủ các khoản tiền theo đúng thỏa thuận.
                    </Text>
                    <Text
                      style={{
                        marginTop: 2,
                        fontSize: 12,
                      }}
                    >
                      - Bảo quản các trang thiết bị và cơ sở vật chất của bên A
                      trang bị cho ban đầu làm hỏng phải sửa, mất phải đền.
                    </Text>
                    <Text
                      style={{
                        marginTop: 2,
                        fontSize: 12,
                      }}
                    >
                      {" "}
                      Không được tự ý sửa chữa, cải tạo cơ sở vật chất khi chưa
                      được sự đồng ý của bên A.
                    </Text>
                    <Text
                      style={{
                        marginTop: 2,
                        fontSize: 12,
                      }}
                    >
                      - Giữ gìn vệ sinh trong và ngoài khuôn viên của phòng trọ.
                    </Text>
                    <Text
                      style={{
                        marginTop: 2,
                        fontSize: 12,
                      }}
                    >
                      - Bên B phải chấp hành mọi quy định của pháp luật Nhà nước
                      và quy định của địa phương.
                    </Text>
                    <Text
                      style={{
                        marginTop: 2,
                        fontSize: 12,
                      }}
                    >
                      - Nếu bên B cho khách ở qua đêm thì phải báo và được sự
                      đồng ý của chủ nhà đồng thời phải chịu trách nhiệm về các
                      hành vi vi phạm pháp luật của khách trong thời gian ở lại.
                    </Text>
                  </View>
                ) : (
                  <>
                    {contract?.tenantResponsibility?.split("/n").map((x) => (
                      <Text
                        key={x}
                        style={{
                          marginTop: 2,
                          fontSize: 11,
                        }}
                      >
                        {x}
                      </Text>
                    ))}
                  </>
                )}
              </Text>

              <Text
                style={{
                  marginTop: 8,
                  fontSize: 12,
                }}
              >
                3. Trách nhiệm chung:
              </Text>
              <Text
                style={{
                  marginTop: 4,
                  fontSize: 12,
                }}
              >
                {!contract?.commonResponsibility ? (
                  <View>
                    <Text
                      style={{
                        marginTop: 2,
                        fontSize: 12,
                      }}
                    >
                      - Hai bên phải tạo điều kiện cho nhau thực hiện hợp đồng.
                    </Text>
                    <Text
                      style={{
                        marginTop: 2,
                        fontSize: 12,
                      }}
                    >
                      - Trong thời gian hợp đồng còn hiệu lực nếu bên nào vi
                      phạm các điều khoản đã thỏa thuận thì bên còn lại có quyền
                      đơn phương chấm dứt hợp đồng; nếu sự vi phạm hợp đồng đó
                      gây tổn thất cho bên bị vi phạm hợp đồng thì bên vi phạm
                      hợp đồng phải bồi thường thiệt hại.
                    </Text>
                    <Text
                      style={{
                        marginTop: 2,
                        fontSize: 12,
                      }}
                    >
                      - Một trong hai bên muốn chấm dứt hợp đồng trước thời hạn
                      thì phải báo trước cho bên kia ít nhất 30 ngày và hai bên
                      phải có sự thống nhất.
                    </Text>
                    <Text
                      style={{
                        marginTop: 2,
                        fontSize: 12,
                      }}
                    >
                      - Bên A phải trả lại tiền đặt cọc cho bên B.
                    </Text>
                    <Text
                      style={{
                        marginTop: 2,
                        fontSize: 12,
                      }}
                    >
                      - Bên nào vi phạm điều khoản chung thì phải chịu trách
                      nhiệm trước pháp luật.
                    </Text>
                    <Text
                      style={{
                        marginTop: 2,
                        fontSize: 12,
                      }}
                    >
                      - Hợp đồng được lập thành 02 bản có giá trị pháp lý như
                      nhau, mỗi bên giữ một bản.
                    </Text>
                  </View>
                ) : (
                  <>
                    {contract?.commonResponsibility?.split("/n").map((x) => (
                      <Text
                        key={x}
                        style={{
                          marginTop: 2,
                          fontSize: 11,
                        }}
                      >
                        {x}
                      </Text>
                    ))}
                  </>
                )}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  display: "flex",
                  justifyContent: "space-between",
                  padding: 20,
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                  }}
                >
                  <Text>Đại diện bên thuê</Text>
                  <Image
                    style={{
                      width: 80,
                      height: 80,
                    }}
                    source={{
                      uri: `${
                        contract?.tenantSignature
                          ? contract?.tenantSignature
                          : "a"
                      }`,
                    }}
                  />
                  <Text>
                    {contract?.tenantSignature
                      ? contract?.tenantName?.toUpperCase()
                      : ""}
                  </Text>
                </View>
                <View
                  style={{
                    alignItems: "center",
                  }}
                >
                  <Text>Đại diện bên cho thuê</Text>
                  <Image
                    style={{
                      width: 80,
                      height: 80,
                    }}
                    source={{
                      uri: `${
                        contract?.innkeeperSignature
                          ? contract?.innkeeperSignature
                          : "a"
                      }`,
                    }}
                  />
                  <Text>{contract?.innkeeperName?.toUpperCase()}</Text>
                </View>
              </View>
            </View>
            {!contract?.tenantSignature && (
              <View
                style={{
                  paddingBottom: 40,
                }}
              >
                <CustomButton
                  disabled={disableSignBtnFlag}
                  flex={1}
                  label="Signature"
                  fontSize={14}
                  paddingVertical={10}
                  onPress={() => {
                    setShowSignatureModal(true);
                  }}
                />
              </View>
            )}
          </ScrollView>

          <Modal
            animationPreset="slide"
            isOpen={showSignatureModal}
            onClose={() => handleCloseSignature()}
            size="xl"
          >
            <Modal.Content maxWidth="350">
              <Modal.CloseButton />
              <Modal.Header>
                <Text
                  style={{ fontSize: 16, textAlign: "center", paddingTop: 3 }}
                >
                  Signature
                </Text>
              </Modal.Header>
              <View propagateSwipe={false} style={{ height: 300 }}>
                <SignatureScreen
                  propagateSwipe={false}
                  ref={(refSigPad) => {
                    sigPad = refSigPad;
                  }}
                  webStyle={style}
                  onOK={handleOK}
                  minWidth={1}
                  maxWidth={1}
                />
              </View>
              <Modal.Footer>
                <CustomButton
                  disabled={disableSignBtnFlag}
                  key={1}
                  flex={1}
                  label="Clear"
                  fontSize={14}
                  paddingVertical={10}
                  marginLeft={4}
                  marginRight={4}
                  backgroundColor="#dc3545"
                  onPress={() => {
                    handleClearSignature();
                  }}
                />
                <CustomButton
                  disabled={disableSignBtnFlag}
                  key={2}
                  flex={1}
                  label="Confirm"
                  fontSize={14}
                  paddingVertical={10}
                  marginLeft={4}
                  marginRight={4}
                  onPress={() => {
                    handleSubmitSignature();
                  }}
                />
              </Modal.Footer>
            </Modal.Content>
          </Modal>
        </>
      )}
    </SafeAreaView>
  );
}
