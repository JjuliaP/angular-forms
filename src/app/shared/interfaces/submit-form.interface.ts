import { Country } from '../enum/country';

export interface SubmitForm {
  country: Country;
  username: string;
  birthday: Date;
}
