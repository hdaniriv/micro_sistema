export abstract class BaseEntity {
  id: number;
  fechaCreacion: Date;
  fechaModificacion: Date;
  idUsuarioCreador?: number;

  constructor(idUsuarioCreador?: number) {
    this.fechaCreacion = new Date();
    this.fechaModificacion = new Date();
    this.idUsuarioCreador = idUsuarioCreador;
  }

  /**
   * Actualiza la fecha de modificación al momento actual
   */
  protected updateModificationDate(): void {
    this.fechaModificacion = new Date();
  }

  /**
   * Verifica si la entidad fue creada por un usuario específico
   */
  wasCreatedBy(userId: number): boolean {
    return this.idUsuarioCreador === userId;
  }
}
