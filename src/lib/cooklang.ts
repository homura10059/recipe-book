export type Ingredient = {
  name: string;
  quantity?: number | string;
  units?: string;
};

type TextItem = { type: 'text'; value: string };
type IngredientItem = {
  type: 'ingredient';
  name: string;
  quantity?: number | string;
  units?: string;
};
type TimerItem = { type: 'timer'; name: string; quantity?: number | string; units?: string };
type CookwareItem = { type: 'cookware'; name: string; quantity?: number | string };

export type Step = (TextItem | IngredientItem | TimerItem | CookwareItem)[];

export type Metadata = Record<string, string>;

function parseAmount(raw: string): { quantity?: number | string; units?: string } {
  const trimmed = raw.trim();
  if (!trimmed) return {};
  const sep = trimmed.indexOf('%');
  if (sep === -1) {
    const num = Number(trimmed);
    return { quantity: Number.isNaN(num) ? trimmed : num };
  }
  const qRaw = trimmed.slice(0, sep).trim();
  const uRaw = trimmed.slice(sep + 1).trim();
  const num = Number(qRaw);
  const quantity = Number.isNaN(num) ? qRaw : num;
  return uRaw ? { quantity, units: uRaw } : { quantity };
}

// Matches (in order):
//   @name{amount}  — ingredient with braces  (name: any chars except @#~{ and newline)
//   #name{amount}  — cookware with braces
//   ~name{amount}  — timer with braces (name may be empty)
//   @word          — ingredient without braces (Unicode letters/digits, stops at punctuation)
//   #word          — cookware without braces
const TOKEN_RE =
  /(@)([^@#~{\n]+?)\{([^}]*)\}|(#)([^@#~{\n]+?)\{([^}]*)\}|(~)([^@#~{\n]*?)\{([^}]*)\}|(@)([\p{L}\p{N}_]+)|(#)([\p{L}\p{N}_]+)/gu;

function parseLine(line: string): Step {
  const items: Step = [];
  let lastIndex = 0;
  TOKEN_RE.lastIndex = 0;

  for (const match of line.matchAll(TOKEN_RE)) {
    if (match.index > lastIndex) {
      items.push({ type: 'text', value: line.slice(lastIndex, match.index) });
    }

    if (match[1] !== undefined) {
      // @name{amount}
      items.push({ type: 'ingredient', name: match[2].trim(), ...parseAmount(match[3]) });
    } else if (match[4] !== undefined) {
      // #name{amount}
      items.push({ type: 'cookware', name: match[5].trim(), ...parseAmount(match[6]) });
    } else if (match[7] !== undefined) {
      // ~name{amount}
      items.push({ type: 'timer', name: match[8].trim(), ...parseAmount(match[9]) });
    } else if (match[10] !== undefined) {
      // @word
      items.push({ type: 'ingredient', name: match[11] });
    } else if (match[12] !== undefined) {
      // #word
      items.push({ type: 'cookware', name: match[13] });
    }

    lastIndex = (match.index ?? 0) + match[0].length;
  }

  if (lastIndex < line.length) {
    items.push({ type: 'text', value: line.slice(lastIndex) });
  }

  return items;
}

export const parseCooklang = (
  body: string
): { ingredients: Ingredient[]; steps: Step[]; metadata: Metadata } => {
  const metadata: Metadata = {};
  const steps: Step[] = [];

  const lines = body.split('\n');
  let start = 0;
  if (lines[0]?.trim() === '---') {
    const end = lines.indexOf('---', 1);
    if (end !== -1) start = end + 1;
  }

  for (const line of lines.slice(start)) {
    const t = line.trim();
    if (!t || t.startsWith('--')) continue;
    if (t.startsWith('>>')) {
      const rest = t.slice(2);
      const sep = rest.indexOf(':');
      if (sep === -1) continue;
      const key = rest.slice(0, sep).trim();
      const value = rest.slice(sep + 1).trim();
      if (key && value) metadata[key] = value;
      continue;
    }
    steps.push(parseLine(t));
  }

  const ingredients: Ingredient[] = steps
    .flat()
    .filter((item): item is IngredientItem => item.type === 'ingredient')
    .map(({ name, quantity, units }) => {
      const ingredient: Ingredient = { name };
      if (quantity !== undefined) ingredient.quantity = quantity;
      if (units !== undefined) ingredient.units = units;
      return ingredient;
    });

  return { ingredients, steps, metadata };
};
