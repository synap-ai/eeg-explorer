import * as Fili from 'fili';

export class BandpassFilter {
  readonly firCalculator = new Fili.FirCoeffs();
  private readonly filter: any;

  constructor(samplingFreq: number, lowFreq: number, highFreq: number) {
    const Coefficients = this.firCalculator.bandpass({
      order: 101,
      Fs: samplingFreq,
      F2: lowFreq,
      F1: highFreq,
    });

    this.filter = new Fili.FirFilter(Coefficients);
  }

  next(value: number) {
    return this.filter.singleStep(value);
  }
}
