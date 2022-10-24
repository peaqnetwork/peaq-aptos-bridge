import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Unique,
  BaseEntity,
} from "typeorm";

type TDestination = "aptos" | "peaq";

@Entity()
@Unique(["txHash", "from", "to"])
export class PendingTransactions {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  txHash: string;

  @Column("simple-array")
  argumments: string[];

  @Column()
  method: string;

  @Column({ type: "enum", enum: ["aptos", "peaq"] })
  from: TDestination;

  @Column({ type: "enum", enum: ["aptos", "peaq"] })
  to: TDestination;

  @CreateDateColumn({ name: "created_at" }) "created_at": Date;
}
