import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Default,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

@Table({ tableName: "tasks", timestamps: true })
export class Task extends Model<Task> {
  @PrimaryKey
  @AutoIncrement
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: "due_date",
  })
  dueDate!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: "start_date",
  })
  startDate!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: "end_date",
  })
  endDate!: Date;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  title!: string;

  @Column(DataType.TEXT)
  description?: string;

  @Default("todo")
  @Column(DataType.ENUM("todo", "on progress", "done"))
  status!: "todo" | "on progress" | "done";

  @Column(DataType.JSON)
  contributors?: string[];

  @Column({ type: DataType.STRING(50), field: "created_by" })
  createdBy?: string;

  @Column({ type: DataType.STRING(50), field: "updated_by" })
  updatedBy?: string;

  @Column({ type: DataType.STRING(50), field: "deleted_by" })
  deletedBy?: string;

  @CreatedAt
  @Column({ field: "created_at" })
  createdAt!: Date;

  @UpdatedAt
  @Column({ field: "updated_at" })
  updatedAt!: Date;
}
