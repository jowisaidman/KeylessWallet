export enum CommandDestiny {
    Background,
    Popup,
};

export class Command {
    id: string;

    data: { type: string } & object;

    constructor(type: string, data?: object) {
        this.id = `command_${Math.floor(Math.random() * 1000000)}`;
        this.data = { type };
    }

}

export type CommandResult = {
    result: boolean;
    data: any;
};
