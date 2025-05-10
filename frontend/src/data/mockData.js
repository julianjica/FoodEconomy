// Datos de ejemplo para usar durante el desarrollo

// Productos
export const products = [
    { id: 10, name: "Tomate" },
    { id: 12, name: "Aguacate" },
    { id: 30, name: "Papa criolla" },
    { id: 13, name: "Banano" },
    { id: 18, name: "Limón Tahití" },
    { id: 3, name: "Cebolla cabezona blanca" }
  ];
  
  // Ciudades
  export const cities = [
    "BOGOTÁ, D.C.", "MEDELLÍN", "CALI", "BARRANQUILLA", "CARTAGENA DE INDIAS",
    "BUCARAMANGA", "PEREIRA", "ARMENIA", "CÚCUTA", "IBAGUÉ", "TUNJA"
  ];
  
  // Datos de evolución de precios (12 meses)
  export const priceData = [
    { month: 'Ene', price: 2500, inflation: 1.2 },
    { month: 'Feb', price: 2530, inflation: 1.3 },
    { month: 'Mar', price: 2600, inflation: 2.1 },
    { month: 'Abr', price: 2650, inflation: 1.8 },
    { month: 'May', price: 2580, inflation: -0.9 },
    { month: 'Jun', price: 2610, inflation: 0.5 },
    { month: 'Jul', price: 2720, inflation: 3.2 },
    { month: 'Ago', price: 2750, inflation: 1.1 },
    { month: 'Sep', price: 2800, inflation: 1.7 },
    { month: 'Oct', price: 2840, inflation: 1.4 },
    { month: 'Nov', price: 2920, inflation: 2.6 },
    { month: 'Dic', price: 3050, inflation: 4.1 },
  ];
  
  // Recomendaciones de compra
  export const recommendations = [
    {
      id: 1,
      product: "Tomate",
      currentPrice: 3050,
      trend: "baja",
      recommendation: "comprar",
      reason: "Se proyecta una caída del 5% en las próximas dos semanas debido a la nueva cosecha."
    },
    {
      id: 2,
      product: "Aguacate",
      currentPrice: 5200,
      trend: "alza",
      recommendation: "esperar",
      reason: "Precios altos debido a factores estacionales. Se recomienda esperar o considerar alternativas."
    },
    {
      id: 3,
      product: "Cebolla",
      currentPrice: 1850,
      trend: "estable",
      recommendation: "neutral",
      reason: "El precio se mantiene estable. No hay ventaja en esperar para la compra."
    }
  ];