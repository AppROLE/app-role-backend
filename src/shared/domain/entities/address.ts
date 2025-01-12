export interface AddressProps {
  latitude: number;
  longitude: number;
  street: string;
  number?: number;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
}

export class Address {
  latitude: number;
  longitude: number;
  street: string;
  number?: number;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;

  constructor(props: AddressProps) {
    this.latitude = props.latitude;
    this.longitude = props.longitude;
    this.street = props.street;
    this.number = props.number;
    this.neighborhood = props.neighborhood;
    this.city = props.city;
    this.state = props.state;
    this.cep = props.cep;
  }
}
