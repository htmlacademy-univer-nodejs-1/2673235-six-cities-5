import { injectable } from 'inversify';
import 'dotenv/config.js';
import convict from 'convict';
import { url, ipaddress } from 'convict-format-with-validator';

convict.addFormat(url);
convict.addFormat(ipaddress);

type RawConfig = {
  app: {
    port: number;
    salt: string;
  };
  db: {
    host: string;
  };
};

type ConfigKey = 'app.port' | 'app.salt' | 'db.host';

@injectable()
export class ConfigService {
  private readonly conf = convict<RawConfig>({
    app: {
      port: {
        doc: 'App port',
        format: 'port',
        default: 3000,
        env: 'APP_PORT'
      },
      salt: {
        doc: 'Salt for hashing',
        format: String,
        default: '',
        env: 'SALT'
      }
    },
    db: {
      host: {
        doc: 'DB host IP',
        format: 'ipaddress',
        default: '',
        env: 'DB_HOST'
      }
    }
  });

  constructor() {
    this.conf.validate({ allowed: 'strict' });
  }

  get<T = unknown>(key: ConfigKey): T {
    return this.conf.get(key) as T;
  }

  getPort(): number {
    return this.conf.get('app.port');
  }

  getDbHost(): string {
    return this.conf.get('db.host');
  }

  getSalt(): string {
    return this.conf.get('app.salt');
  }
}
