import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { Country } from '../enum/country';
import { SubmitBody } from '../interfaces/submit-body.interface';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getRegion', () => {
    it('should return an Observable<{ region: string }>', () => {
      const dummyResponse = { region: 'America' };
      const country = Country.Mexico;

      service.getRegion(country).subscribe(response => {
        expect(response).toEqual(dummyResponse);
      });

      const req = httpMock.expectOne('/api/regions');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ country });
      req.flush(dummyResponse);
    });
  });

  describe('#checkUser', () => {
    it('should return an Observable<{ isAvailable: boolean }>', () => {
      const dummyResponse = { isAvailable: true };
      const username = 'testuser';

      service.checkUser(username).subscribe(response => {
        expect(response).toEqual(dummyResponse);
      });

      const req = httpMock.expectOne('/api/checkUsername');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ username });
      req.flush(dummyResponse);
    });
  });

  describe('#submitForm', () => {
    it('should return an Observable<{ result: string }>', () => {
      const dummyResponse = { result: 'nice job' };
      const body: SubmitBody[] = [
        {
          region: 'America',
          username: 'testuser',
          birthday: new Date(),
        },
      ];

      service.submitForm(body).subscribe(response => {
        expect(response).toEqual(dummyResponse);
      });

      const req = httpMock.expectOne('/api/submitForm');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ body });
      req.flush(dummyResponse);
    });
  });
});
