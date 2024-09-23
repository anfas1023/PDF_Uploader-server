
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './User';  // Ensure the correct path to User entity

@Entity()
export class Pdf {
  @PrimaryGeneratedColumn()
  id: number;
 
  @Column()
  path: string;

  @Column()
  name: string;

  @ManyToOne(() => User, user => user.pdfs, { onDelete: 'CASCADE' })
  user: User;
}



