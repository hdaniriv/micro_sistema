import { TokenRecuperacion } from '../entities/token-recuperacion.entity';

export interface ITokenRecuperacionRepository {
  findAll(): Promise<TokenRecuperacion[]>;
  findById(id: number): Promise<TokenRecuperacion | null>;
  findByUserId(userId: number): Promise<TokenRecuperacion[]>;
  findByToken(token: string): Promise<TokenRecuperacion | null>;
  create(tokenRecuperacion: TokenRecuperacion): Promise<TokenRecuperacion>;
  update(
    id: number,
    tokenRecuperacion: Partial<TokenRecuperacion>
  ): Promise<TokenRecuperacion | null>;
  delete(id: number): Promise<boolean>;
  findValidTokens(userId: number): Promise<TokenRecuperacion[]>;
  markAsUsed(token: string): Promise<boolean>;
  invalidateUserTokens(userId: number): Promise<boolean>;
  cleanExpiredTokens(): Promise<number>;
}
