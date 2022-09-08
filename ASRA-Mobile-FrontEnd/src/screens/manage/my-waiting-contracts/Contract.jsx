import { View, Text, ImageBackground, SafeAreaView } from "react-native";
import { currencyViCode } from "../../../utils/currency-util";
import { formatDate } from "../../../utils/date-util";
import { sliceStringLength } from "../../../utils/string-util";

export default function Contract(props) {
    const contract = props.contract
    return (
      <View
        style={{
          flexDirection: "row",
          padding: 8,
          borderColor: "#c6c6c6",
          borderWidth: 1,
          height: "auto",
          borderRadius: 4,
          display: "flex",
        }}
      >
        <ImageBackground
          style={{
            width: 80,
            height: 80,
            marginLeft: -5,
          }}
          source={{
            uri: "https://firebasestorage.googleapis.com/v0/b/asra-develop.appspot.com/o/haha%2Fcontract.png?alt=media&token=acf8e5ee-d082-4d79-9832-d95449e7173c",
          }}
        />
        <View
          style={{
            marginLeft: 6,
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 12,
              marginBottom: 4,
            }}
            numberOfLine={1}
          >
            {sliceStringLength(contract.title, 32)}
          </Text>
          <Text
            style={{
              marginTop: 2,
              fontSize: 11,
            }}
          >
            <Text
              style={{
                color: "#00BFB9",
                fontWeight: "bold",
              }}
            >
              {"Innkeeper: "}
            </Text>{" "}
            {sliceStringLength(
              contract.innkeeperName + " - " + contract.innkeeperPhone,
              31
            )}
          </Text>
          <Text
            style={{
              marginTop: 2,
              fontSize: 11,
            }}
          >
            <Text
              style={{
                color: "#00BFB9",
                fontWeight: "bold",
              }}
            >
              {"Room No: "}
            </Text>
            {contract.roomNo}
          </Text>
          <Text
            style={{
              marginTop: 2,
              fontSize: 11,
            }}
          >
            <Text
              style={{
                color: "#00BFB9",
                fontWeight: "bold",
              }}
            >
              {"Rental Price: "}
            </Text>
            {currencyViCode(contract.rentalPrice)}
          </Text>
          <Text
            style={{
              marginTop: 2,
              fontSize: 11,
            }}
          >
            <Text
              style={{
                color: "#00BFB9",
                fontWeight: "bold",
              }}
            >
              {"Create Date: "}
            </Text>
            {formatDate(contract.contractCreateDate)}
          </Text>
        </View>
      </View>
    );
}