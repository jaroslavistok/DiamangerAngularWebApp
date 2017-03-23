export class Reminder {

    constructor(
        public name: string,
        public category: string,
        public alarmTime: string,
        public id: string,
        public active: boolean,
        public status: boolean
    ){}


}