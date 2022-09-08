import { useCountdown } from 'app/useCountdown';

const CountdownTimer = ({ targetDate, cx }: any) => {
    const [days, hours, minutes, seconds] = useCountdown(targetDate);

    if (days + hours + minutes + seconds <= 0) {
        return (
            <div className={cx("expired-notice")}>
                <span>Expired!!!</span>
            </div>
        )
    } else {
        return (
            <div className={cx("show-counter")}>
                <div className={cx(days <= 3 ? 'countdown-danger' : 'countdown')}>
                    <p>{days}</p>
                    <span>{"Days"}</span>
                </div>
                <p>:</p>
                <div className={cx(false ? 'countdown-danger' : 'countdown')}>
                    <p>{hours}</p>
                    <span>{"Hours"}</span>
                </div>
                <p>:</p>
                <div className={cx(false ? 'countdown-danger' : 'countdown')}>
                    <p>{minutes}</p>
                    <span>{"Mins"}</span>
                </div>
                <p>:</p>
                <div className={cx(false ? 'countdown-danger' : 'countdown')}>
                    <p>{seconds}</p>
                    <span>{"Seconds"}</span>
                </div>
            </div>
        );
    }
};

export default CountdownTimer;
