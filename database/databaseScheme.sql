-- Crear base de datos (si no existe) y seleccionarla
CREATE DATABASE IF NOT EXISTS `defaultdb`;
USE `defaultdb`;

-- defaultdb.IntentoAcceso definition

CREATE TABLE IF NOT EXISTS `IntentoAcceso` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `fecha` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ip` varchar(45) DEFAULT NULL,
  `dispositivo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- defaultdb.Rol definition

CREATE TABLE IF NOT EXISTS `Rol` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fechaCreacion` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `fechaModificacion` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `idUsuarioCreador` int DEFAULT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- defaultdb.Sesion definition

CREATE TABLE IF NOT EXISTS `Sesion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fechaCreacion` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `fechaModificacion` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `idUsuarioCreador` int DEFAULT NULL,
  `idUsuario` int NOT NULL,
  `token` varchar(255) NOT NULL,
  `fechaInicio` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fechaFin` datetime DEFAULT NULL,
  `ip` varchar(45) DEFAULT NULL,
  `userAgent` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- defaultdb.TokenRecuperacion definition

CREATE TABLE IF NOT EXISTS `TokenRecuperacion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fechaCreacion` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `fechaModificacion` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `idUsuarioCreador` int DEFAULT NULL,
  `idUsuario` int NOT NULL,
  `token` varchar(255) NOT NULL,
  `fechaExpiracion` datetime NOT NULL,
  `usado` tinyint NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- defaultdb.Usuario definition

CREATE TABLE IF NOT EXISTS `Usuario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fechaCreacion` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `fechaModificacion` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `idUsuarioCreador` int DEFAULT NULL,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(200) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  `activo` tinyint NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_fc2564b581e02a535b31470a00` (`username`),
  UNIQUE KEY `IDX_c2591f33cb2c9e689e241dda91` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- defaultdb.UsuarioRol definition

CREATE TABLE IF NOT EXISTS `UsuarioRol` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fechaCreacion` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `fechaModificacion` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `idUsuarioCreador` int DEFAULT NULL,
  `idUsuario` int NOT NULL,
  `idRol` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- defaultdb.Visita definition

CREATE TABLE IF NOT EXISTS `Visita` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idUsuario` int NOT NULL,
  `username` varchar(100) NOT NULL,
  `fecha` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ip` varchar(45) DEFAULT NULL,
  `dispositivo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
