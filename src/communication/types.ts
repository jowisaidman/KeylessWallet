export class Command {
    id: string;

    type: string

    data: any;

    constructor(type: string, data?: object) {
        this.id = `command_${Math.floor(Math.random() * 1000000)}`;
        this.type = type;
        this.data = data;
    }

}

export type CommandResult = {
    id: string;
    data: any;
};
