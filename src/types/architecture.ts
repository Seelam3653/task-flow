export interface TableColumn {
  name: string;
  type: string;
  nullable: boolean;
  isPrimary?: boolean;
  isForeign?: boolean;
  references?: string;
  description: string;
}

export interface TableSchema {
  name: string;
  description: string;
  columns: TableColumn[];
  indexes: string[];
  rlsPolicies: string[];
}

export interface FeatureComparison {
  feature: string;
  category: string;
  freeTier: string;
  premiumTier: string;
  isKeyDifferentiator?: boolean;
}

export interface RoadmapPhase {
  phaseNumber: number;
  title: string;
  status: 'current' | 'upcoming' | 'completed';
  scope: string[];
  deliverables: string[];
}
