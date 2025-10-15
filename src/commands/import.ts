import chalk from 'chalk';
import fs from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import readline from 'node:readline';
import { parseTsvLine } from '../utils/tsv.js';

export async function importTsv(filePath: string): Promise<void> {
  const exists = await fs.access(filePath).then(() => true).catch(() => false);
  if (!exists) {
    console.error(chalk.red(`Файл не найден: ${filePath}`));
    process.exitCode = 1;
    return;
  }

  const rl = readline.createInterface({
    input: createReadStream(filePath),
    crlfDelay: Infinity
  });

  let imported = 0;

  console.log(chalk.blueBright(`Импорт из: ${filePath}\n`));

  for await (const line of rl) {
    const trimmed = line.trim();

    if (trimmed.length === 0) {
      continue;
    }
    if (trimmed.startsWith('#')) {
      continue;
    }

    const offer = parseTsvLine(trimmed);
    imported += 1;

    console.log(
      `${chalk.bold(offer.title)} ${chalk.gray(`[${offer.city}]`)} ${chalk.yellow(`€${offer.price}`)} ${chalk.gray(`(${offer.type}, rating ${offer.rating})`)}`
    );
  }

  console.log(`\n${chalk.cyan.bold(`Итого импортировано: ${imported}`)}`);
}
