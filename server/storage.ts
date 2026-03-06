import fs from 'fs/promises';
import path from 'path';
import { Inmate } from '@shared/schema';

export interface IStorage {
  getInmates(): Promise<Inmate[]>;
  saveInmates(inmates: Inmate[]): Promise<void>;
}

export class FileStorage implements IStorage {
  private dataPath: string;

  constructor() {
    this.dataPath = path.join(process.cwd(), 'backend', 'data', 'inmates.json');
  }

  async getInmates(): Promise<Inmate[]> {
    try {
      const data = await fs.readFile(this.dataPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if ((error as any).code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  async saveInmates(inmates: Inmate[]): Promise<void> {
    await fs.mkdir(path.dirname(this.dataPath), { recursive: true });
    await fs.writeFile(this.dataPath, JSON.stringify(inmates, null, 2));
  }
}

export const storage = new FileStorage();
