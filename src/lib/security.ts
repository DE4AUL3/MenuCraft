// src/lib/security.ts
import crypto from 'crypto';

/**
 * Интерфейс для результата хеширования пароля
 */
interface PasswordHashResult {
  hash: string;
  salt: string;
}

/**
 * Безопасное хеширование паролей с солью
 * 
 * @param password Исходный пароль
 * @param existingSalt Опционально существующая соль для проверки
 * @returns Объект с хешем и солью
 */
export function hashPassword(password: string, existingSalt?: string): PasswordHashResult {
  // Генерируем соль или используем существующую
  const salt = existingSalt || crypto.randomBytes(16).toString('hex');
  
  // Хешируем пароль с солью
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex');
  
  return { hash, salt };
}

/**
 * Проверка пароля
 * 
 * @param password Исходный пароль
 * @param storedHash Сохраненный хеш для проверки
 * @param storedSalt Сохраненная соль
 * @returns true если пароль совпадает, иначе false
 */
export function verifyPassword(
  password: string,
  storedHash: string,
  storedSalt: string
): boolean {
  const { hash } = hashPassword(password, storedSalt);
  return hash === storedHash;
}

/**
 * Генерирует случайный токен
 * 
 * @param length Длина токена (по умолчанию 32 символа)
 * @returns Случайная строка указанной длины
 */
export function generateToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Безопасное сравнение строк для предотвращения timing-атак
 * 
 * @param a Первая строка
 * @param b Вторая строка
 * @returns true если строки равны, иначе false
 */
export function secureCompare(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') {
    return false;
  }
  
  // Используем константное время для сравнения
  return crypto.timingSafeEqual(
    Buffer.from(a, 'utf8'),
    Buffer.from(b, 'utf8')
  );
}

/**
 * Шифрует данные с использованием AES
 * 
 * @param data Данные для шифрования
 * @param key Ключ шифрования
 * @returns Зашифрованная строка
 */
export function encryptData(data: string, key: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    'aes-256-cbc', 
    crypto.createHash('sha256').update(key).digest('base64').slice(0, 32),
    iv
  );
  
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return iv.toString('hex') + ':' + encrypted;
}

/**
 * Расшифровывает данные AES
 * 
 * @param encryptedData Зашифрованная строка
 * @param key Ключ шифрования
 * @returns Расшифрованная строка
 */
export function decryptData(encryptedData: string, key: string): string {
  const parts = encryptedData.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts[1];
  
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    crypto.createHash('sha256').update(key).digest('base64').slice(0, 32),
    iv
  );
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

/**
 * Создает подпись для данных
 * 
 * @param data Данные для подписи
 * @param secretKey Секретный ключ
 * @returns Подпись в виде строки
 */
export function createSignature(data: string, secretKey: string): string {
  return crypto
    .createHmac('sha256', secretKey)
    .update(data)
    .digest('hex');
}

/**
 * Проверяет подпись данных
 * 
 * @param data Исходные данные
 * @param signature Подпись для проверки
 * @param secretKey Секретный ключ
 * @returns true если подпись верна, иначе false
 */
export function verifySignature(
  data: string,
  signature: string,
  secretKey: string
): boolean {
  const expectedSignature = createSignature(data, secretKey);
  return secureCompare(signature, expectedSignature);
}