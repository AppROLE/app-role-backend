export class UploadEventBannerViewmodel {
    message: string;
  
    constructor(message: string) {
      this.message = message;
    }
  
    toJSON() {
      return {
        message: this.message,
      };
    }
  }