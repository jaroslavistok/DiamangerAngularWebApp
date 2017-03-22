export class Entry {
    constructor(
        public glucose: string,
        public category: string,
        public datetime: string,
        public fastInsuline: string,
        public slowInsuline: string,
        public glucoseValue: string,
        public note: string
    ){}
}