import { IInstitute } from "../models/institute.model";
import { Institute } from "../../../domain/entities/institute";
import { InstituteMongoDTO } from "../dtos/institute_mongo_dto";
import { v4 as uuidv4 } from "uuid";
import { connectDB } from "../models";
import { IInstituteRepository } from "../../../domain/irepositories/institute_repository_interface";
import { DuplicatedItem, NoItemsFound } from "src/shared/helpers/errors/usecase_errors";
import { PARTNER_TYPE } from "src/shared/domain/enums/partner_type_enum";
import { INSTITUTE_TYPE } from "src/shared/domain/enums/institute_type_enum";

export class InstituteRepositoryMongo implements IInstituteRepository {
  async createInstitute(institute: Institute): Promise<string> {
    try {
      const db = await connectDB();
      db.connections[0].on("error", () => {
        console.error.bind(console, "connection error:");
        throw new Error("Error connecting to MongoDB");
      });

      const instituteMongoClient =
        db.connections[0].db?.collection<IInstitute>("Institute");

      const dto = InstituteMongoDTO.fromEntity(institute);
      const instituteDoc = InstituteMongoDTO.toMongo(dto);

      instituteDoc._id = uuidv4();

      // search for institutes with the same name
      const instituteWithSameName = await instituteMongoClient?.findOne({ name: instituteDoc.name });

      if (instituteWithSameName) {
        throw new DuplicatedItem("name");
      }

      const respMongo = await instituteMongoClient?.insertOne(instituteDoc);
      console.log("MONGO REPO INSTITUTE RESPMONGO: ", respMongo);

      if (!respMongo) {
        throw new Error("Failed to insert institute document");
      }

      return respMongo.insertedId;

    } catch (error) {
      throw new Error(`Error creating institute on MongoDB: ${error}`);
    }
  }

  async getInstituteById(instituteId: string): Promise<Institute> {
    try {
      const db = await connectDB();
      db.connections[0].on("error", () => {
        console.error.bind(console, "connection error:");
        throw new Error("Error connecting to MongoDB");
      });

      const instituteMongoClient =
        db.connections[0].db?.collection<IInstitute>("Institute");

      // const instituteDoc = await instituteMongoClient?.findOne({ _id: instituteId });
      const instituteDocs = await instituteMongoClient?.aggregate([
        {
          $match: { _id: instituteId }  // Filtra o instituto pelo ID
        },
        {
          $lookup: {
            from: "Event",        // Coleção de eventos
            localField: "events",  // Campo que contém os IDs dos eventos no documento de instituto
            foreignField: "_id",   // Campo na coleção de eventos que corresponde ao ID dos eventos
            as: "eventsDetails"    // Nome do campo que conterá os detalhes dos eventos
          }
        }
      ]).toArray();
      
      const instituteDoc = instituteDocs ? instituteDocs[0] : null;
      if (!instituteDoc) {
        throw new NoItemsFound("institute");
      }

      return InstituteMongoDTO.toEntity(InstituteMongoDTO.fromMongo(instituteDoc));
    } catch (error: any) {
      if (error instanceof NoItemsFound) {
        throw new NoItemsFound(error.message);
      }
      throw new Error(`Error creating institute on MongoDB: ${error}`);
    }
  }

  async getAllInstitutes(): Promise<Institute[]> {
    try {
      const db = await connectDB();
      db.connections[0].on("error", () => {
        console.error.bind(console, "connection error:");
        throw new Error("Error connecting to MongoDB");
      });
  
      const instituteMongoClient =
        db.connections[0].db?.collection<IInstitute>("Institute");
  
      const institutes = (await instituteMongoClient?.find().toArray()) as IInstitute[];
      console.log(institutes);
  
      if (!Array.isArray(institutes) || institutes.length === 0) {
        throw new NoItemsFound("institutes");
      }
  
      return institutes.map((instituteDoc) =>
        InstituteMongoDTO.toEntity(InstituteMongoDTO.fromMongo(instituteDoc))
      );
    } catch (error: any) {
      if (error instanceof NoItemsFound) {
        throw new NoItemsFound(error.message);
      }
      throw new Error(`Error retrieving institutes from MongoDB: ${error}`);
    }
  }  

  async deleteInstituteById(instituteId: string): Promise<void> {
    try {
      const db = await connectDB();
      db.connections[0].on("error", () => {
        console.error.bind(console, "connection error:");
        throw new Error("Error connecting to MongoDB");
      });

      const instituteMongoClient =
        db.connections[0].db?.collection<IInstitute>("Institute");
      const eventMongoClient = db.connections[0].db?.collection("Event");

      const events = await eventMongoClient?.find({
        institute_id: instituteId
      }).toArray();

      if (events) {
        await eventMongoClient?.deleteMany({
          institute_id: instituteId
        });
      }

      const result = await instituteMongoClient?.deleteOne({ _id: instituteId });
      if (!result?.deletedCount) {
        throw new NoItemsFound("institute");
      }
    } catch (error: any) {
      if (error instanceof NoItemsFound) {
        throw new NoItemsFound(error.message);
      }
      throw new Error(`Error creating institute on MongoDB: ${error}`);
    }
  }

  async getAllInstitutesByPartnerType(partnerType: PARTNER_TYPE): Promise<Institute[]> {
    try {
      const db = await connectDB();
      db.connections[0].on("error", () => {
        console.error.bind(console, "connection error:");
        throw new Error("Error connecting to MongoDB");
      });

      const instituteMongoClient = db.connections[0].db?.collection<IInstitute>("Institute");

      const institutes = (await instituteMongoClient?.find({
        partner_type: partnerType
      }).toArray()) as IInstitute[];
      // console.log(institutes);
  
      if (!Array.isArray(institutes) || institutes.length === 0) {
        throw new NoItemsFound("institutes");
      }
      
      return institutes.map((institute) =>
        InstituteMongoDTO.toEntity(InstituteMongoDTO.fromMongo(institute))
      );
    } catch (error: any) {
      if (error instanceof NoItemsFound) {
        throw new NoItemsFound(error.message);
      }
      throw new Error(`Error getting institute on Mongo: ${error}`)
    }
  }

  async updateInstitutePhoto(instituteId: string, institutePhoto: string): Promise<string> {
    try {
      const db = await connectDB();
      db.connections[0].on('error', () => {
        console.error('Erro de conexão com o MongoDB');
        throw new Error('Erro de conexão com o MongoDB');
      });
  
      const instituteMongoClient = db.connections[0].db?.collection<IInstitute>('Institute');
  
      const instituteDoc = await instituteMongoClient?.findOne({ _id: instituteId });
  
      if (!instituteDoc) {
        throw new NoItemsFound('Instituto');
      }
  
      console.log('Atualizando logo_photo para: ', institutePhoto);
  
      instituteDoc.logo_photo = institutePhoto;
  
      console.log('MONGO REPO USER INSTITUTEDOC: ', instituteDoc);
  
      const respMongo = await instituteMongoClient?.updateOne(
        { _id: instituteId },  
        { $set: { logo_photo: institutePhoto } }  
      );
  
      console.log('MONGO REPO USER RESPMONGO: ', respMongo);
  
      return institutePhoto;
  
    } catch (error) {
      console.error(`Erro ao atualizar a foto do instituto no MongoDB: ${error}`);
      throw new Error(`Erro ao atualizar a foto do instituto no MongoDB: ${error}`);
    }
  }

  async updateInstitute(
    institute_id: string,
    description?: string,
    institute_type?: INSTITUTE_TYPE,
    partner_type?: PARTNER_TYPE,
    name?: string,
    address?: string,
    district_id?: string,
    phone?: string
  ): Promise<Institute> {
    try {
      const db = await connectDB();
      db.connections[0].on('error', () => {
        console.error('connection error:');
        throw new Error('Error connecting to MongoDB');
      });
  
      const instituteMongoClient = db.connections[0].db?.collection<IInstitute>('Institute');
  
      // Verificar se o documento do instituto existe
      const instituteDoc = await instituteMongoClient?.findOne({ _id: institute_id });

      // verificar se o nome eh passado, se for verificar se ja existe um instituto com esse nome
      if (name) {
        const instituteWithSameName = await instituteMongoClient?.findOne({ name });
        if (instituteWithSameName) {
          throw new DuplicatedItem('name');
        }
      }
  
      if (!instituteDoc) {
        throw new NoItemsFound('institute');
      }

      // Atualizar os campos do documento do instituto
      if (description) {
        instituteDoc.description = description;
      }
      if (institute_type) {
        instituteDoc.institute_type = institute_type;
      }
      if (partner_type) {
        instituteDoc.partner_type = partner_type;
      }
      if (name) {
        instituteDoc.name = name;
      }
      if (address) {
        instituteDoc.address = address;
      }
      if (district_id) {
        instituteDoc.district_id = district_id;
      }
      if (phone) {
        instituteDoc.phone = phone;
      }

      // Atualizar o documento do instituto no MongoDB
      const respMongo = await instituteMongoClient?.updateOne({ _id: institute_id }, { $set: instituteDoc });

      console.log('MONGO REPO INSTITUTE RESPMONGO: ', respMongo);

      const institute = InstituteMongoDTO.toEntity(InstituteMongoDTO.fromMongo(instituteDoc));

      return institute;

    } catch (error: any) {
      throw new Error(`Error updating institute on MongoDB: ${error.message}`);
    }
  }

  async updateInstituteV2(instituteId: string, updatedFields: any): Promise<Institute> {
  try {
    const db = await connectDB();
    db.connections[0].on("error", () => {
    console.error.bind(console, "connection error:");
    throw new Error("Error connecting to MongoDB");
    });

    const instituteMongoClient =
    db.connections[0].db?.collection<IInstitute>("Institute");

    const updatedInstitute = await instituteMongoClient?.findOneAndUpdate(
    { _id: instituteId },
    { $set: updatedFields },
    { returnDocument: 'after' }
    );

    if (!updatedInstitute) {
    throw new Error(`Institute with ID ${instituteId} not found`);
    }

    return InstituteMongoDTO.toEntity(InstituteMongoDTO.fromMongo(updatedInstitute));
  } catch (error) {
    throw new Error(`Error updating institute in MongoDB: ${error}`);
  }
  
}
}