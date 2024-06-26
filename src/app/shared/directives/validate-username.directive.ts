import { Directive, Input, AfterViewInit } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, map, of } from 'rxjs';
import { ApiService } from '../api/api.service';

@Directive({
  selector: '[appValidateUsername]',
  standalone: true,
})
export class ValidateUsernameDirective implements AfterViewInit {
  @Input() appValidateUsername!: AbstractControl;

  constructor(private apiService: ApiService) {}

  ngAfterViewInit(): void {
    if (this.appValidateUsername) {
      const oldValidator = this.appValidateUsername.validator;
      if (oldValidator) {
        this.appValidateUsername.setValidators([oldValidator]);

        this.appValidateUsername.setAsyncValidators([
          () => this.usernameValidator(this.appValidateUsername),
        ]);
        return;
      }
      this.appValidateUsername.setAsyncValidators([
        () => this.usernameValidator(this.appValidateUsername),
      ]);
    }
  }

  usernameValidator(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    const value = control.value;

    if (!value && !control.dirty && !control.touched) {
      return of(null);
    }

    return this.apiService
      .checkUser(control.value)
      .pipe(
        map((result: { isAvailable: boolean }) =>
          !result.isAvailable ? { usernameAlreadyExists: true } : null
        )
      );
  }
}
