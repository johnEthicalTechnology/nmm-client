export interface CreateUpdateChallengeState {
  sectionsCompleted: Array<string>
  standardResolution: string
  lowResSharedFriendsImage: string
}

export interface ActionType {
  type: string
}

export type HandleCreateUpdateChallengeApi = (
  values: CreateUpdateMutationValues,
  section: Array<string>,
  sharedFriendsImage?: SharedFriendsImage
) => void

interface SharedFriendsImage {
  standardResolution: string
  lowResSharedFriendsImage: string
}

export interface CreateUpdateMutationValues {
  type: string
  difficulty: DifficultyEnum | undefined
  recipeId: number
  sectionsCompleted: Array<string>
  lowResSharedFriendsImage: string
  standardResolution: string
}

export interface DeleteRecipeType {
  recipeTitleOrId: string
  deleteSecret: string
}

export interface RecipeData {
  recipe: Recipe
}

export interface IRecipesByType {
  recipesByMealType: [Recipe]
}

export interface RecipeVars {
  recipeId: number
}

export interface RecipesTypeVars {
  mealType: MealTypeEnum
}

export interface Recipe {
  id: number
  title: string
  difficulty: DifficultyEnum
  cost: CostEnum
  mealType: MealTypeEnum
  hashtags: [string]
  ingredients: [string]
  method: [string]
  lowResolution?: string
  recipeAttribution?: RecipeAttribution
  standardResolution?: string
  videoUrl?: string
}

export interface RecipeAttribution {
  id: number
  name: string
  website: string
  email: string
  facebook: string
  instagram: string
  twitter: string
}

enum DifficultyEnum {
  Easy,
  Medium,
  Hard
}

enum CostEnum {
  Budget,
  Moderate,
  Expensive
}

export enum MealTypeEnum {
  Breakfast = 'Breakfast',
  Lunch = 'Lunch',
  Dinner = 'Dinner',
  Snack = 'Snack'
}
