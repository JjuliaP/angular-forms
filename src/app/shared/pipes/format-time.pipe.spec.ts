import { TestBed } from '@angular/core/testing';
import { FormatTimePipe } from './format-time.pipe';

describe('FormatTimePipe', () => {
  let pipe: FormatTimePipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormatTimePipe],
    });

    pipe = new FormatTimePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform seconds into mm:ss format', () => {
    expect(pipe.transform(0)).toBe('00:00');
    expect(pipe.transform(59)).toBe('00:59');
    expect(pipe.transform(60)).toBe('01:00');
    expect(pipe.transform(75)).toBe('01:15');
    expect(pipe.transform(3600)).toBe('60:00');
    expect(pipe.transform(3661)).toBe('61:01');
  });

  it('should handle edge cases', () => {
    expect(pipe.transform(-1)).toBe('00:00');
    expect(pipe.transform(123456)).toBe('57:36');
  });
});
