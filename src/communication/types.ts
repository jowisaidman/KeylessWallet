export enum CommandDestiny {
    Background,
    Popup,
};

export type Command = {
    id: string;
    destiny: CommandDestiny;
    data: { type: string } & object;
};

export type CommandResult = {
    result: boolean;
    data: any;
};
