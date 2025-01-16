import mongoose, { Schema, Document } from 'mongoose';

export interface AuditProps {
  action: string; // Ação realizada, como "DELETE_USER", "UPDATE_PROFILE"
  entity: string; // Entidade afetada, como "User", "Event", "Profile"
  entityId?: string; // ID único da entidade afetada, se aplicável
  performedBy: string; // Apenas o userId de quem realizou a ação
  details?: Record<string, any>; // Detalhes específicos do log, como os dados alterados
  timestamp: Date; // Data e hora da ação
  status: 'SUCCESS' | 'FAILURE'; // Status da ação
}

export interface IAudit extends Document, AuditProps {}

const AuditSchema: Schema = new Schema<IAudit>({
  action: { type: String, required: true },
  entity: { type: String, required: true },
  entityId: { type: String },
  performedBy: { type: String, required: true },
  details: { type: Schema.Types.Mixed },
  timestamp: { type: Date, required: true, default: Date.now },
  status: { type: String, required: true, enum: ['SUCCESS', 'FAILURE'] },
});

export const AuditModel = mongoose.model<IAudit>('audit', AuditSchema);
