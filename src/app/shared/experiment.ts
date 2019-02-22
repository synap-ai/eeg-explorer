import { MediaDescription } from './media-description';

export class Experiment {
    id: string;
    title: string;
    epoch: number;
    epochInterval: number;
    useBandPowers: boolean;
    useCovariance: boolean;
    videos: MediaDescription[] = [];
}
