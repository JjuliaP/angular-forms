import { Directive, Input, AfterViewInit } from '@angular/core';
import { AbstractControl, Validators } from '@angular/forms';
import { Country } from '../enum/country';

@Directive({
  selector: '[appValidateCountry]',
  standalone: true,
})
export class ValidateCountryDirective implements AfterViewInit {
  @Input() appValidateCountry!: AbstractControl;

  ngAfterViewInit(): void {
    if (this.appValidateCountry) {
      this.appValidateCountry.setValidators([
        this.countryValidator,
        Validators.required,
      ]);
    }
  }

  countryValidator(control: AbstractControl) {
    const value = control.value;

    return Object.values(Country).includes(value) ? null : { country: true };
  }
}
