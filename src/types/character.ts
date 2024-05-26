export type Character = {
  // tools
  uuid: string;
  sync: boolean;

  // info
  playerName: string;
  characterName: string;
  background: string;
  ancestry: string;
  characterClass: string;
  level: string;

  // stats
  strength: string;
  dexterity: string;
  intelligence: string;
  charisma: string;

  // resources
  currentHealth: string;
  health: string;
  armor: string;
  evasion: string;

  skills: string;
  attacks: string;
  gear: string[];
  notes: string;
  gold: string;
};
