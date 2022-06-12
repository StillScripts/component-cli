/* eslint-disable prettier/prettier */
export interface VersolyComponentField {
  slug: string;
  name: string;
  type: string;
  editable: boolean;
  required: boolean;
  defaultValue: string;
}

export interface VersolyComponent {
  id: string;
  name: string;
  text: {
    HTML: string;
  };
  created: string;
  updated: string;
  fields: VersolyComponentField[];
}
