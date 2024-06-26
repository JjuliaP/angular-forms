import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { FormComponent } from './form.component';
import { Country } from '../../shared/enum/country';
import { ValidateCountryDirective } from '../../shared/directives/validate-country.directive';
import { ValidateUsernameDirective } from '../../shared/directives/validate-username.directive';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        ValidateCountryDirective,
        ValidateUsernameDirective,
        FormComponent,
        HttpClientModule,
      ],
      declarations: [],
      providers: [DatePipe],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    component.userForm = new FormGroup({
      country: new FormControl(''),
      username: new FormControl(''),
      birthday: new FormControl(''),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the date on ngOnInit', () => {
    component.ngOnInit();
    const currentDate = new Date().toISOString().slice(0, 10);
    expect(component.date).toBe(currentDate);
  });

  it('should have form controls initialized', () => {
    expect(component.countryControl).toBeTruthy();
    expect(component.usernameControl).toBeTruthy();
    expect(component.birthdayControl).toBeTruthy();
  });

  it('should filter suggestions correctly', () => {
    component.userForm.controls['country'].setValue('A');
    component.suggest();
    expect(component.suggestions).toContain(Country.Australia);
    expect(component.suggestions).not.toContain(Country.Mexico);
  });

  it('should set country and clear suggestions', () => {
    component.setCountry(Country.Mexico);
    expect(component.userForm.controls['country'].value).toBe(Country.Mexico);
    expect(component.suggestions.length).toBe(0);
  });

  it('should clear suggestions on global click outside country input and suggestions dropdown', () => {
    component.suggestions = [Country.Mexico];
    const event = new MouseEvent('click', { bubbles: true });
    document.dispatchEvent(event);
    expect(component.suggestions.length).toBe(0);
  });

  it('should not clear suggestions on global click inside country input', () => {
    component.suggestions = [Country.Mexico];
    const inputElement = fixture.nativeElement.querySelector('#country');
    inputElement.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(component.suggestions.length).toBe(1);
  });
});
