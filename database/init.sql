-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS gestion_sistema;
USE gestion_sistema;

-- USUARIO
CREATE TABLE Usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL,
    email VARCHAR(100) UNIQUE,
    nombre VARCHAR(100),
    activo BOOLEAN DEFAULT TRUE,
    fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fechaModificacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    idUsuarioCreador INT,
    FOREIGN KEY (idUsuarioCreador) REFERENCES Usuario(id)
);

-- ROL
CREATE TABLE Rol (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(200),
    fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fechaModificacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    idUsuarioCreador INT,
    FOREIGN KEY (idUsuarioCreador) REFERENCES Usuario(id)
);

-- USUARIO-ROL (muchos a muchos)
CREATE TABLE UsuarioRol (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT,
    idRol INT,
    fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fechaModificacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    idUsuarioCreador INT,
    FOREIGN KEY (idUsuario) REFERENCES Usuario(id),
    FOREIGN KEY (idRol) REFERENCES Rol(id),
    FOREIGN KEY (idUsuarioCreador) REFERENCES Usuario(id),
    UNIQUE KEY unique_user_role (idUsuario, idRol)
);

-- TABLAS PARA SESIONES, TOKENS, INTENTOS DE ACCESO
CREATE TABLE Sesion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT,
    token VARCHAR(255) NOT NULL,
    fechaInicio DATETIME DEFAULT CURRENT_TIMESTAMP,
    fechaFin DATETIME NULL,
    ip VARCHAR(45),
    userAgent VARCHAR(255),
    fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fechaModificacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    idUsuarioCreador INT,
    FOREIGN KEY (idUsuario) REFERENCES Usuario(id),
    FOREIGN KEY (idUsuarioCreador) REFERENCES Usuario(id)
);

CREATE TABLE IntentoAcceso (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    exito BOOLEAN,
    ip VARCHAR(45),
    userAgent VARCHAR(255),
    motivo VARCHAR(200),
    fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fechaModificacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    idUsuarioCreador INT,
    FOREIGN KEY (idUsuario) REFERENCES Usuario(id),
    FOREIGN KEY (idUsuarioCreador) REFERENCES Usuario(id)
);

CREATE TABLE TokenRecuperacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT,
    token VARCHAR(255) NOT NULL,
    fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fechaExpiracion DATETIME,
    usado BOOLEAN DEFAULT FALSE,
    idUsuarioCreador INT,
    FOREIGN KEY (idUsuario) REFERENCES Usuario(id),
    FOREIGN KEY (idUsuarioCreador) REFERENCES Usuario(id)
);

-- TABLA ÚNICA DE VISITAS (públicas y de usuario)
CREATE TABLE Visita (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip VARCHAR(45),
    userAgent VARCHAR(255),
    pagina VARCHAR(100),
    detalles VARCHAR(500),
    fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fechaModificacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    idUsuarioCreador INT,
    FOREIGN KEY (idUsuario) REFERENCES Usuario(id),
    FOREIGN KEY (idUsuarioCreador) REFERENCES Usuario(id)
);

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