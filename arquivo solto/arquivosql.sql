DROP TABLE IF EXISTS tbreservatorio CASCADE;

CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS tbreservatorio (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255),
    coordenada GEOGRAPHY(POINT, 4326)
);

INSERT INTO tbreservatorio (nome, coordenada) VALUES
('Jirau', ST_SetSRID(ST_MakePoint(-64.734846, -9.334599), 4326)),
('Funil', ST_SetSRID(ST_MakePoint(-44.568153, -22.528715), 4326)),
('Santo Antônio', ST_SetSRID(ST_MakePoint(-63.97724, -8.809319), 4326)),
('Batalha', ST_SetSRID(ST_MakePoint(-47.498885, -17.335752), 4326)),
('Três Marias', ST_SetSRID(ST_MakePoint(-45.258854, -18.215149), 4326)),
('Itaipu', ST_SetSRID(ST_MakePoint(-54.589594, -25.407988), 4326)),
('Segredo', ST_SetSRID(ST_MakePoint(-52.113486, -25.790119), 4326)),
('Serra da Mesa', ST_SetSRID(ST_MakePoint(-48.296317, -13.841339), 4326)),
('Tucuruí', ST_SetSRID(ST_MakePoint(-49.642916, -3.831928), 4326)),
('Manso', ST_SetSRID(ST_MakePoint(-55.784943, -14.871063), 4326)),
('Curuai', NULL),
('Itumbiara', ST_SetSRID(ST_MakePoint(-49.097982, -18.407263), 4326)),
('Corumbá', ST_SetSRID(ST_MakePoint(-48.533016, -17.987684), 4326)),
('Estreito', ST_SetSRID(ST_MakePoint(-47.281169, -20.155828), 4326)),
('Furnas', ST_SetSRID(ST_MakePoint(-46.317305, -20.670372), 4326)),
('Mascarenhas de Moraes', ST_SetSRID(ST_MakePoint(-47.064373, -20.286321), 4326)),
('Mamirauá', NULL),
('Balbina', ST_SetSRID(ST_MakePoint(-59.63711944, -1.765597222), 4326)),
('Xingó', ST_SetSRID(ST_MakePoint(-37.82998889, -9.599694444), 4326)),
('Belo Monte', ST_SetSRID(ST_MakePoint(-51.93371667, -3.435975), 4326)),
('Porto Colômbia', ST_SetSRID(ST_MakePoint(-48.57162222, -20.12777222), 4326)),
('Marimbondo', ST_SetSRID(ST_MakePoint(-49.19798889, -20.303175), 4326));

SELECT * FROM tbreservatorio;
