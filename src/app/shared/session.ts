export class Session {
    id: number;
    subject_id: number;
    experiment_id: number;
    createdAt: Date;
    video_id: number;
    eeg_data: EEG[];

    constructor(data: Partial<Session>) {
        Object.assign(this, data);
    }
}

export class EEG {
    timestamp: number;
    tp9: number;
    af7: number;
    af8: number;
    tp10: number;
}
