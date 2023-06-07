import { CardnumberPipe } from './cardnumber.pipe';

describe('CardnumberPipe', () => {
  it('create an instance', () => {
    const pipe = new CardnumberPipe();
    expect(pipe).toBeTruthy();
  });
});
