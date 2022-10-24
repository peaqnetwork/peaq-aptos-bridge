import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Unique,
} from "typeorm";

type Chain = "aptos" | "peaq";

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
  processedAt: string;

  @Column({ nullable: true })
  nonce: string;

  @Column({ type: "enum", enum: ["aptos", "peaq"] })
  chain: Chain;

  @CreateDateColumn({ name: "created_at" }) "created_at": Date;
}
