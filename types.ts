/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ScorecardAnswers {
  facilitySize: string;
  averageYield: string;
  irrigationStrategy: string;
  drybackMonitoring: string;
  substrateEC: string;
  pathogenHistory: string;
  sopDevelopment: string;
  softwareUsage: string;
  environmentalMonitoring: string;
  timeDataGathering: string;
}

export interface LeadData {
  name: string;
  company: string;
  email: string;
  phone: string;
  facilitySize: string;
}

export interface ScorecardResult {
  score: number;
  performanceCategory: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  estimatedYieldImprovements: string;
  estimatedLaborSavings: string;
  recommendedTechnology: string[];
}

export interface CRMLead {
  id: string;
  submittedAt: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  facilitySize: string;
  scorecardAnswers: Partial<ScorecardAnswers>;
  calculatedScore: number;
  insights?: Partial<ScorecardResult>;
}

export interface ServiceItem {
  id: string;
  title: string;
  category: "consulting" | "ai-automation" | "integrations";
  startingAt?: string;
  description: string;
  includes: string[];
}

export interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  metrics: string;
  clientOverview: string;
  problem: string;
  solution: string;
  results: string[];
}
