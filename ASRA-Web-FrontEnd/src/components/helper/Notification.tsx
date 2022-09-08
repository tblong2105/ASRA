import { notification } from 'antd';
import { SUCCESS, ERROR} from 'commons/constants/Notification'

export function openNotification(status: string, message: string) {

  if (status === SUCCESS) {
    
    notification.success({
      message: message,
    });

  } else if (status === ERROR) {

    notification.error({
      message: message,
    });
  }
};