// Verifica se uma data está dentro dos últimos 12 meses
// Verifica se uma data está dentro dos últimos 12 meses (sempre usando UTC)
  const isWithinLast12Months = (date) => {

    const now = new Date(); // Data atual no UTC
    
    const oneYearAgo = new Date(now); // Subtração de 1 ano em milissegundos
    oneYearAgo.setUTCFullYear(now.getUTCFullYear() - 1);

    const givenDate = new Date(date); // Data fornecida convertida para UTC
    oneYearAgo.setMilliseconds(0);
    givenDate.setMilliseconds(0);

    const withinLast12Months = givenDate >= oneYearAgo && givenDate <= now;
   

    return withinLast12Months; // Retorna true se a data for dentro dos últimos 12 meses
};
  

  

  // Exporta as funções para serem usadas em outros módulos
  module.exports = { isWithinLast12Months };
  