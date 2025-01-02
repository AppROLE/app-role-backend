export interface IFileRepository {
  uploadEventPhoto(
    imageNameKey: string,
    eventPhoto: Buffer,
    mimetype: string
  ): Promise<void>;
  uploadInstitutePhoto(
    imageNameKey: string,
    eventPhoto: Buffer,
    mimetype: string
  ): Promise<void>
  uploadEventGalleryPhoto(
    imageNameKey: string,
    eventPhoto: Buffer,
    mimetype: string
  ): Promise<void>;
  uploadEventBanner(
    imageNameKey: string,
    eventPhoto: Buffer,
    mimetype: string
  ): Promise<void>;
  deleteEventPhotoByEventId(eventId: string): Promise<void>;
  deleteGallery(eventId: string): Promise<void>;
  deleteInstitutePhoto(name: string): Promise<void>;
  deleteEventBanner(eventId: string, eventName: string): Promise<void>;
}
