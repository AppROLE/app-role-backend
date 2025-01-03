import { connectDB } from "../infra/database/models";

export async function changeUsernameOnPresences(username: string, newUsername: string, nickname?: string, newProfilePhoto?: string) {
  try {
    const db = await connectDB();
      db.connections[0].on("error", () => {
        console.error.bind(console, "connection error:");
        throw new Error("Error connecting to MongoDB");
      });

      const presenceClient = db.connections[0].db?.collection("Presence");
      await presenceClient?.updateMany(
        { username },
        { $set: { username: newUsername, nickname, profile_photo: newProfilePhoto } }
      );
  } catch (error) {
    console.error("Error changing username on presences: ", error);
    throw new Error("Error changing username on presences");
  }
}