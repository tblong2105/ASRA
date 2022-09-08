export interface AuthPayload {
  username: string;
  password: string;
  name: string;
  image: string;
  isLoggedIn: boolean;
  roles: string[];
  token: string;
}

export interface SignupPayload {
  fullname: string;
  username: string;
  email: string;
  phoneNumber: string;
  city: string;
  district: string;
  ward: string;
  streetName: string;
  password: string;
}

export type LocationProps = {
  state: {
    from: Location;
  };
};

export interface Profile {
  fullName: string;
  email: string;
  age: number;
  gender: string;
  profession: string;
  phoneNumber: string;
  city: string;
  district: string;
  ward: string;
  streetName: string;
  image: string;
}

export interface InnkeeperInformation {
  accountId: number;
  icName: string;
  icId: string;
  icAddress: string;
  icBirthdate: string;
  frontImage: string;
  backImage: string;
  icIssueDate: string;
  icIssueLoc: string;
  phoneNumber: string;
}
