import { MediaDescription } from './media-description';

export class Experiment {
    id: number;
    title: string;
    description: string;
    epoch_samples: number;
    epoch_interval: number;
    uses_band_powers: boolean;
    uses_covariance: boolean;
    videos: MediaDescription[] = [];
}
