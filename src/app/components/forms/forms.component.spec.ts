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

  it('should initialize with one form group', () => {
    expect(component.formsArray.length).toBe(1);
  });

  it('should add a new form group when addNewForm is called', () => {
    component.addNewForm();
    expect(component.formsArray.length).toBe(2);
  });

  it('should not add more than 10 form groups', () => {
    for (let i = 0; i < 10; i++) {
      component.addNewForm();
    }
    expect(component.formsArray.length).toBe(10);
    component.addNewForm();
    expect(component.formsArray.length).toBe(10);
  });

  it('should disable form and start timer on sendForm', fakeAsync(() => {
    spyOn(apiService, 'submitForm').and.returnValue(of({ result: 'nice job' }));
    component.sendForm();
    expect(component.showTimer).toBeTrue();
    expect(component.formsArray.disabled).toBeTrue();
    tick(2000);
    expect(apiService.submitForm).toHaveBeenCalled();
  }));

  it('should clear timer and reset form on successful submission', fakeAsync(() => {
    spyOn(apiService, 'submitForm').and.returnValue(of({ result: 'nice job' }));
    component.sendForm();
    expect(component.formsArray.disabled).toBeTrue();
    tick(2000);
    expect(component.formsArray.enabled).toBeTrue();
    expect(component.showTimer).toBeFalse();
  }));

  it('should cancel the form submission and clear timer', fakeAsync(() => {
    component.sendForm();
    component.cancelSendingForm();
    expect(component.showTimer).toBeFalse();
    expect(component.formsArray.enabled).toBeTrue();
  }));
});
