import { Directive, Input, AfterViewInit } from '@angular/core';
import { AbstractControl, Validators } from '@angular/forms';

@Directive({
  selector: '[appValidateBirthday]',
  standalone: true,
})
export class ValidateBirthdayDirective implements AfterViewInit {
  @Input() appValidateBirthday!: AbstractControl;

  ngAfterViewInit(): void {
    if (this.appValidateBirthday) {
      this.appValidateBirthday.setValidators([
        this.birthdayValidator,
        Validators.required,
      ]);
    }
  }

  birthdayValidator(control: AbstractControl) {
    const value = control.value;

    return Date.parse(value) < Date.now() ? null : { birthday: true };
  }
}
