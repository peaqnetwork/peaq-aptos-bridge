import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Unique } from "typeorm"

@Entity()
@Unique(['chainID','chainName'])
export class ChainData {

    @PrimaryGeneratedColumn('uuid')
    id: number

    @Column()
    chainName: string

    @Column()
    chainID: number

    @Column()
    lastProccessedBlock: number

    @CreateDateColumn({ name: 'created_at' }) 'created_at': Date
    @UpdateDateColumn({ name: 'updated_at' }) 'updated_at': Date;
}
