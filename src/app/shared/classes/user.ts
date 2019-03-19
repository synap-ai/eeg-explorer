export class User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;

    constructor(data: Partial<User>) {
        Object.assign(this, data);
    }
}
