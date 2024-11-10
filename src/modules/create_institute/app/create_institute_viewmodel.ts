export class CreateInstituteViewModel {
    message: string;
    id: string;
  
    constructor(message: string, id: string) {
      this.message = message;
      this.id = id;
    }
  
    toJSON() {
      return {
        message: this.message,
        id: this.id,
      };
    }
  }
  