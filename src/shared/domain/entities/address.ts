export interface AddressProps {
  latitude: number;
  longitude: number;
  street: string;
  number?: number;
  district: string;
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
  district: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;

  constructor(props: AddressProps) {
    // Validações
    if (
      typeof props.latitude !== 'number' ||
      props.latitude < -90 ||
      props.latitude > 90
    ) {
      throw new Error('Latitude inválida. Deve ser um número entre -90 e 90.');
    }

    if (
      typeof props.longitude !== 'number' ||
      props.longitude < -180 ||
      props.longitude > 180
    ) {
      throw new Error(
        'Longitude inválida. Deve ser um número entre -180 e 180.'
      );
    }

    if (!props.street || props.street.trim().length < 3) {
      throw new Error('Rua inválida. Deve conter pelo menos 3 caracteres.');
    }

    if (
      props.number !== undefined &&
      (typeof props.number !== 'number' || props.number < 0)
    ) {
      throw new Error('Número inválido. Deve ser um número positivo.');
    }

    if (!props.district || props.district.trim().length < 2) {
      throw new Error('Bairro inválido. Deve conter pelo menos 2 caracteres.');
    }

    if (!props.neighborhood || props.neighborhood.trim().length < 2) {
      throw new Error(
        'Vizinhança inválida. Deve conter pelo menos 2 caracteres.'
      );
    }

    if (!props.city || props.city.trim().length < 2) {
      throw new Error('Cidade inválida. Deve conter pelo menos 2 caracteres.');
    }

    if (!props.state) {
      throw new Error('Estado inválido');
    }

    if (!props.cep || !/^\d{5}-?\d{3}$/.test(props.cep)) {
      throw new Error('CEP inválido. Deve estar no formato 00000-000.');
    }

    // Atribuições
    this.latitude = props.latitude;
    this.longitude = props.longitude;
    this.street = props.street;
    this.number = props.number;
    this.district = props.district;
    this.neighborhood = props.neighborhood;
    this.city = props.city;
    this.state = props.state.toUpperCase(); // Normaliza o estado em letras maiúsculas
    this.cep = props.cep.replace('-', ''); // Remove o traço do CEP para padronização
  }
}
