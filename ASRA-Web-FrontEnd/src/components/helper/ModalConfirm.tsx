import { useEffect, useState } from "react";
import { Modal } from "antd";

const ModalConfirm = (props: any) => {
  const { children, footer, width, title, type, className, zIndex, marginTop } =
    props;
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (props.isModalVisible) {
      showModal();
    } else {
      handleCancel();
    }
  }, [props.isModalVisible]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    props.onConfirmClick();
    props.close();
  };

  const handleCancel = () => {
    props.close();
    setIsModalVisible(false);
  };

  return (
    <>
      <Modal
        title={title}
        visible={isModalVisible}
        maskClosable={false}
        zIndex={zIndex ? zIndex : 1}
        okText="OK"
        className={`modal-confirm ${
          type === "delete" ? "isDelete" : ""
        } ${className}`}
        width={width}
        footer={footer}
        onOk={handleOk}
        onCancel={handleCancel}
        style={{ marginTop: marginTop ? marginTop : "140px" }}
      >
        {children}
      </Modal>
    </>
  );
};

export default ModalConfirm;
