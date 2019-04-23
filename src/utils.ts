interface ActionNameParams {
  action: string;
  model?: string;
  vessel: string;
  level?: number;
}

export function complementActionName({
  action,
  model,
  vessel,
  level = 3,
}: ActionNameParams): string {
  let splits = action.split('/');

  if (splits.length > 3) {
    throw new Error(`Given action '${action}' does not match the format: [vessel]/[model]/action`);
  }

  if (splits.length === 1) {
    if (!model) {
      throw new Error(`Could not resolve a model`);
    }
    // action
    splits = [vessel, model, action];
  } else if (splits.length === 2) {
    // model/action
    splits = [vessel, ...splits];
  }

  return splits.slice(3 - level).join('/');
}
