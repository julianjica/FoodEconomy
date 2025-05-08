# OFICINA DE SISTEMAS  
## DOCUMENTACIÓN WEBSERVICE - SIPSA  
**Marzo del 2020**

Recuperado de https://www.dane.gov.co/index.php/estadisticas-por-tema/agropecuario/sistema-de-informacion-de-precios-sipsa/servicio-web-para-consulta-de-la-base-de-datos-de-sipsa

---

## GENERALIDADES WEB SERVICE

Este servicio permite la consulta de la información consolidada en la base de datos del aplicativo SIPSA, alimentada de los diferentes métodos de recolección para productos agroalimentarios comercializados en el país, así como información de insumos, factores asociados a la producción agrícola y abastecimiento de alimentos.

La implementación está desarrollada bajo el estándar SOAP 1.2 en XML sobre HTTP. Desarrollado en Java JDK 1.6 usando ADF.

### Condiciones de acceso:
- **Mayoristas**: Datos diarios/semanales disponibles desde las 2 p.m. del día, datos mensuales actualizados el día 8 del mes.
- **Abastecimientos**: Información mensual, actualizada el día 10 del mes.

---

## DOCUMENTACIÓN TÉCNICA WEBSERVICE

### 1. Características Técnicas

- **Protocolo de comunicación**: SOAP  
- **Lenguaje de desarrollo**: JAVA  
- **Versión JDK**: 1.6  
- **Contenedor de aplicaciones**: WebLogic 11  

---

### 2. Descripción de Servicios

#### ➤ Servicio de promedios por fuente y producto para abastecimiento  
**Método:** `promedioAbasSipsaMesMadr`  
**Descripción:** Retorna cantidad promedio mensual (toneladas) por productos y fuentes.  
**Formato de salida:** XML

**Campos:**
- `artiId`: Identificador producto  
- `artiNombre`: Nombre producto  
- `cantidadTon`: Cantidad promedio  
- `fechaMesIni`: Fecha inicial del mes  
- `fuenId`: Identificador fuente  
- `fuenNombre`: Nombre fuente  
- `futiId`: ID relación fuente-tipo  

**Ejemplo:**
```xml
<return>
  <artiId>547</artiId>
  <artiNombre>Basa</artiNombre>
  <cantidadTon>77</cantidadTon>
  <fechaMesIni>2016-10-01T00:00:00-05:00</fechaMesIni>
  <fuenId>36</fuenId>
  <fuenNombre>Bucaramanga, Centroabastos</fuenNombre>
  <futiId>78</futiId>
</return>
```

---

#### ➤ Servicio de precio promedio de insumos por ubicación y tipo de recolección  
**Método:** `consultarInsumosSipsaMesMadr`  
**Descripción:** Retorna precio promedio mensual de insumos, por municipio y tipo de recolección.  
**Formato de salida:** XML

**Campos:**
- `deptNombre`, `muniId`, `muniNombre`
- `insumoNombre`, `promedio`
- `tireId`, `tireNombre`
- `fechaMesIni`

**Ejemplo:**
```xml
<return>
  <deptNombre>ANTIOQUIA</deptNombre>
  <fechaMesIni>2014-12-01T00:00:00-05:00</fechaMesIni>
  <insumoNombre>Malathion 57 Ec, 1 litro</insumoNombre>
  <muniId>05001</muniId>
  <muniNombre>MEDELLÍN</muniNombre>
  <promedio>20366</promedio>
  <tireId>4</tireId>
  <tireNombre>INSUMOS AGRICOLAS</tireNombre>
</return>
```

---

#### ➤ Servicio de valores de recolección por semana para mayoristas  
**Método:** `promediosSipsaSemanaMadr`  
**Descripción:** Retorna máximo, mínimo y promedio semanal por producto y fuente.  
**Formato de salida:** XML

**Campos:**
- `artiId`, `artiNombre`, `fechaMesIni`
- `fuenId`, `fuenNombre`, `futiId`
- `maximoKg`, `minimoKg`, `promedioKg`

**Ejemplo:**
```xml
<return>
  <artiId>64</artiId>
  <artiNombre>>Calabaza</artiNombre>
  <fechaIni>2018-01-06T00:00:00-05:00</fechaIni>
  <fuenId>56</fuenId>
  <fuenNombre>Medellín, Central Mayorista de Antioquia</fuenNombre>
  <futiId>56</futiId>
  <maximoKg>800</maximoKg>
  <minimoKg>700</minimoKg>
  <promedioKg>733</promedioKg>
</return>
```

---

#### ➤ Servicio de valores de recolección parcial por ubicación y fuente para mayoristas  
**Método:** `promediosSipsaParcial`  
**Descripción:** Retorna valores máximos, mínimos y promedio por ubicación y fuente.  
**Formato de salida:** XML

**Campos:**
- `artiNombre`, `deptNombre`, `muniNombre`, `muniId`
- `fuenNombre`, `fuenId`, `futiId`, `grupNombre`
- `maximoKg`, `minimoKg`, `promedioKg`
- `enmaFecha`, `idArtiSemana`

**Ejemplo:**
```xml
<return>
  <artiNombre>Pimentón</artiNombre>
  <deptNombre>MAGDALENA</deptNombre>
  <enmaFecha>2017-03-29T00:00:00-05:00</enmaFecha>
  <fuenId>1836</fuenId>
  <fuenNombre>Santa Marta (Magdalena)</fuenNombre>
  <futiId>3896</futiId>
  <grupNombre>VERDURAS Y HORTALIZAS</grupNombre>
  <idArtiSemana>10</idArtiSemana>
  <maximoKg>1666.67</maximoKg>
  <minimoKg>1500</minimoKg>
  <muniId>47001</muniId>
  <muniNombre>SANTA MARTA</muniNombre>
  <promedioKg>1583</promedioKg>
</return>
```

---

#### ➤ Servicio de precio promedio por ciudad  
**Método:** `promediosSipsaCiudad`  
**Descripción:** Retorna valores promedio de productos por ciudad.  
**Formato de salida:** XML

**Campos:**
- `ciudad`, `codProducto`, `producto`
- `precioPromedio`, `fechaCaptura`, `fechaCreacion`
- `regId`, `enviado`

**Ejemplo:**
```xml
<return>
  <ciudad>CÚCUTA</ciudad>
  <codProducto>8</codProducto>
  <enviado>0</enviado>
  <fechaCaptura>2017-11-23T00:00:00-05:00</fechaCaptura>
  <fechaCreacion>2017-11-23T14:00:00-05:00</fechaCreacion>
  <precioPromedio>2083</precioPromedio>
  <producto>Pimentón</producto>
  <regId>212186</regId>
</return>
```

---

#### ➤ Servicio de cantidades de recolección por mes para mayoristas  
**Método:** `promediosSipsaMesMadr`  
**Descripción:** Retorna cantidades máximas, mínimas y promedio mensual en Kg.  
**Formato de salida:** XML

**Campos:**
- `artiId`, `artiNombre`, `fechaMesIni`, `fechaCreacion`
- `fuenId`, `fuenNombre`, `futiId`
- `maximoKg`, `minimoKg`, `promedioKg`, `tmpMayoMesId`

**Ejemplo:**
```xml
<return>
  <artiId>64</artiId>
  <artiNombre>>Calabaza</artiNombre>
  <enviado>0</enviado>
  <fechaCreacion>2017-11-23T14:00:00-05:00</fechaCreacion>
  <fechaMesIni>2018-01-06T00:00:00-05:00</fechaMesIni>
  <fuenId>1836</fuenId>
  <fuenNombre>Santa Marta (Magdalena)</fuenNombre>
  <futiId>56</futiId>
  <maximoKg>800</maximoKg>
  <minimoKg>700</minimoKg>
  <promedioKg>733</promedioKg>
  <tmpMayoMesId>212186</tmpMayoMesId>
</return>
```

---

## DICCIONARIO DE DATOS

### TABLA: SIPSA_MAYORISTA_SEMANA_MADR

| Columna            | Tipo de dato        | Comentario                                  |
|--------------------|---------------------|----------------------------------------------|
| TMP_MAYO_SEM_ID    | NUMBER              | Identificador de la tabla                    |
| FECHA_INI          | DATE                | Fecha de corte                               |
| ARTI_ID            | NUMBER(10,0)        | ID del artículo                              |
| ARTI_NOMBRE        | VARCHAR2(200 BYTE)  | Nombre del artículo                          |
| FUTI_ID            | NUMBER(10,0)        | Fuente-tipo recolección                      |
| FUEN_ID            | NUMBER(10,0)        | ID de la fuente                              |
| FUEN_NOMBRE        | VARCHAR2(500 BYTE)  | Nombre de la fuente                          |
| PROMEDIO_KG        | NUMBER              | Promedio en Kg                               |
| MINIMO_KG          | NUMBER              | Valor mínimo                                 |
| MAXIMO_KG          | NUMBER              | Valor máximo                                 |
| ENVIADO            | NUMBER              | Bandera de consumo                           |
| FECHA_CREACION     | DATE                | Fecha de creación                            |

### TABLA: SIPSA_MAYORISTA_MES_MADR

(Similar a anterior, con `FECHA_MES_INI` y `TMP_MAYO_MES_ID`)

### TABLA: SIPSA_TMP_PROMEDIOS_MAYORISTAS

Incluye campos como `DEPT_NOMBRE`, `GRUP_NOMBRE`, `PRRE_FECHA_PROGRAMADA`, `MUNI_ID`, `ID_ARTI_SEMANA`, `FUEN_ID`, etc.

### TABLA: SIPSA_ABASTECIMIENTOS_MES_MADR

Incluye: `CANTIDAD_TON`, `ARTI_ID`, `FUEN_NOMBRE`, `FECHA_CREACION`, `ENVIADO`, etc.

---
