import { Row } from "antd";

import RoomInformation from "./room-detail/RoomInformation";
import UtilityInformation from "./room-detail/UtilityInformation";
import InnkeeperInformation from "./room-detail/InnkeeperInformation";
import ContractInformation from "./room-detail/ContractInformation";
import DescriptionInformation from "./room-detail/DescriptionInformation";
import { ROOM_PATH } from "commons/constants";

function RoomDetail({
  rentalPrice,
  roomArea,
  deposit,
  capacity,
  electricityCost,
  waterCost,
  internetCost,
  address,
  totalRoomEmpty,
  totalRoom,
  bed,
  time,
  wmc,
  ac,
  television,
  refrigerator,
  wifi,
  parking,
  toilet,
  kitchen,
  innkeeperFullName,
  innkeeperImage,
  innkeeperPhoneNumber,
  description,
  roleInnkeeper,
  roomNo,
  roomRented,
  pathName,
  contract,
  createDateSubmitted,
  userInfor,
  cx,
}: any) {
  return (
    <>
      <Row
        className={cx("room-detail-info")}
        style={
          !pathName.includes(ROOM_PATH.FROM_MY_ROOMS_FOR_RENT)
            ? { margin: "32px 0" }
            : {}
        }
      >
        {/* ROOM DETAIL INFORMATION */}
        <RoomInformation
          rentalPrice={rentalPrice}
          roomArea={roomArea}
          deposit={deposit}
          capacity={capacity}
          electricityCost={electricityCost}
          waterCost={waterCost}
          internetCost={internetCost}
          address={address}
          totalRoom={totalRoom}
          totalRoomEmpty={totalRoomEmpty}
          roomNo={roomNo}
          pathName={pathName}
          roomRented={roomRented}
          cx={cx}
        />
        {/* INNKEEPER INFORMATION */}
        {!pathName.includes(ROOM_PATH.FROM_MY_ROOMS_FOR_RENT) && (
          <InnkeeperInformation
            innkeeperFullName={innkeeperFullName}
            innkeeperImage={innkeeperImage}
            innkeeperPhoneNumber={innkeeperPhoneNumber}
            createDateSubmitted={createDateSubmitted}
            userInfor={userInfor}
            cx={cx}
          />
        )}
        {/* UTILITIES INFORMATION*/}
        <UtilityInformation
          ac={ac}
          bed={bed}
          kitchen={kitchen}
          parking={parking}
          refrigerator={refrigerator}
          time={time}
          toilet={toilet}
          wifi={wifi}
          wmc={wmc}
          television={television}
          pathName={pathName}
          cx={cx}
        />

        {/* CONTRACT INFORMATION */}
        {pathName.includes(ROOM_PATH.FROM_MY_ROOMS) && roomRented && (
          <ContractInformation
            pathName={pathName}
            cx={cx}
            contract={contract}
          />
        )}

        {/* DETAIL DESCRIPTION INFORMATION*/}
        <DescriptionInformation
          description={description}
          pathName={pathName}
          cx={cx}
        />
      </Row>
    </>
  );
}

export default RoomDetail;
