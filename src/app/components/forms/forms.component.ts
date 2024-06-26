import { Component } from '@angular/core';
import { FormComponent } from '../form/form.component';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable, Subscription, forkJoin, map, of, switchMap, takeWhile, tap, timer } from 'rxjs';
import { ValidateCountryDirective } from '../../shared/directives/validate-country.directive';
import { ApiService } from '../../shared/api/api.service';
import { FormatTimePipe } from '../../shared/pipes/format-time.pipe';
import { SubmitForm } from '../../shared/interfaces/submit-form.interface';
import { Country } from '../../shared/enum/country';
import { SubmitBody } from '../../shared/interfaces/submit-body.interface';

const MAX_TIMER_COUNTDOWN = 2;

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [
    FormComponent,
    CommonModule,
    ReactiveFormsModule,
    ValidateCountryDirective,
    FormatTimePipe,
  ],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.scss',
})
export class FormsComponent {
  public counter = MAX_TIMER_COUNTDOWN;
  public showTimer = false;

  public userFormsGroup = new FormGroup({
    formsArray: this.fb.array<FormGroup>([
      new FormGroup({
        country: new FormControl('', {}),
        username: new FormControl('', {}),
        birthday: new FormControl('', {}),
      }),
    ]),
  });

  private submitTimer!: ReturnType<typeof setTimeout>;
  private countDown: Subscription | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {}

  get formsArray() {
    return <FormArray<FormGroup>>this.userFormsGroup.controls['formsArray'];
  }

  public formCardsCount(): number {
    return this.formsArray.controls.length;
  }

  public addNewForm(): void {
    if (this.formCardsCount() < 10) {
      const childForm = new FormGroup({
        country: new FormControl('', {
          validators: [Validators.required],
        }),
        username: new FormControl(''),
        birthday: new FormControl(''),
      });
      this.formsArray.push(childForm);
    }
  }

  public sendForm(): void {
    this.formsArray.disable();
    this.showTimer = true;

    this.submitTimer = setTimeout(() => {
      this.transformCountryToRegion().pipe(
        map(regionsArr => this.createRequestBody(regionsArr)),
        switchMap((body: SubmitBody[]) => this.apiService.submitForm(body)),
        tap(() => {
          this.formsArray.reset();
          this.clearTimer();
        })
      )
      .subscribe();
    }, MAX_TIMER_COUNTDOWN * 1000);

    this.countDown = timer(0, 1000)
      .pipe(
        map(() => --this.counter),
        takeWhile(time => time > 0)
      )
      .subscribe();
  }

  public cancelSendingForm(): void {
    clearTimeout(this.submitTimer);
    this.clearTimer();
  }

  private transformCountryToRegion(): Observable<{
    region: string;
  }[]> {
    return forkJoin(
      this.formsArray.value.map((form: SubmitForm)  =>
        this.apiService.getRegion(form.country)
      )
    );
  }

  private createRequestBody(regionArr: {region: string}[]): SubmitBody[] {
    return regionArr.map((region, index) => {
      const formValues = this.formsArray.value[index];
      return {
        region: region.region,
        username: formValues.username,
        birthday: formValues.birthday,
      }
    })
  }

  private clearTimer(): void {
    this.countDown?.unsubscribe();
    this.counter = MAX_TIMER_COUNTDOWN;
    this.formsArray.enable();
    this.showTimer = false;
  }
}
