import { getContractDetail } from "api/contract";
import moment from "moment";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PreviewContract from "../preview-contract";

export default function ViewDetailContract() {
  const [currentViewDetailDataContract, setCurrentViewDetailDataContract] = useState<any>();

  const params = useParams<{ contractId: string }>();

  const dateFormat = "MMM DD, YYYY";

  useEffect(() => {
    if (params.contractId) {
      getContractDetail(params.contractId).then((res) => {
        setCurrentViewDetailDataContract({
          ...res,
          contractCreateDate: moment(res.contractCreateDate).format(dateFormat),
          endDate: moment(res.endDate).format(dateFormat),
          startDate: moment(res.startDate).format(dateFormat),
          tenantBirthday: moment(res.tenantBirthday).format(dateFormat),
          tenantIcIssueDate: moment(res.tenantIcIssueDate).format(dateFormat),
        });
      });
    }
  }, []);

  useEffect(() => {
    if(currentViewDetailDataContract){
      
    }
    
  },[currentViewDetailDataContract])

  return (
    <>
      <PreviewContract
      currentViewDetailDataContract={currentViewDetailDataContract}
      ></PreviewContract>
    </>
  );
}
