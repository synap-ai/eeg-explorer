import { Observable } from 'rxjs';
import { EEGSample } from 'muse-js';
import { sample } from 'rxjs/operators';

export interface Classifier {
    name: string;
    categories: string[];
    result: Observable<number>;
    start: (stream: Observable<EEGSample>) => void;
}
