import { Directive, Input, AfterViewInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Country } from '../enum/country';

@Directive({
  selector: '[appValidateCountry]',
  standalone: true,
})
export class ValidateCountryDirective implements AfterViewInit {
  @Input() appValidateCountry!: AbstractControl;

  ngAfterViewInit(): void {
    if (this.appValidateCountry) {
      const oldValidator = this.appValidateCountry.validator;
      if (oldValidator) {
        this.appValidateCountry.setValidators([
          this.countryValidator,
          oldValidator,
        ]);

        return;
      }
      this.appValidateCountry.setValidators([this.countryValidator]);
    }
  }

  countryValidator(control: AbstractControl) {
    const value = control.value;

    if (!value) {
      return null;
    }
    return Object.values(Country).includes(value) ? null : { country: true };
  }
}
