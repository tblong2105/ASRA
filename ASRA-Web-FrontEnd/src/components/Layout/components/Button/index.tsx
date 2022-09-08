import classNames from "classnames/bind";
import styles from "./Button.module.scss";

const cx = classNames.bind(styles);

function Button({
  onClick,
  primary = false,
  danger = false,
  cancel = false,
  submit = false,
  reject = false,
  disabled = false,
  small = false,
  large = false,
  children,
  className,
  type,
  id,
  ...passProps
}: any) {
  const props = {
    onClick,
    disabled,
    type,
    id,
    ...passProps,
  };

  // Remove event listener when btn is disabled
  if (disabled) {
    Object.keys(props).forEach((key) => {
      if (key.startsWith("on") && typeof props[key] === "function") {
        delete props[key];
      }
    });
  }

  const classes = cx({
    [className]: className,
    primary,
    danger,
    cancel,
    submit,
    reject,
    disabled,
    small,
    large,
  });

  return (
    <button className={classes} {...props}>
      <span className={cx("title")}>{children}</span>
    </button>
  );
}

export default Button;
