import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Pdf } from './Pdf';  // Assuming the Pdf entity is in a separate file.

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;


  @OneToMany(() => Pdf, (pdf) => pdf.user)
  pdfs: Pdf[];  
}
