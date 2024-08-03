import { Entity, Column, BeforeInsert, BeforeUpdate } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import * as crypto from 'crypto';

@Entity()
export class Terms extends AbstractEntity {
  @Column({
    name: 'term',
    type: 'text',
    nullable: false,
  })
  termsOfService!: string;

  @Column({
    name: 'term_hash',
    type: 'varchar',
    length: 64,
    nullable: false,
    unique: true,
  })
  termsOfServiceHash!: string;

  @BeforeInsert()
  @BeforeUpdate()
  generateHash() {
    this.termsOfServiceHash = crypto.createHash('sha256').update(this.termsOfService).digest('hex');
  }
}