export type CharacterTracker = {
  name: string;
  value: number;
};
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
  constitution: string;
  intelligence: string;
  wisdom: string;
  charisma: string;

  trackers: CharacterTracker[];
  skills: string;
  attacks: string;
  gear: string[];
  notes: string;
  gold: string;
};
