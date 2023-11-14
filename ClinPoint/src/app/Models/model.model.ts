export interface Model {
}

export interface Account {
  addressId: string;
  id: string;
  username: string;
  password: string;
  role: string;
}

export interface Patient {
  addressId: string;
  id: string;
  firstname: string;
  lastname: string;
  birthdate: string;
  email: string;
  contactno: string;
  address: string;
  createdat: string;
  status: string;
  gender: string;
  image: string;
}

export interface Physician {
  addressId: string;
  id: string;
  firstname: string;
  lastname: string;
  birthdate: string;
  email: string;
  contactno: string;
  address: string;
  createdat: string;
  status: string;
  gender: string;
  specialty: string;
  image: string;
  license: string;
  dayoff: string;
  aisupportdescription: string;
}

export interface Clinic {
  addressId: string;
  id: string;
  clinicName: string;
  clinicOwner: string;
  description: string;
  file1:string;
  file2:string;
  logo:string;
  contactno:string;
  dayoff:string;
  createdat: string;
  email: string;
  address: string;
  status: string;
  aisupportdescription: string;
}

export interface Admin {
  id: string;
  name: string;
}
