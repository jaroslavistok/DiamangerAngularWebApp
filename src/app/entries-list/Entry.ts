export class Entry {
    constructor(
        public category: string,
        public date: string,
        public time: string,
        public fastInsuline: string,
        public slowInsuline: string,
        public glucoseValue: string,
        public note: string
    ){}
}