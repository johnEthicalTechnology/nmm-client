export interface UserProfileData {
  me: UserProfile
}

interface UserProfile {
  id: string
  totalPoints: number
  challengeGoals: number
  motivations: [MotivationsEnum]
  username: string
  bio: string
  lowResProfile: string
  standardResolution: string
  challengeQuote: string
}

export enum MotivationsEnum {
  Environment = 'Environment',
  AnimalWelfare = 'AnimalWelfare',
  FoodSecurity = 'FoodSecurity',
  PersonalHealth = 'PersonalHealth'
}
