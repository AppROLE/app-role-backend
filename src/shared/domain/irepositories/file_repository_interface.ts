export interface IFileRepository {
  uploadEventPhoto(
    eventId: string,
    eventName: string,
    imageNameKey: string,
    eventPhoto: Buffer,
    mimetype: string
  ): Promise<void>;
  uploadInstitutePhoto(
    instituteId: string,
    instituteName: string,
    imageNameKey: string,
    eventPhoto: Buffer,
    mimetype: string
  ): Promise<void>
  uploadEventGalleryPhoto(
    eventId: string,
    eventName: string,
    imageNameKey: string,
    eventPhoto: Buffer,
    mimetype: string
  ): Promise<void>;
  uploadEventBanner(
    eventId: string,
    eventName: string,
    imageNameKey: string,
    eventPhoto: Buffer,
    mimetype: string
  ): Promise<void>;
  deleteEventPhotoByEventId(eventId: string): Promise<void>;
  deleteGallery(eventId: string): Promise<void>;
  deleteInstitutePhoto(name: string): Promise<void>;
  deleteEventBanner(eventId: string, eventName: string): Promise<void>;
}
