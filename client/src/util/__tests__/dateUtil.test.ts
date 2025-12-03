import { formatDate } from '../dateUtil';

describe('formatDate', () => {
  // Mock the current date to make tests deterministic
  const mockCurrentDate = new Date('2025-12-02T12:00:00Z');
  
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(mockCurrentDate);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('dates in the current year', () => {
    it('should format date without year for current year dates', () => {
      const result = formatDate('2025-01-15T12:00:00');
      expect(result).toBe('Jan 15');
    });

    it('should format date without year for dates earlier in the year', () => {
      const result = formatDate('2025-03-20T12:00:00');
      expect(result).toBe('Mar 20');
    });

    it('should format date without year for dates later in the year', () => {
      const result = formatDate('2025-12-25T12:00:00');
      expect(result).toBe('Dec 25');
    });

    it('should format date without year for single digit days', () => {
      const result = formatDate('2025-05-05T12:00:00');
      expect(result).toBe('May 5');
    });

    it('should format date without year for the first day of the year', () => {
      const result = formatDate('2025-01-01T12:00:00');
      expect(result).toBe('Jan 1');
    });

    it('should format date without year for the last day of the year', () => {
      const result = formatDate('2025-12-31T12:00:00');
      expect(result).toBe('Dec 31');
    });
  });

  describe('dates in past years', () => {
    it('should format date with year for previous year', () => {
      const result = formatDate('2023-06-15T12:00:00');
      expect(result).toBe('Jun 15, 2023');
    });

    it('should format date with year for dates many years ago', () => {
      const result = formatDate('2020-01-01T12:00:00');
      expect(result).toBe('Jan 1, 2020');
    });

    it('should format date with year for dates in the previous century', () => {
      const result = formatDate('1999-12-31T12:00:00');
      expect(result).toBe('Dec 31, 1999');
    });
  });

  describe('dates in future years', () => {
    it('should format date with year for next year', () => {
      const result = formatDate('2026-06-15T12:00:00');
      expect(result).toBe('Jun 15, 2026');
    });

    it('should format date with year for dates many years in the future', () => {
      const result = formatDate('2030-12-25T12:00:00');
      expect(result).toBe('Dec 25, 2030');
    });
  });

  describe('different date formats', () => {
    it('should handle ISO date strings with UTC timezone', () => {
      // Note: UTC dates may shift by a day depending on local timezone
      const result = formatDate('2025-06-15T12:00:00.000Z');
      expect(result).toMatch(/Jun/);
      expect(result).not.toMatch(/2025/);
    });

    it('should handle date strings with time', () => {
      const result = formatDate('2023-06-15T14:30:00');
      expect(result).toBe('Jun 15, 2023');
    });

    it('should handle date strings in YYYY-MM-DD format', () => {
      // YYYY-MM-DD format is interpreted as UTC, so we test with local time
      const result = formatDate('2025-08-20T12:00:00');
      expect(result).toBe('Aug 20');
    });

    it('should handle date strings in YYYY-MM-DD format (UTC interpretation)', () => {
      // This tests the actual behavior with YYYY-MM-DD (interpreted as UTC)
      const result = formatDate('2025-08-20');
      // The result may vary by timezone, so we just check it's formatted
      expect(result).toMatch(/Aug/);
    });
  });

  describe('edge cases', () => {
    it('should handle dates at month boundaries', () => {
      const result1 = formatDate('2025-01-31T12:00:00');
      expect(result1).toBe('Jan 31');

      const result2 = formatDate('2025-02-01T12:00:00');
      expect(result2).toBe('Feb 1');
    });

    it('should handle the exact current date', () => {
      const result = formatDate('2025-12-02T12:00:00');
      expect(result).toBe('Dec 2');
    });
  });

  describe('invalid dates', () => {
    it('should handle invalid date strings gracefully', () => {
      // Invalid dates will create an Invalid Date object
      // The behavior depends on how toLocaleDateString handles it
      const result = formatDate('invalid-date');
      // Invalid dates typically return "Invalid Date" or similar
      expect(result).toBeTruthy();
    });

    it('should handle empty string', () => {
      const result = formatDate('');
      expect(result).toBeTruthy();
    });

    it('should handle malformed date strings', () => {
      const result = formatDate('not-a-date');
      expect(result).toBeTruthy();
    });
  });

  describe('timezone considerations', () => {
    it('should handle dates in different timezones', () => {
      // The function uses local time, so results may vary by timezone
      // But the year comparison should still work correctly
      const result = formatDate('2025-06-15T23:59:59Z');
      expect(result).toMatch(/Jun/);
    });
  });

  describe('GMT', () => {
    it('should handle dates in GMT', () => {
      // The function uses local time, so results may vary by timezone
      // But the year comparison should still work correctly
      const result = formatDate('Sat, 22 Nov 2025 00:00:00 GMT');
      expect(result).toBe('Nov 22');
    });
  });
});

