import { CommonModule, DatePipe } from '@angular/common';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Country } from '../../shared/enum/country';
import { ValidateCountryDirective } from '../../shared/directives/validate-country.directive';
import { ValidateUsernameDirective } from '../../shared/directives/validate-username.directive';
import { ValidateBirthdayDirective } from '../../shared/directives/validate-birthday.directive';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    DatePipe,
    ReactiveFormsModule,
    CommonModule,
    ValidateCountryDirective,
    ValidateUsernameDirective,
    ValidateBirthdayDirective,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export class FormComponent implements OnInit {
  @Input() public userForm!: FormGroup;

  public date: string = '';
  public suggestions: Country[] = [];
  public countries: Country[] = Object.values(Country).sort();

  get usernameControl(): FormControl {
    return this.userForm?.get('username') as FormControl;
  }

  get countryControl(): FormControl {
    return this.userForm?.get('country') as FormControl;
  }

  get birthdayControl(): FormControl {
    return this.userForm?.get('birthday') as FormControl;
  }

  public ngOnInit(): void {
    this.date = new Date().toISOString().slice(0, 10);
  }

  public suggest(): void {
    if (this.countryControl.value === '') {
      this.suggestions = this.countries;
    } else {
      this.suggestions = this.countries.filter(c =>
        c
          .toLowerCase()
          .startsWith(this.countryControl.value?.toLowerCase() || '')
      );
    }
  }

  public setCountry(selectedCountry: Country): void {
    this.userForm.controls['country'].setValue(selectedCountry);
    this.suggestions = [];
  }

  @HostListener('document:click', ['$event'])
  public onGlobalClick(event: Event): void {
    const element = <HTMLDivElement | HTMLInputElement>event.target;
    if (element?.id !== 'country' && element?.className !== 'dropdown-item') {
      this.suggestions = [];
    }
  }
}
