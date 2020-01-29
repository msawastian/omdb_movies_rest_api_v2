import { Injectable, Logger } from "@nestjs/common";
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { IConfig } from './interfaces/IConfig';


@Injectable()
export class ConfigService {
    private readonly logger: Logger = new Logger(ConfigService.name);


    private readonly config: IConfig;

    constructor() {
        this.config = dotenv.parse(fs.readFileSync(`./env/${process.env.NODE_ENV}.env`));
    }

    public getConfig(key: string): string {
        return process.env[key] || this.config[key];
    }
}