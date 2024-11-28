export class GetPhraseNoneUserViewModel {
    constructor(
        private readonly phrase: string,
        private readonly name?: string
    ) {}
    
    toJSON() {
        return {
            phrase: `${this.phrase}`,
            username: this.name || ''
        };
    }
}