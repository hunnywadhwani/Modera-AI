
export enum Gender {
  Female = 'Female',
  Male = 'Male',
  NonBinary = 'Non-Binary'
}

export enum AgeGroup {
  YoungAdult = 'Young Adult (18-25)',
  Adult = 'Adult (26-35)',
  Mature = 'Mature (36-50)',
  Senior = 'Senior (50+)'
}

export enum SkinTone {
  Fair = 'Fair',
  Medium = 'Medium',
  Olive = 'Olive',
  Brown = 'Brown',
  Dark = 'Dark'
}

export enum FashionStyle {
  IndianClassic = 'Indian Classic (Ethnic)',
  ModernChic = 'Modern Chic',
  Festive = 'Festive & Wedding',
  WesternCasual = 'Western Casual',
  Professional = 'Corporate Professional',
  Streetwear = 'Streetwear'
}

export enum ModelPose {
  StandingConfident = 'Standing Confident',
  Walking = 'Walking Motion',
  HandsOnWaist = 'Hands on Waist',
  Leaning = 'Leaning against wall',
  StudioCloseUp = 'Studio Portrait (Waist Up)'
}

export enum CameraView {
  Front = 'Front View',
  Back = 'Back View',
  Left = 'Left Side Profile',
  Right = 'Right Side Profile'
}

export interface ModelConfig {
  gender: Gender;
  ageGroup: AgeGroup;
  skinTone: SkinTone;
  style: FashionStyle;
  pose: ModelPose;
  view: CameraView;
}

export interface GenerationResult {
  imageUrl: string;
  timestamp: number;
}
