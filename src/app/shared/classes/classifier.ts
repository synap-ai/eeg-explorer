import { Observable } from 'rxjs';
import { EEGSample } from 'muse-js';
import { sample } from 'rxjs/operators';

export interface Classifier {
    name: string;
    id: number;
}
