import { useEffect, useState, memo } from "react";
import { Steps } from "antd";
import {
  InfoCircleOutlined,
  EnvironmentOutlined,
  PictureOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";
import styles from "./index.module.scss";

function Process(props: any) {
  const { Step } = Steps;
  const [current, setCurrent] = useState<number>(0);

  useEffect(() => {
    if (props.valid) {
      setCurrent(props.tab);
    }
  }, [props.valid, props.tab]);

  const handleSetCurrent = (tab: number) => {
    if (tab - current <= 1) {
      // If the next tab is larger than the current tab, then validate and set the tab
      if (tab <= current) {
        props.current(tab, true);
      } else {
        props.checkValid();
        props.current(tab);
        if (props.valid) {
          // setCurrent(tab);
        }
      }
    }
  };

  return (
    <>
      <Steps
        labelPlacement="vertical"
        className={`process-line ${styles.process}`}
        current={current}
      >
        <Step
          title="Information"
          icon={<InfoCircleOutlined />}
          onClick={() => handleSetCurrent(0)}
        />
        <Step
          title="Address"
          icon={<EnvironmentOutlined />}
          onClick={() => handleSetCurrent(1)}
        />
        <Step
          title="Utilities"
          icon={<PictureOutlined />}
          onClick={() => handleSetCurrent(2)}
        />
        <Step
          title="Confirmation"
          icon={<FileDoneOutlined />}
          onClick={() => handleSetCurrent(3)}
        />
      </Steps>
    </>
  );
}
export default memo(Process);
