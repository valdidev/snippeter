CREATE DATABASE snippet_keeper;
USE snippet_keeper;

CREATE TABLE snippets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    codigo TEXT NOT NULL,
    lenguaje VARCHAR(50) NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);