import { Injectable } from "@nestjs/common";
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { IConfig } from './interfaces/IConfig';


@Injectable()
export class ConfigService {

    private readonly config: IConfig;

    constructor() {
        this.config = dotenv.parse(fs.readFileSync(`${process.env.NODE_ENV}.env`));
    }

    public getConfig(key: string): string {
        return process.env[key] || this.config[key];
    }
}