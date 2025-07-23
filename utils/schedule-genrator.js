function generateRoundRobinSchedule(teamIds) {
  const teams = [...teamIds];

  // Make number of teams even
  if (teams.length % 2 !== 0) {
    teams.push(null); // "bye"
  }

  const numRounds = teams.length - 1;
  const numMatchesPerRound = teams.length / 2;
  const schedule = [];

  for (let round = 0; round < numRounds; round++) {
    const matches = [];

    for (let i = 0; i < numMatchesPerRound; i++) {
      const home = teams[i];
      const away = teams[teams.length - 1 - i];

      if (home && away) {
        matches.push({ homeTeam: home, awayTeam: away, week: round + 1 });
      }
    }

    schedule.push(...matches);

    // Rotate all except first team
    const rest = teams.slice(1);
    rest.unshift(rest.pop()); // last element comes to 2nd position
    teams.splice(1, teams.length - 1, ...rest);
  }

  return schedule;
}

module.exports = { generateRoundRobinSchedule };
