import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  _id: string;
  userId: string; // ID do usuário cujos dados foram excluídos
  action: string; // Ação realizada (e.g., 'DELETE_USER')
  timestamp: Date; // Timestamp da ação
  details: Record<string, any>; // Dados excluídos ou detalhes adicionais
  performedBy: string; // Quem realizou a ação (e.g., 'SYSTEM' ou um adminId)
}

const AuditLogSchema = new Schema<IAuditLog>({
  _id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString(),
  },
  userId: { type: String, required: true },
  action: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  details: { type: Object, required: true },
  performedBy: { type: String, required: true },
});

export const AuditLogModel = mongoose.model<IAuditLog>(
  'AuditLog',
  AuditLogSchema
);
