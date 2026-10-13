import type { User } from "./types";

/*
 * Fictional users for the parts of the UI that have no API behind them yet.
 * None of them is the signed-in user; that comes from the auth state.
 */

const tomasz: User = {
  id: "user-3",
  username: "tbrenner",
  displayName: "Tomasz Brenner",
};

const aiko: User = {
  id: "user-4",
  username: "aiko_m",
  displayName: "Aiko Morimoto",
};

const priya: User = {
  id: "user-6",
  username: "priyanair",
  displayName: "Priya Nair",
};

export const suggestedUsers: User[] = [tomasz, aiko, priya];
