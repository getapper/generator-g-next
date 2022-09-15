import mongoClientPromise from "lib/mongodb";
import {
  BulkWriteOptions,
  Db,
  DeleteOptions,
  DeleteResult,
  Filter,
  FindOptions,
  InsertManyResult,
  MongoClient,
  ObjectId,
  OptionalUnlessRequiredId,
  UpdateFilter,
  UpdateOptions,
  UpdateResult,
} from "mongodb";
import * as yup from "yup";
import { BaseSchema } from "yup";

export const yupObjectId = () =>
  yup
    .mixed()
    .transform((value: string, originalValue: string, schema: BaseSchema) => {
      if (value === null) {
        return schema.spec.nullable ? null : "error";
      }
      if (!ObjectId.isValid(value)) {
        return "error";
      }
      return new ObjectId(value);
    })
    .test(
      "isValidObjectId",
      "Argument passed in must be a single String of 12 bytes or a string of 24 hex characters",
      function (value) {
        const { path, createError } = this;

        if (value === "error") {
          return createError({ path });
        }

        return true;
      }
    );

export type WithoutId<Interface> = Omit<Interface, "_id">;

class MongoDao<Interface, Class> {
  mongoClient: MongoClient | null;
  db: Db | null;
  collection: string;

  constructor() {
    this.mongoClient = null;
    this.db = null;
    this.collection = "";
  }

  async init() {
    if (!process.env.MONGODB_NAME) {
      throw new Error("Please specify process.env.MONGODB_NAME");
    }
    if (!this.db) {
      this.mongoClient = await mongoClientPromise;
      this.db = this.mongoClient.db(process.env.MONGODB_NAME);
    }
  }

  async findOne<Interface>(
    collectionName: string,
    filter: Filter<Interface>,
    options?: FindOptions
  ): Promise<Interface | null> {
    if (!this.db) {
      await this.init();
    }
    return this.db
      .collection(collectionName)
      .findOne<Interface>(filter, options);
  }

  async findMany<Interface>(
    collectionName: string,
    filter: Filter<Interface>,
    options?: FindOptions
  ): Promise<Interface[]> {
    if (!this.db) {
      await this.init();
    }
    if (this.db) {
      return this.db
        .collection<Interface>(collectionName)
        .find<Interface>(filter, options)
        .toArray();
    }
    return [];
  }

  async insertOne<Interface>(
    collectionName: string,
    document: Interface
  ): Promise<Interface | null> {
    if (!this.db) {
      await this.init();
    }
    if (this.db) {
      const result = await this.db
        .collection(collectionName)
        .insertOne(document);
      if (result.insertedId) {
        return this.db
          .collection<Interface>(collectionName)
          .findOne<Interface>({
            _id: result.insertedId,
          } as unknown as Filter<Interface>);
      }
    }
    return null;
  }

  async insertMany<Interface>(
    collectionName: string,
    documents: OptionalUnlessRequiredId<Interface>[],
    options: BulkWriteOptions
  ): Promise<InsertManyResult<Interface>> {
    if (!this.db) {
      await this.init();
    }
    return this.db
      .collection<Interface>(collectionName)
      .insertMany(documents, options);
  }

  async updateOne<Interface>(
    collectionName: string,
    filter: Filter<Interface>,
    document: UpdateFilter<Interface> | Partial<Interface>,
    options?: UpdateOptions
  ): Promise<UpdateResult> {
    if (!this.db) {
      await this.init();
    }
    return this.db
      .collection<Interface>(collectionName)
      .updateOne(filter, document, options);
  }

  async updateMany<Interface>(
    collectionName: string,
    filter: Filter<Interface>,
    document: UpdateFilter<Interface> | Partial<Interface>,
    options?: UpdateOptions
  ): Promise<any> {
    if (!this.db) {
      await this.init();
    }
    return this.db
      .collection<Interface>(collectionName)
      .updateMany(filter, document, options);
  }

  async deleteOne<Interface>(
    collectionName: string,
    filter: Filter<Interface>,
    options?: DeleteOptions
  ): Promise<DeleteResult> {
    if (!this.db) {
      await this.init();
    }
    return this.db.collection(collectionName).deleteOne(filter, options);
  }

  async deleteMany<Interface>(
    collectionName: string,
    filter: Filter<Interface>,
    options?: DeleteOptions
  ): Promise<DeleteResult> {
    if (!this.db) {
      await this.init();
    }
    return this.db.collection(collectionName).deleteMany(filter, options);
  }
}

const mongoDao = new MongoDao();
export default mongoDao;
