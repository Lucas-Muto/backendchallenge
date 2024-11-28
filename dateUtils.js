// Verifica se uma data está dentro dos últimos 12 meses
// Verifica se uma data está dentro dos últimos 12 meses (sempre usando UTC)
  const isWithinLast12Months = (date) => {

    const now = new Date(); // Data atual no UTC
    
    const oneYearAgo = new Date(now); // Subtração de 1 ano em milissegundos
    oneYearAgo.setUTCFullYear(now.getUTCFullYear() - 1);

    const givenDate = new Date(date); // Data fornecida convertida para UTC
    oneYearAgo.setMilliseconds(0);
    givenDate.setMilliseconds(0);

    // Log para depuração
    console.log("Comparação:", { givenDate, oneYearAgo });

    return givenDate >= oneYearAgo; // Retorna true se a data for dentro dos últimos 12 meses
};
  
  
  
  // Verifica se uma data de infração conflita com um intervalo de viagem
  const conflictsWithPeriod = (infractionDate, startDate, endDate) => {
    const infractionDateTime = new Date(infractionDate);
    const travelStartDate = new Date(startDate);
    const travelEndDate = new Date(endDate);

    // Calculate the boundaries (1 year before start and 1 year after end)
    const oneYearBeforeStart = new Date(travelStartDate);
    oneYearBeforeStart.setFullYear(travelStartDate.getFullYear() - 1);
    
    const oneYearAfterEnd = new Date(travelEndDate);
    oneYearAfterEnd.setFullYear(travelEndDate.getFullYear() + 1);

    console.log('Checking dates:', {
      infraction: infractionDateTime,
      travelStart: travelStartDate,
      travelEnd: travelEndDate,
      yearBefore: oneYearBeforeStart,
      yearAfter: oneYearAfterEnd
    });

    // Check if the infraction date falls within the restricted period
    return infractionDateTime >= oneYearBeforeStart && 
           infractionDateTime <= oneYearAfterEnd;
  };
  
console.log(isWithinLast12Months("2023-05-01T10:00:00Z")); // Deve retornar true
console.log(isWithinLast12Months("2022-11-27T10:00:00Z")); // Deve retornar false
console.log(isWithinLast12Months("2024-01-01T10:00:00Z")); // Deve retornar true

  // Exporta as funções para serem usadas em outros módulos
  module.exports = { isWithinLast12Months, conflictsWithPeriod };
  