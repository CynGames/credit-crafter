import { GenerateUniqueId } from '../core/utility-functions';

describe('GenerateUniqueId utility function', () => {
  it('should begin with a fixed string', () => {
    const output = GenerateUniqueId();
    expect(output).toContain('unique-id-');
  });
  
  it('should be different every time', () => {
    const first = GenerateUniqueId();
    const second = GenerateUniqueId();
    expect(first).not.toBe(second);
  });
});
