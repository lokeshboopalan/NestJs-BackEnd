import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id!: number; // ✅ add !

  @Column({ unique: true })
  name!: string; // ✅ add !

  @Column({ type: 'text', nullable: true })
  image?: string;

  @Column({ nullable: true })
  description?: string; // optional fields keep ?

  @Column({ default: true })
  isActive!: boolean; // ✅ add !

  @CreateDateColumn()
  createdAt!: Date; // ✅ add !

  @UpdateDateColumn()
  updatedAt!: Date; // ✅ add !
}
