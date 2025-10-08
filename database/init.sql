-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS gestion_sistema;
USE gestion_sistema;



-- Insertar roles por defecto
INSERT INTO Rol (nombre, descripcion) VALUES
('Administrador', 'Acceso completo al sistema'),
('Supervisor', 'Supervisión de operaciones y técnicos'),
('Tecnico', 'Ejecución de tareas técnicas'),
('Cliente', 'Acceso limitado para clientes');

-- Insertar usuario administrador por defecto (password: admin123)
INSERT INTO Usuario (username, password, email, nombre, activo) VALUES
('admin', '$2b$12$gfZWoKFkuaA2G/W/TZqFseF1g/xr6mV09Tm2qJ9a0Vwy5My3ambMy', 'admin@sistema.com', 'Administrador del Sistema', TRUE);

-- Asignar rol de administrador al usuario por defecto
INSERT INTO UsuarioRol (idUsuario, idRol) VALUES (1, 1);
