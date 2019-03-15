import { MediaDescription } from './media-description';

export class Experiment {
    id: number;
    title: string;
    description: string;
    videos: MediaDescription[] = [];
}
