import { Directive, Input, AfterViewInit } from '@angular/core';
import { AbstractControl, ValidationErrors, Validators } from '@angular/forms';
import { Observable, map } from 'rxjs';
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
      this.appValidateUsername.setValidators([Validators.required]);

      this.appValidateUsername.setAsyncValidators([
        () => this.usernameValidator(this.appValidateUsername),
      ]);
    }
  }

  usernameValidator(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    const value = control.value;

    return this.apiService
      .checkUser(value)
      .pipe(
        map((result: { isAvailable: boolean }) =>
          !result.isAvailable ? { usernameAlreadyExists: true } : null
        )
      );
  }
}
