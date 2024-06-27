import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { FormsComponent } from './forms.component';
import { ApiService } from '../../shared/api/api.service';
import { Country } from '../../shared/enum/country';

const MAX_TIMER_COUNTDOWN = 15;
class MockApiService {
  submitForm() {
    return of({});
  }

  getRegion() {
    return of({ region: 'MockRegion' });
  }

  checkUser() {
    return of({ isAvailable: true });
  }
}

describe('FormsComponent', () => {
  let component: FormsComponent;
  let fixture: ComponentFixture<FormsComponent>;
  let apiService: ApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsComponent],
      declarations: [],
      providers: [
        FormBuilder,
        { provide: ApiService, useClass: MockApiService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormsComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form array with one form group', () => {
    expect(component.formsArray.length).toBe(1);
  });

  it('should add a new form when addNewForm is called', () => {
    component.addNewForm();
    expect(component.formsArray.length).toBe(2);
  });

  it('should not add more than 10 forms', () => {
    for (let i = 0; i < 10; i++) {
      component.addNewForm();
    }
    expect(component.formsArray.length).toBe(10);
    component.addNewForm();
    expect(component.formsArray.length).toBe(10);
  });

  it('should send form if valid', fakeAsync(() => {
    const regionResponse = { region: 'Europe' };
    spyOn(apiService, 'getRegion').and.returnValue(of(regionResponse));
    spyOn(apiService, 'submitForm').and.returnValue(of({ result: 'nice job' }));

    component.formsArray.controls.forEach(control => {
      control.get('country')?.setValue(Country.Ukraine);
      control.get('username')?.setValue('new');
      control.get('birthday')?.setValue('2024-06-21');
    });

    component.sendForm();
    tick(MAX_TIMER_COUNTDOWN * 1000);

    expect(apiService.submitForm).toHaveBeenCalled();
  }));

  it('should not send form if invalid', () => {
    spyOn(apiService, 'submitForm').and.returnValue(of({ result: 'nice job' }));
    component.sendForm();
    expect(apiService.submitForm).not.toHaveBeenCalled();
  });

  it('should cancel sending form', () => {
    spyOn(window, 'clearTimeout');
    component.sendForm();
    component.cancelSendingForm();
    expect(window.clearTimeout).toHaveBeenCalled();
    expect(component.showTimer).toBeFalse();
  });

  it('should transform country to correct region', fakeAsync(() => {
    const regionResponse = { region: 'Europe' };
    spyOn(apiService, 'getRegion').and.returnValue(of(regionResponse));
    spyOn(apiService, 'submitForm').and.returnValue(of({ result: 'nice job' }));

    component.formsArray.controls.forEach(control => {
      control.get('country')?.setValue(Country.Ukraine);
      control.get('username')?.setValue('new');
      control.get('birthday')?.setValue('2024-06-21');
    });

    component.sendForm();
    tick(MAX_TIMER_COUNTDOWN * 1000);

    expect(apiService.getRegion).toHaveBeenCalledWith(Country.Ukraine);
    expect(apiService.submitForm).toHaveBeenCalledWith([
      {
        region: 'Europe',
        username: 'new',
        birthday: '2024-06-21',
      },
    ]);
    expect(component.showTimer).toBeFalse();
    expect(component.counter).toBe(MAX_TIMER_COUNTDOWN);
  }));
});
