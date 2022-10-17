import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Unique,
} from "typeorm";

type Chain = "aptos" | "agung";

@Entity()
@Unique(["txHash"])
export class TransactionPeaq {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  txHash: string;

  @Column()
  amount: string;

  @Column()
  blockTime: string;

  @Column()
  processedAt: number;

  @Column()
  nonce: string;

  @Column({ type: "enum", enum: ["aptos", "agung"] })
  chain: Chain;

  @CreateDateColumn({ name: "created_at" }) "created_at": Date;
}
