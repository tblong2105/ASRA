export interface RoomType {
    name: string;
    value: string;
  }

export interface RoomCard {
  address: string
  electricityCost: number
  id: number
  rentalPrice: number
  roomArea: number
  roomType: string
  thubnailImage: string
  title: string
  waterCost: number
} 

export interface SearchTrendCard {
  image: string,
  address: string
} 

export interface Room {
  room: {
    roomType: string;
    roomsName: string[];
    capacity: number;
    gender: string;
    roomArea: number;
    rentalPrice: number;
    deposit: number;
    electricityCost: number;
    waterCost: number;
    internetCost: number;
    city: string;
    district: string;
    ward: string;
    streetName: string;
    imageList: string[];
    thumbnailImage: any;
    utilities: string[];
    title: string;
    description: string;
  };
}

export interface Tenant {
  key: string;
  tenantName: string;
  phoneNumber: string;
  amountDeposit: string;
  rentExpenseMonth: string;
  contractStartDate: string;
  contractEndDate: string;
  rentStatus: boolean;
}

export interface EditableCellPropsTenant extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text";
  record: Tenant;
  index: number;
  children: React.ReactNode;
}


export interface Deposit {
  key: string;
  username: string;
  phoneNumber: string;
  amountDeposit: string;
  date: string;
  status: boolean;
}

export interface RoomDetailName {
  id: number;
  roomNo: string;
}

